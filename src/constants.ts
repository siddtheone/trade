export const COUNTER_PARTY_OPTIONS = [
  "CP-1",
  "CP-2",
  "CP-3",
  "CP-4",
  "CP-5",
] as const;

export const BOOK_OPTIONS = ["B1", "B2", "B3", "B4", "B5"] as const;

export type CounterPartyId = (typeof COUNTER_PARTY_OPTIONS)[number];
export type BookId = (typeof BOOK_OPTIONS)[number];

