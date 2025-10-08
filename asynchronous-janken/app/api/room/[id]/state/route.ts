import type { NextRequest } from "next/server";
export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string | string[] | undefined }> }
) {
  const { id } = await params;
  if (!id || Array.isArray(id)) return new Response("Invalid id", { status: 400 });
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/state`;

  const res = await fetch(url, { method: "GET" });
  return new Response(res.body, { status: res.status, headers: res.headers });
}
