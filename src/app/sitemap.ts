import type { MetadataRoute } from "next";
import { PRODUCTS, productsBySpecies, SPECIES_LABEL, type Species } from "@/data/products";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${SITE.lastUpdated}T12:00:00-05:00`);
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  });
  return [
    page("/", 1),
    page("/productos/", 0.9),
    ...(Object.keys(SPECIES_LABEL) as Species[])
      .filter((s) => productsBySpecies(s).length > 0)
      .map((s) => page(`/${SPECIES_LABEL[s].slug}/`, 0.8)),
    ...PRODUCTS.map((p) => page(`/productos/${p.slug}/`, 0.7)),
    page("/como-comprar/", 0.7),
    page("/envios/", 0.7),
    page("/preguntas-frecuentes/", 0.7),
    page("/seguros-para-mascotas/", 0.7),
    page("/nosotros/", 0.6),
    page("/privacidad/", 0.3),
  ];
}
