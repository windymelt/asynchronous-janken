import type { Participant, UserId } from "@/lib/types";

export interface WinnerResult {
  winnerId: UserId;
  winnerIndex: number;
}

export function calcWinner(
  participants: Participant[],
  hands: Record<UserId, number>
): WinnerResult | null {
  const n = participants.length;
  if (n === 0) return null;

  let hasAnyHand = false;
  let sum = 0;
  for (const p of participants) {
    const v = hands[p.id];
    if (typeof v === "number" && Number.isFinite(v)) {
      hasAnyHand = true;
      sum += Math.trunc(v);
    }
  }

  if (!hasAnyHand) return null;

  const idx = ((sum % n) + n) % n; // normalize for negative sums
  const winner = participants[idx];
  return { winnerId: winner.id, winnerIndex: idx };
}

