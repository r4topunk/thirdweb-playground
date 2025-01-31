import { getContract } from "@/lib/thirdweb/server";
import { NextResponse } from "next/server";
import { readContract } from "thirdweb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const address = (await params).address;
    console.log("Getting next tokenid for:", address);
    if (typeof address !== "string") {
      throw new Error("Invalid address");
    }

    const contract = getContract(address);

    const nextTokenIdToMint = await readContract({
      contract,
      method: "function nextTokenIdToMint() view returns (uint256)",
      params: [],
    });
    console.log("Next token ID to mint:", nextTokenIdToMint);

    return NextResponse.json(
      { data: Number(nextTokenIdToMint) },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error parsing request body:", err);
    const message =
      err instanceof Error ? err.message.replace("\n", " ") : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
