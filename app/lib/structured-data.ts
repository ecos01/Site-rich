// JSON-LD builders. Plain objects only — rendering happens in <JsonLd> (components/JsonLd.tsx).

const BRAND = 'LAB19';

export function organizationSchema(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: origin,
    logo: `${origin}/favicon.svg`,
    sameAs: ['https://instagram.com', 'https://twitter.com'],
  };
}

export function websiteSchema(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: origin,
    inLanguage: 'it',
  };
}

export function breadcrumbSchema(items: Array<{name: string; url?: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? {item: item.url} : {}),
    })),
  };
}

export function productSchema({
  product,
  price,
  url,
  inStock,
}: {
  product: {
    title: string;
    descriptionHtml?: string;
    vendor?: string;
    featuredImage?: {url: string} | null;
  };
  price: {amount: string; currencyCode: string};
  url: string;
  inStock: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.descriptionHtml
      ?.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500),
    image: product.featuredImage?.url,
    brand: product.vendor ? {'@type': 'Brand', name: product.vendor} : {'@type': 'Brand', name: BRAND},
    offers: {
      '@type': 'Offer',
      url,
      price: price.amount,
      priceCurrency: price.currencyCode,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}
