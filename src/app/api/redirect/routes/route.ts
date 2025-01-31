import { fetchRoutes, updateRoute } from "@/lib/redirect";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await fetchRoutes();
  if (error) {
    console.error("Failed to fetch routes:", error);
    return NextResponse.json(
      { message: "Failed to fetch routes" },
      { status: 500 }
    );
  } else {
    return NextResponse.json({ data }, { status: 200 });
  }
}

interface PutRequestBody {
  uuid: string;
  url: string;
  description: string | null;
}

export async function PUT(request: Request) {
  try {
    const body: PutRequestBody = await request.json();
    const { uuid, url, description } = body;
    const { data, error } = await updateRoute(uuid, url, description);

    if (error) {
      console.error("Failed to update route:", error);
      return NextResponse.json(
        { message: "Failed to update route" },
        { status: 500 }
      );
    } else {
      return NextResponse.json({ data }, { status: 200 });
    }
  } catch (err) {
    console.error("Error parsing request body:", err);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}
