// Genera el SQL para sincronizar precios del catálogo con Supabase (public.products).
// Uso: node --experimental-strip-types scripts/products-sql.mjs > /tmp/products.sql
const { PRODUCTS } = await import("../src/data/products.ts");
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const rows = PRODUCTS.map((p) => `(${q(p.sku)}, ${q(p.name)}, ${p.price.toFixed(2)}, true)`);
console.log("begin;");
console.log("update public.products set active = false;");
if (rows.length) {
  console.log(`insert into public.products (sku, name, price, active) values\n  ${rows.join(",\n  ")}\non conflict (sku) do update set name = excluded.name, price = excluded.price, active = true, updated_at = now();`);
}
console.log("commit;");
