import { createRedirect } from "@/lib/redirect";
import { NextResponse } from "next/server";

interface RedirectInsertType {
  url: string;
  description: string | null;
}

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const redirects: RedirectInsertType[] = res.data;
    const { data, error } = await createRedirect(redirects);
    if (error) {
      console.error("Failed to create route:", error);
      return NextResponse.json(
        { message: "Failed to create route" },
        { status: 500 }
      );
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error parsing request body:", err);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}
