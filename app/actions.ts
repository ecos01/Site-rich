// Placeholder until the cart is wired to Hydrogen via a route action.
// ProductCard only renders the buy form when a product has a variantId, which the
// fallback catalog lacks — so this is never actually invoked yet.
export async function buyNow(_formData: FormData): Promise<void> {
  throw new Error('Cart not wired yet — coming with the Hydrogen data layer.');
}
