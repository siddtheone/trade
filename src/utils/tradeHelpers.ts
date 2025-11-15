import type { TradeRow } from "../mockTrades";

export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value ?? "";
  return date.toLocaleDateString("en-GB");
};

export const formatTradeId = (value?: string | number) => {
  if (value === null || value === undefined) return "";
  return `T-${value}`;
};

export const getExpirationStatus = (
  maturityDate?: string,
  referenceDate: Date = new Date()
) => {
  if (!maturityDate) return "N";
  const maturity = new Date(maturityDate);
  if (Number.isNaN(maturity.getTime())) return "N";
  return maturity.getTime() < referenceDate.getTime() ? "Y" : "N";
};

export const isValidMaturityDate = (value: string) => {
  const entered = new Date(value);
  if (Number.isNaN(entered.getTime())) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return entered.getTime() >= today.getTime();
};

export const sortTrades = (trades: TradeRow[]) =>
  trades.slice().sort((a, b) => {
    if (a.tradeId !== b.tradeId) {
      return a.tradeId - b.tradeId;
    }
    return b.version - a.version;
  });

export const toISODateString = (value: string) => {
  if (!value) {
    return new Date().toISOString();
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  return date.toISOString();
};
