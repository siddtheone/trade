import { faker } from "@faker-js/faker";

export interface TradeRow {
  tradeId: number;
  version: number;
  counterPartyId: string;
  bookId: string;
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
    counterPartyId: `CP-${faker.number.int({ min: 1, max: 5 })}`,
    bookId: `B${faker.number.int({ min: 1, max: 5 })}`,
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
