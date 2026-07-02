import { NextResponse } from "next/server";
import { getAllPages, savePage } from "@/lib/page-data";

export async function GET() {
  const pages = await getAllPages();
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, data } = body;

  if (!slug || !data) {
    return NextResponse.json(
      { error: "slug and data are required" },
      { status: 400 }
    );
  }

  const page = await savePage(slug, data);
  return NextResponse.json(page, { status: 201 });
}
