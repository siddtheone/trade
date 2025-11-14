import { faker } from "@faker-js/faker";

export interface TradeRow {
  tradeId: number;
  version: number;
  counterPartyId: string;
  bookId: string;
  maturityDate: string;
  createdDate: string;
}

const TOTAL_TRADES = 50;
const UNIQUE_TRADES = 40;

export function getMockTrades(): TradeRow[] {
  const trades: TradeRow[] = [];
  const tradeIdPool: number[] = [];
  // 400 unique trade IDs
  for (let i = 1; i <= UNIQUE_TRADES; i++) {
    const tradeId = i;
    tradeIdPool.push(tradeId);
    const base: Omit<TradeRow, "tradeId" | "version"> = {
      counterPartyId: `CP-${faker.number.int({ min: 1, max: 5 })}`,
      bookId: `B${faker.number.int({ min: 1, max: 5 })}`,
      maturityDate: faker.date.future().toISOString(),
      createdDate: faker.date.past().toISOString(),
    };
    trades.push({ tradeId, version: 1, ...base });
  }
  // The remaining 100 records: Pick random tradeIDs and increment versions (no missing)
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
    // skip gaps: must use next version
    const base: Omit<TradeRow, "tradeId" | "version"> = {
      counterPartyId: `CP-${faker.number.int({ min: 1, max: 5 })}`,
      bookId: `B${faker.number.int({ min: 1, max: 5 })}`,
      maturityDate: faker.date.future().toISOString(),
      createdDate: faker.date.past().toISOString(),
    };
    trades.push({ tradeId: picked, version: extraVersions[picked], ...base });
    shortfall--;
  }

  return trades;
}
