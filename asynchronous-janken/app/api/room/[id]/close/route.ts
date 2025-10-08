import type { NextRequest } from "next/server";
export const runtime = "edge";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/close`;

  const res = await fetch(url, { method: "POST" });
  return new Response(res.body, { status: res.status, headers: res.headers });
}
