export const runtime = "edge";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/close`;

  const res = await fetch(url, { method: "POST" });
  return new Response(res.body, { status: res.status, headers: res.headers });
}

