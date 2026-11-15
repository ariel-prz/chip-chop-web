// Catálogo. Cada producto genera su propia página estática con schema Product.
// Para agregar uno: copia un bloque, cambia los datos y corre `npm run build`.
// Después sincroniza precios con Supabase: `npm run sync:sql` y ejecuta el SQL generado.
// Regla: nunca publicar un precio o dato que no sea real.

import catalog from "./catalog.json";

export type Species = "perro" | "gato" | "conejo" | "pez";
export type Category =
  | "alimento-seco"
  | "alimento-humedo"
  | "snacks"
  | "masticables"
  | "antiparasitarios"
  | "suplementos"
  | "higiene"
  | "accesorios"
  | "juguetes";

export type Product = {
  sku: string; // código interno único: "CC-" + número de la foto original
  slug: string; // URL legible
  name: string;
  brand?: string;
  species: Species[];
  category: Category;
  price: number; // USD, precio de venta al público
  size?: string; // presentación: "Funda 2 kg", "Sobre 85 g"
  description: string;
  image?: string; // /img/productos/<producto-presentacion-especie-categoria>.webp (800x800); existe también -400.webp
  featured?: boolean;
};

export const SPECIES_LABEL: Record<Species, { singular: string; plural: string; slug: string }> = {
  perro: { singular: "perro", plural: "perros", slug: "perros" },
  gato: { singular: "gato", plural: "gatos", slug: "gatos" },
  conejo: { singular: "conejo", plural: "conejos", slug: "conejos" },
  pez: { singular: "pez", plural: "peces", slug: "peces" },
};

export const CATEGORY_LABEL: Record<Category, string> = {
  "alimento-seco": "Alimento seco",
  "alimento-humedo": "Alimento húmedo",
  snacks: "Snacks y premios",
  masticables: "Masticables",
  antiparasitarios: "Antiparasitarios",
  suplementos: "Suplementos",
  higiene: "Higiene y cuidado",
  accesorios: "Accesorios",
  juguetes: "Juguetes",
};

// Catálogo generado desde el CSV con scripts/import_catalog.py. Para cambiar precios o
// agregar productos, edita el CSV y vuelve a correr el script (o edita catalog.json).
export const PRODUCTS: Product[] = catalog as Product[];

export function thumbOf(image: string) {
  return image.replace(/\.webp$/, "-400.webp");
}

export function productsBySpecies(s: Species) {
  return PRODUCTS.filter((p) => p.species.includes(s));
}

export function formatUSD(n: number) {
  return `$${n.toFixed(2)}`;
}
