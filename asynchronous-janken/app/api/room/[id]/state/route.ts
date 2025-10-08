export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const origin = new URL(request.url).origin;
  const url = `${origin}/do/room/${encodeURIComponent(id)}/state`;

  const res = await fetch(url, { method: "GET" });
  return new Response(res.body, { status: res.status, headers: res.headers });
}

