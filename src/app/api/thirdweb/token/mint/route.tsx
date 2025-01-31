import { POAP_CONTRACT } from "@/constants";
import { mintNewPoap, twClient } from "@/lib/thirdweb/server";
import { NextResponse } from "next/server";
import { resolveScheme } from "thirdweb/storage";

export async function POST() {
  try {
    // const contractAddress = "0x4D3423981762797Bc0381A6CeFd4D05B8B62bA70";
    const poapName = `You've met r4topunk in Paris FW 25`;
    const uri = resolveScheme({
      uri: "ipfs://QmdLqeRVDghAzzLZFhpefaKvNzHAoHDfKG3xQeLdpaBhsL/piet%20paris%20fw%202025.jpg",
      client: twClient,
    });
    console.log(uri);
    const newPoap = await mintNewPoap(POAP_CONTRACT, poapName, uri);

    return NextResponse.json({ data: newPoap }, { status: 200 });
  } catch (err) {
    console.error("Error parsing request body:", err);
    const message =
      err instanceof Error ? err.message.replace("\n", " ") : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
