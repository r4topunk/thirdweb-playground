import { SERVICE_URL } from "@/constants";
import { erc1155MintTo } from "@/lib/thirdweb/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { toAddress } = await request.json();
    console.log("Tokengating NFT to address:", toAddress);
    console.log("Request payload:", { toAddress });

    console.log("Fetching tokengate data from service...");
    const cookies = request.cookies;

    const poapJwt = cookies.get("x-poap-auth");
    console.log("POAP JWT:", poapJwt?.value);
    const req = await fetch(`${SERVICE_URL}/tokengate`, {
      method: "POST",
      headers: {
        Authorization: poapJwt?.value || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_address: toAddress }),
    });
    console.log("Received response from tokengate service:", req.status);
    const json = await req.json();
    console.log("Tokengate service response JSON:", json);
    if (!poapJwt || !req.ok) {
      console.log({ poapJwt, json });
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    console.log("Checking POAP token presence...");
    const poap = json?.poap;
    console.log("POAP object:", poap);
    if (!poap) {
      return NextResponse.json(
        { message: "User does not have a POAP token" },
        { status: 400 }
      );
    }

    // const contractAdress = "0x4D3423981762797Bc0381A6CeFd4D05B8B62bA70";
    // const contract = getContract(poap.address);

    // const ownedTokenIds = await getOwnedTokenIds({
    //   contract,
    //   address: toAddress,
    // });

    // console.log("Owned token IDs:", ownedTokenIds);
    // if (
    //   ownedTokenIds.some(
    //     (token) =>
    //       token.tokenId === BigInt(poap.tokenId) && token.balance > BigInt(0)
    //   )
    // ) {
    //   return NextResponse.json(
    //     { message: "User already owns the token" },
    //     { status: 400 }
    //   );
    // }

    console.log("Initiating minting transaction...");
    const txResult = await erc1155MintTo(poap.address, toAddress, poap.tokenId);
    console.log("Transaction result:", txResult);
    // console.log("Owned NFTs:", serializedNFTs);

    console.log("Storing claim with service...");
    const claimResponse = await fetch(`${SERVICE_URL}/claim-nft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: poapJwt?.value || "",
      },
      body: JSON.stringify({
        user_address: toAddress,
        token_address: poap.address,
        token_id: poap.tokenId,
        chain_id: poap.chainId,
      }),
    });
    const claimResponseData = await claimResponse.json();
    console.log("Claim response data:", claimResponseData);
    console.log("Claim response status:", claimResponse.status);
    if (!claimResponse.ok) {
      const errorData = await claimResponse.json();
      console.error("Failed to store the claim:", errorData);
      return NextResponse.json(
        { message: "Failed to store the claim" },
        { status: 500 }
      );
    }

    const error = null;
    if (error) {
      console.error("Failed to create route:", error);
      return NextResponse.json(
        { message: "Failed to create route" },
        { status: 500 }
      );
    }
    console.log("Finalizing response to the client.");
    return NextResponse.json({ data: null }, { status: 200 });
  } catch (err) {
    console.error("Error parsing request body:", err);
    const message =
      err instanceof Error ? err.message.replace("\n", " ") : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
