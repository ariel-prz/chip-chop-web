import {
  Bath,
  Bone,
  Cat,
  Cookie,
  Dog,
  Fish,
  Package,
  Pill,
  Puzzle,
  Rabbit,
  ShieldCheck,
  Soup,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { Category, Species } from "@/data/products";

// Íconos Lucide: se dibujan como SVG en el HTML (no agregan JavaScript al navegador).
export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  "alimento-seco": Package,
  "alimento-humedo": Soup,
  snacks: Cookie,
  masticables: Bone,
  antiparasitarios: ShieldCheck,
  suplementos: Pill,
  higiene: Bath,
  accesorios: Utensils,
  juguetes: Puzzle,
};

export const SPECIES_ICON: Record<Species, LucideIcon> = {
  perro: Dog,
  gato: Cat,
  conejo: Rabbit,
  pez: Fish,
};
