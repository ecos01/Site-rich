import { cache } from "react";
import { PRODUCTS, FEATURED, NEW_ARRIVALS, type Product } from "@/lib/products";

// Headless Shopify layer. When the two env vars are set, products + checkout come
// from the Storefront API; otherwise everything falls back to the hardcoded catalog
// in lib/products.ts so the site keeps running with no store attached.
//
// Setup: Shopify admin → Settings → Apps → Develop apps → create app → enable
// Storefront API → copy the access token. Then set in .env.local:
//   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
//   SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
// ponytail: pinned to a released version; bump via env when Shopify deprecates it.
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-04";

export const isShopifyConfigured = Boolean(DOMAIN && TOKEN);

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    // Next 16: fetch is uncached by default. Revalidate products every 60s.
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as GqlResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}

// --- Products ---------------------------------------------------------------

const money = (amount: string, currency: string) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    Number(amount)
  );

// Shopify productType is free text; map it onto our four categories.
const CATEGORY_MAP: Record<string, Product["category"]> = {
  outerwear: "Outerwear",
  capispalla: "Outerwear",
  tops: "Tops",
  top: "Tops",
  bottoms: "Bottoms",
  pants: "Bottoms",
  shoes: "Shoes",
  sneakers: "Shoes",
  footwear: "Shoes",
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  tags: string[];
  featuredImage: { url: string } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: { id: string }[] };
};

function toProduct(n: ShopifyProductNode): Product {
  const price = n.priceRange.minVariantPrice;
  const compare = n.compareAtPriceRange.minVariantPrice;
  const onSale = Number(compare.amount) > Number(price.amount);
  const tags = n.tags.map((t) => t.toLowerCase());
  return {
    id: n.id,
    name: n.title,
    // Shopify: compareAt is the original (higher) price, price is the current one.
    price: money((onSale ? compare : price).amount, price.currencyCode),
    salePrice: onSale ? money(price.amount, price.currencyCode) : undefined,
    img: n.featuredImage?.url ?? "/products/p1.svg",
    category: CATEGORY_MAP[n.productType?.toLowerCase()] ?? "Tops",
    featured: tags.includes("featured"),
    isNew: tags.includes("new"),
    variantId: n.variants.nodes[0]?.id,
    handle: n.handle,
  };
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        productType
        tags
        featuredImage { url }
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { id } }
      }
    }
  }
`;

// cache(): dedupes repeat calls within one request (multiple pages/components).
export const getProducts = cache(async (): Promise<Product[]> => {
  if (!isShopifyConfigured) return PRODUCTS;
  try {
    const data = await shopifyFetch<{ products: { nodes: ShopifyProductNode[] } }>(
      PRODUCTS_QUERY,
      { first: 100 }
    );
    return data.products.nodes.map(toProduct);
  } catch (err) {
    console.error("[shopify] getProducts failed, using fallback:", err);
    return PRODUCTS;
  }
});

export async function getFeatured(): Promise<Product[]> {
  if (!isShopifyConfigured) return FEATURED;
  return (await getProducts()).filter((p) => p.featured);
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!isShopifyConfigured) return NEW_ARRIVALS;
  return (await getProducts()).filter((p) => p.isNew);
}

// --- Cart / checkout --------------------------------------------------------

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

// Creates a Shopify cart with one line and returns the hosted checkout URL.
// Redirecting the browser there hands payment/PCI/tax/shipping to Shopify.
export async function createCheckoutUrl(variantId: string, quantity = 1): Promise<string> {
  if (!isShopifyConfigured) throw new Error("Shopify not configured");
  const data = await shopifyFetch<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(CART_CREATE, { lines: [{ merchandiseId: variantId, quantity }] });
  const url = data.cartCreate.cart?.checkoutUrl;
  if (!url) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; ") || "cartCreate failed");
  }
  return url;
}
