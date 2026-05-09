export function formatEgp(amount: number | string | { toNumber: () => number }): string {
  const value = typeof amount === 'object' ? amount.toNumber() : Number(amount);
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatEgpSimple(amount: number | string): string {
  const value = Number(amount);
  return `EGP ${value.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
