// LAB19 sneakers brand roster (lab19sneakers.com)
export const BRANDS: string[] = [
  'Adidas',
  'Air Jordan',
  'Asics',
  'Baby Sneakers',
  'New Balance',
  'Nike',
  'Puma LaMelo',
  'YS-01',
];

export const ALPHABET = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// First letter used for grouping ("YS-01" -> "Y", digits -> "#").
export function brandLetter(name: string): string {
  const c = name[0].toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

// "New Balance" -> "new-balance", "YS-01" -> "ys-01"
export function brandSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
