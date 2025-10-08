export const runtime = "edge";

type InitBody = {
  name: string; // room name (<=32 chars)
  creatorId: string;
  creatorName: string; // (<=32 chars)
  maxParticipants?: number;
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/init`;

  const body = (await request.json().catch(() => ({}))) as Partial<InitBody>;
  const name = body.name?.trim();
  const creatorId = body.creatorId;
  const creatorName = body.creatorName?.trim();
  const maxParticipants = body.maxParticipants;

  if (!name || !creatorId || !creatorName) {
    return new Response("Missing required fields", { status: 400 });
  }
  if (name.length > 32) return new Response("Room name too long", { status: 400 });
  if (creatorName.length > 32) return new Response("Creator name too long", { status: 400 });
  if (
    maxParticipants !== undefined &&
    (!Number.isInteger(maxParticipants) || maxParticipants <= 0)
  ) {
    return new Response("Invalid maxParticipants", { status: 400 });
  }

  const payload: InitBody = { name, creatorId, creatorName, maxParticipants } as InitBody;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
}
