export type Cuid = `c${string}`;

export type UserId = Cuid;
export type RoomId = Cuid;

export interface Participant {
  id: UserId;
  name: string; // max 32 chars (validate at boundaries)
  joinedAt: string; // ISO timestamp
  hand?: number; // submitted integer hand
}

export interface Room {
  id: RoomId;
  name: string; // max 32 chars
  creatorId: UserId;
  maxParticipants?: number;
  participants: Participant[];
  hands: Record<UserId, number>;
  closed: boolean;
  winnerId?: UserId;
}

export interface JoinEvent {
  type: "join";
  name: string;
}

export interface PlayHandEvent {
  type: "playHand";
  userId: UserId;
  value: number;
}

export interface CloseEvent {
  type: "close";
}

export type RoomEvent = JoinEvent | PlayHandEvent | CloseEvent;

