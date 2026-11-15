// Genera el SQL para sincronizar precios del catálogo con Supabase (public.products).
// Uso: node scripts/products-sql.mjs > /tmp/products.sql
import { readFileSync } from "node:fs";
const PRODUCTS = JSON.parse(readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8"));
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const rows = PRODUCTS.map((p) => `(${q(p.sku)}, ${q(p.name)}, ${Number(p.price).toFixed(2)}, ${q(p.category)}, true)`);
console.log("update public.products set active = false;");
if (rows.length) {
  console.log(`insert into public.products (sku, name, price, category, active) values\n  ${rows.join(",\n  ")}\non conflict (sku) do update set name = excluded.name, price = excluded.price, category = excluded.category, active = true, updated_at = now();`);
}
