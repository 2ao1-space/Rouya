export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${formatted} ج.م`;
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
