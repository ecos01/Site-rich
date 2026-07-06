// Unisex footwear size chart (US/EU/UK/cm) — matches the New Balance conversion
// scale used across the shop.
export const SHOE_SIZE_CHART = [
  {us: '4.5', eu: '37', uk: '4', cm: 22.5},
  {us: '5', eu: '37.5', uk: '4.5', cm: 23},
  {us: '5.5', eu: '38', uk: '5', cm: 23.5},
  {us: '6', eu: '38.5', uk: '5.5', cm: 24},
  {us: '6.5', eu: '39.5', uk: '6', cm: 24.5},
  {us: '7', eu: '40', uk: '6.5', cm: 25},
  {us: '7.5', eu: '40.5', uk: '7', cm: 25.5},
  {us: '8', eu: '41.5', uk: '7.5', cm: 26},
  {us: '8.5', eu: '42', uk: '8', cm: 26.5},
  {us: '9', eu: '42.5', uk: '8.5', cm: 27},
  {us: '9.5', eu: '43', uk: '9', cm: 27.5},
  {us: '10', eu: '44', uk: '9.5', cm: 28},
  {us: '10.5', eu: '44.5', uk: '10', cm: 28.5},
  {us: '11', eu: '45', uk: '10.5', cm: 29},
  {us: '11.5', eu: '45.5', uk: '11', cm: 29.5},
  {us: '12', eu: '46.5', uk: '11.5', cm: 30},
  {us: '12.5', eu: '47', uk: '12', cm: 30.5},
] as const;

const US_TO_EU = new Map<string, string>(
  SHOE_SIZE_CHART.map((row) => [row.us, row.eu]),
);

// Shopify shoe variants here are seeded with US sizing; the storefront always
// displays EU sizing. Falls back to the raw value for anything not in the table
// (already-EU values, "One Size", etc).
export function toEuSize(rawValue: string): string {
  return US_TO_EU.get(rawValue.trim()) ?? rawValue;
}
