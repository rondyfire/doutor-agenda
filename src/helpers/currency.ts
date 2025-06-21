export function formatCurrency(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

export function parseCurrency(value: string): number {
  const cleanValue = value.replace(/[^\d,]/g, "").replace(",", ".");
  const number = parseFloat(cleanValue);
  return Math.round(number * 100);
} 