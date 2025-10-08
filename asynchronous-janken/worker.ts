export { RoomDO } from "./lib/room-do";

export default {
  async fetch(request, env) {
    // Delegate all requests to the OpenNext bundle (if present)
    // and reserve DO subpaths for direct DO interaction if needed.
    const url = new URL(request.url);
    if (url.pathname.startsWith("/do/room/")) {
      const idOrName = url.pathname.replace("/do/room/", "");
      const id = env.ROOMS.idFromString(idOrName);
      const stub = env.ROOMS.get(id);
      return stub.fetch(request);
    }

    // Fall-through to OpenNext bundle for normal Next.js handling.
    // The OpenNext worker is generated at build time; import dynamically if needed,
    // but here we simply 404 if not present to avoid circular imports.
    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<CloudflareEnv>;

