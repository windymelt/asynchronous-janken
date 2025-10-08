export const runtime = "edge";

type JoinBody = {
  name: string; // participant name (<=32 chars)
  userId: string;
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/join`;

  const body = (await request.json().catch(() => ({}))) as Partial<JoinBody>;
  const name = body.name?.trim();
  const userId = body.userId;

  if (!name || !userId) {
    return new Response("Missing required fields", { status: 400 });
  }
  if (name.length > 32) return new Response("Name too long", { status: 400 });

  const payload: JoinBody = { name, userId } as JoinBody;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
}

