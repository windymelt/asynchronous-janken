import type { RoomDO } from "@/lib/room-do";

declare global {
  namespace Cloudflare {
    interface Env {
      TURNSTILE_SITE_KEY: string;
      TURNSTILE_SECRET_KEY: string;
      ROOMS: DurableObjectNamespace<RoomDO>;
    }
  }
}

export {};
