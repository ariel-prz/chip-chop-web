import type { Metadata } from "next";
import { SITE } from "@/lib/site";

// Metadatos por página: title único, description de 140-160 caracteres,
// canonical absoluto y Open Graph completo (SEO #1, #2, #5).
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  const image = opts.image ?? "/img/og-image.jpg";
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_EC",
      siteName: SITE.name,
      url,
      title: opts.title,
      description: opts.description,
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE.name}, pet shop en Quito` }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
