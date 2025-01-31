import { SERVICE_URL } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { toAddress, uuid } = await request.json();
    console.log("Tokengating NFT to address:", toAddress);
    if (!toAddress) {
      return NextResponse.json(
        { message: "Missing required field 'toAddress'" },
        { status: 400 }
      );
    }

    const cookies = request.cookies;
    const poapJwt = cookies.get("x-poap-auth");
    if (poapJwt?.value) {
      const req = await fetch(`${SERVICE_URL}/tokengate`, {
        method: "POST",
        headers: {
          Authorization: poapJwt?.value || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_address: toAddress }),
      });
      const json = await req.json();
      return NextResponse.json(
        { userOwnsToken: json?.hasToken || false },
        { status: 200 }
      );
    } else {
      const req = await fetch(`${SERVICE_URL}/tokengate/uuid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_address: toAddress, uuid }),
      });
      const json = await req.json();
      return NextResponse.json(
        { userOwnsToken: json?.hasToken || false },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Error parsing request body:", err);
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
