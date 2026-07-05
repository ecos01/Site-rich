export type Product = {
  id: string;
  name: string;
  price: string;
  img: string;
  category: 'Outerwear' | 'Tops' | 'Bottoms' | 'Shoes';
  featured?: boolean;
  isNew?: boolean;
  salePrice?: string;
  // Shopify wiring — present when data comes from the Storefront API, absent for the
  // hardcoded fallback catalog below. variantId is what the cart/checkout needs.
  variantId?: string;
  handle?: string;
};

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Poster Coat 01', price: '€480', img: '/products/p1.svg', category: 'Outerwear', featured: true },
  { id: 'p2', name: 'Grid Shirt 02', price: '€160', img: '/products/p2.svg', category: 'Tops', featured: true },
  { id: 'p3', name: 'Blur Hoodie 03', price: '€240', img: '/products/p3.svg', category: 'Tops', featured: true },
  { id: 'p4', name: 'Kerning Pant 04', price: '€210', salePrice: '€150', img: '/products/p4.svg', category: 'Bottoms' },
  { id: 'p5', name: 'Multiply Tee 05', price: '€90', img: '/products/p5.svg', category: 'Tops', isNew: true },
  { id: 'p6', name: 'Baseline Boot 06', price: '€390', img: '/products/p6.svg', category: 'Shoes', featured: true, isNew: true },
  { id: 'p7', name: 'Offset Runner 07', price: '€320', salePrice: '€250', img: '/products/p7.svg', category: 'Shoes', isNew: true },
  { id: 'p8', name: 'Overprint Derby 08', price: '€410', img: '/products/p8.svg', category: 'Shoes', isNew: true },
];

export const FEATURED = PRODUCTS.filter((p) => p.featured);
export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.isNew);
