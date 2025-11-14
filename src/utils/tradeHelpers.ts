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


