import { createId } from "@paralleldrive/cuid2";
import type { Cuid, RoomId, UserId } from "@/lib/types";

export const makeCuid = (): Cuid => `c${createId()}` as Cuid;

export const makeUserId = (): UserId => makeCuid() as UserId;
export const makeRoomId = (): RoomId => makeCuid() as RoomId;

