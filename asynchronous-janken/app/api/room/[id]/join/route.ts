import type { NextRequest } from "next/server";
import { parse } from "valibot";
import { JoinSchema } from "@/lib/schemas";
export const runtime = "edge";

type JoinBody = {
  name: string; // participant name (<=32 chars)
  userId: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string | string[] | undefined }> }
) {
  const { id } = await params;
  if (!id || Array.isArray(id)) return new Response("Invalid id", { status: 400 });
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/join`;

  const raw = (await request.json().catch(() => ({}))) as unknown;
  let payload: JoinBody;
  try {
    payload = parse(JoinSchema, raw) as JoinBody;
  } catch (e) {
    return new Response("Invalid payload", { status: 400 });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
}
