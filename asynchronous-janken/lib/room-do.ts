import { calcWinner } from "@/lib/game";
import { makeRoomId } from "@/lib/id";
import type { Participant, Room, RoomId, UserId } from "@/lib/types";

type DOState = DurableObjectState;

export class RoomDO {
  private state: DOState;
  private env: CloudflareEnv;
  private room: Room | null = null;

  constructor(state: DOState, env: CloudflareEnv) {
    this.state = state;
    this.env = env;
  }

  private async load(): Promise<Room | null> {
    if (this.room) return this.room;
    const stored = await this.state.storage.get<Room>("room");
    this.room = stored ?? null;
    return this.room;
  }

  private async save(room: Room): Promise<void> {
    this.room = room;
    await this.state.storage.put("room", room);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method === "POST" && url.pathname.endsWith("/init")) {
      const body = (await request.json().catch(() => ({}))) as Partial<{
        name: string;
        creatorId: UserId;
        maxParticipants?: number;
      }>;
      if (!body.name || !body.creatorId) {
        return new Response("Bad Request", { status: 400 });
      }
      if (body.name.length > 32) return new Response("Name too long", { status: 400 });
      const id = (await this.state.storage.get<Room>("room"))?.id ?? (makeRoomId() as RoomId);
      const now = new Date().toISOString();
      const room: Room = {
        id,
        name: body.name,
        creatorId: body.creatorId,
        maxParticipants: body.maxParticipants,
        participants: [
          { id: body.creatorId, name: "(creator)", joinedAt: now },
        ],
        hands: {},
        closed: false,
      };
      await this.save(room);
      return Response.json(room);
    }

    const room = await this.load();
    if (!room) return new Response("Not Found", { status: 404 });

    if (method === "GET" && url.pathname.endsWith("/state")) {
      return Response.json(room);
    }

    if (method === "POST" && url.pathname.endsWith("/join")) {
      const body = (await request.json().catch(() => ({}))) as Partial<{ name: string; userId: UserId }>;
      const name = body.name?.trim();
      const userId = body.userId as UserId | undefined;
      if (!name || !userId) return new Response("Bad Request", { status: 400 });
      if (name.length > 32) return new Response("Name too long", { status: 400 });
      if (room.closed) return new Response("Room closed", { status: 409 });
      if (room.maxParticipants && room.participants.length >= room.maxParticipants) {
        return new Response("Room full", { status: 409 });
      }
      if (!room.participants.some((p) => p.id === userId)) {
        const participant: Participant = { id: userId, name, joinedAt: new Date().toISOString() };
        room.participants.push(participant);
        await this.save(room);
      }
      return Response.json(room);
    }

    if (method === "POST" && url.pathname.endsWith("/hand")) {
      const body = (await request.json().catch(() => ({}))) as Partial<{ userId: UserId; value: number }>;
      const { userId, value } = body;
      if (!userId || typeof value !== "number" || !Number.isFinite(value)) {
        return new Response("Bad Request", { status: 400 });
      }
      if (room.closed) return new Response("Room closed", { status: 409 });
      if (!room.participants.some((p) => p.id === userId)) return new Response("Not a participant", { status: 403 });
      room.hands[userId] = Math.trunc(value);

      // auto-close when reaching maxParticipants
      if (room.maxParticipants && Object.keys(room.hands).length >= room.maxParticipants) {
        const res = calcWinner(room.participants, room.hands);
        if (res) {
          room.closed = true;
          room.winnerId = res.winnerId;
        }
      }
      await this.save(room);
      return Response.json(room);
    }

    if (method === "POST" && url.pathname.endsWith("/close")) {
      if (room.closed) return Response.json(room);
      const res = calcWinner(room.participants, room.hands);
      if (!res) return new Response("No hands", { status: 409 });
      room.closed = true;
      room.winnerId = res.winnerId;
      await this.save(room);
      return Response.json(room);
    }

    return new Response("Not Found", { status: 404 });
  }
}

