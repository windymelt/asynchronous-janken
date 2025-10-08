export const runtime = "edge";

type HandBody = {
  userId: string;
  value: number; // integer
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/hand`;

  const body = (await request.json().catch(() => ({}))) as Partial<HandBody>;
  const userId = body.userId;
  const value = body.value;

  if (!userId || typeof value !== "number" || !Number.isFinite(value)) {
    return new Response("Missing or invalid fields", { status: 400 });
  }
  if (!Number.isInteger(value)) {
    return new Response("Hand must be an integer", { status: 400 });
  }

  const payload: HandBody = { userId, value } as HandBody;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
}

