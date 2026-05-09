export function normalizeEgyptianPhone(raw: string): string {
  return raw
    .replace(/[\s\-]/g, '')
    .replace(/^\+20/, '0')
    .replace(/^0020/, '0');
}

export function isValidEgyptianPhone(raw: string): boolean {
  const normalized = normalizeEgyptianPhone(raw);
  return /^01[0125][0-9]{8}$/.test(normalized);
}
