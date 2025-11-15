import { faker } from "@faker-js/faker";
import type { BookId, CounterPartyId } from "./constants";
import { BOOK_OPTIONS, COUNTER_PARTY_OPTIONS } from "./constants";

export interface TradeRow {
  tradeId: number;
  version: number;
  counterPartyId: CounterPartyId;
  bookId: BookId;
  maturityDate: string;
  createdDate: string;
}

const TOTAL_TRADES = 250;
const UNIQUE_TRADES = 150;

export function getMockTrades(): TradeRow[] {
  const trades: TradeRow[] = [];
  const tradeIdPool: number[] = [];
  // Base for mock rows
  const buildTradeBase = (): Omit<TradeRow, "tradeId" | "version"> => ({
    counterPartyId: faker.helpers.arrayElement(COUNTER_PARTY_OPTIONS),
    bookId: faker.helpers.arrayElement(BOOK_OPTIONS),
    maturityDate:
      Math.random() < 0.33
        ? faker.date.past().toISOString()
        : faker.date.future().toISOString(),
    createdDate: faker.date.past().toISOString(),
  });

  // Unique trade ids
  for (let i = 1; i <= UNIQUE_TRADES; i++) {
    const tradeId = i;
    tradeIdPool.push(tradeId);
    trades.push({ tradeId, version: 1, ...buildTradeBase() });
  }
  // The remaining records: Pick random tradeIDs and increment versions (no missing)
  let shortfall = TOTAL_TRADES - trades.length;
  const extraVersions: Record<string, number> = {};
  while (shortfall > 0) {
    const picked = faker.helpers.arrayElement(tradeIdPool);
    if (!extraVersions[picked]) {
      // Find current max version for this tradeId
      const maxVer = trades.filter((t) => t.tradeId === picked).length;
      extraVersions[picked] = maxVer;
    }
    extraVersions[picked]++;
    trades.push({
      tradeId: picked,
      version: extraVersions[picked],
      ...buildTradeBase(),
    });
    shortfall--;
  }

  return trades;
}
