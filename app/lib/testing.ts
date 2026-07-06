// ponytail: real Shopify inventory isn't wired up yet (site is in testing), so every
// variant reads as in stock regardless of its actual availableForSale. Flip this off
// once real stock is connected.
export const FORCE_ALL_AVAILABLE = true;

export const isAvailable = (v: {availableForSale: boolean}) =>
  FORCE_ALL_AVAILABLE || v.availableForSale;

// ponytail: the lab19sneakers.com fixture's variant IDs are fake, so
// add-to-cart/checkout silently no-op against them. Reverted to live mock.shop
// (real cart works) until a real Storefront API token is wired up — then flip
// back to true, or better, delete the fixture path once real data replaces it.
export const USE_LOCAL_CATALOG = false;
