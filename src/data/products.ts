// Catálogo. Cada producto genera su propia página estática con schema Product.
// Para agregar uno: copia un bloque, cambia los datos y corre `npm run build`.
// Después sincroniza precios con Supabase: `npm run sync:sql` y ejecuta el SQL generado.
// Regla: nunca publicar un precio o dato que no sea real.

export type Species = "perro" | "gato" | "conejo" | "pez";
export type Category = "alimento" | "snacks" | "accesorios" | "higiene" | "acuario";

export type Product = {
  sku: string; // código interno único, sin espacios (ej. "ALI-PER-001")
  slug: string; // URL legible (ej. "alimento-perro-adulto-raza-mediana-2kg")
  name: string;
  brand?: string;
  species: Species[];
  category: Category;
  price: number; // USD, IVA incluido
  size?: string; // presentación: "2 kg", "500 g", "1 unidad"
  description: string; // 1 a 3 frases útiles: para quién es y qué aporta
  image?: string; // ruta en /public/img/productos/<slug>.webp (800x800)
  featured?: boolean;
};

export const SPECIES_LABEL: Record<Species, { singular: string; plural: string; slug: string }> = {
  perro: { singular: "perro", plural: "perros", slug: "perros" },
  gato: { singular: "gato", plural: "gatos", slug: "gatos" },
  conejo: { singular: "conejo", plural: "conejos", slug: "conejos" },
  pez: { singular: "pez", plural: "peces", slug: "peces" },
};

export const CATEGORY_LABEL: Record<Category, string> = {
  alimento: "Alimento",
  snacks: "Snacks y premios",
  accesorios: "Accesorios",
  higiene: "Higiene y cuidado",
  acuario: "Acuario",
};

export const PRODUCTS: Product[] = [
  // TODO(Ariel): pegar aquí los productos reales.
];

export function productsBySpecies(s: Species) {
  return PRODUCTS.filter((p) => p.species.includes(s));
}

export function formatUSD(n: number) {
  return `$${n.toFixed(2)}`;
}
