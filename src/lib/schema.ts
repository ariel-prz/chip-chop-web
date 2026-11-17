import { GEO, SITE, STORE_PHOTOS, fullAddress } from "@/lib/site";
import type { Faq } from "@/data/faq";
import type { Product } from "@/data/products";
import { BLACK_FRIDAY, promoPrice } from "@/data/promos";

const BIZ_ID = `${SITE.url}/#tienda`;

export function businessSchema() {
  const sameAs = [SITE.instagram, SITE.googleBusiness].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PetStore"],
    "@id": BIZ_ID,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    logo: `${SITE.url}/img/logo-512.png`,
    image: [
      `${SITE.url}/img/og-image.jpg`,
      ...STORE_PHOTOS.map((p) => `${SITE.url}/img/tienda/${p.file}-640.webp`),
    ],
    geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    telephone: SITE.phoneE164,
    priceRange: "$",
    currenciesAccepted: "USD",
    paymentAccepted: "Deuna",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: ["Quito Norte", "Quito Centro", "Quito Sur", "Valles de Quito"].map((name) => ({
      "@type": "Place",
      name,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneE164,
      contactType: "customer service",
      availableLanguage: "es",
    },
    hasMap: SITE.googleBusiness || undefined,
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#web`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.locale,
    publisher: { "@id": BIZ_ID },
  };
}

export function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function productSchema(p: Product) {
  // Durante la promoción, el precio del schema es el que se cobra, con fecha de vencimiento.
  const promo = BLACK_FRIDAY.active && p.category === BLACK_FRIDAY.category;
  const price = promo ? promoPrice(p.price, BLACK_FRIDAY.pct) : p.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    sku: p.sku,
    name: p.name,
    description: p.description,
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.image ? { image: `${SITE.url}${p.image}` } : {}),
    url: `${SITE.url}/productos/${p.slug}/`,
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "USD",
      ...(promo ? { priceValidUntil: BLACK_FRIDAY.endsAt.slice(0, 10) } : {}),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE.url}/productos/${p.slug}/`,
      seller: { "@id": BIZ_ID },
      availableAtOrFrom: { "@id": BIZ_ID },
    },
  };
}

// Lista de productos con precio y moneda, para que un agente lea precios sin JavaScript.
export function productListSchema(products: Product[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => {
      const { "@context": _c, ...prod } = productSchema(p) as Record<string, unknown>;
      return { "@type": "ListItem", position: i + 1, item: prod };
    }),
  };
}

export function itemListSchema(products: Product[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/productos/${p.slug}/`,
      name: p.name,
    })),
  };
}

export { fullAddress };
