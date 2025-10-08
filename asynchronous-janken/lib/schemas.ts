import { object, string, number, optional, minLength, maxLength, pipe, integer, minValue } from "valibot";

export const IdSchema = pipe(string(), minLength(2));

export const RoomInitSchema = object({
  name: pipe(string(), minLength(1), maxLength(32)),
  creatorId: IdSchema,
  creatorName: pipe(string(), minLength(1), maxLength(32)),
  maxParticipants: optional(pipe(number(), integer(), minValue(1))),
});

export const JoinSchema = object({
  name: pipe(string(), minLength(1), maxLength(32)),
  userId: IdSchema,
});

export const HandSchema = object({
  userId: IdSchema,
  value: pipe(number(), integer()),
});
