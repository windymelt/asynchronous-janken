import type { NextRequest } from "next/server";
import { parse } from "valibot";
import { RoomInitSchema } from "@/lib/schemas";
export const runtime = "edge";

type InitBody = {
  name: string; // room name (<=32 chars)
  creatorId: string;
  creatorName: string; // (<=32 chars)
  maxParticipants?: number;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string | string[] | undefined }> }
) {
  const { id } = await params;
  if (!id || Array.isArray(id)) return new Response("Invalid id", { status: 400 });
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/init`;

  const raw = (await request.json().catch(() => ({}))) as unknown;
  let payload: InitBody;
  try {
    const parsed = parse(RoomInitSchema, raw) as InitBody;
    payload = parsed;
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
