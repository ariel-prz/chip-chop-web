import { CATEGORY_LABEL, PRODUCTS, SPECIES_LABEL } from "@/data/products";
import { BLACK_FRIDAY, promoPrice } from "@/data/promos";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// Catálogo en JSON para agentes y para las herramientas WebMCP/MCP.
// Precio de lista y, si hay promoción vigente, el precio con descuento.
export function GET() {
  const items = PRODUCTS.map((p) => {
    const onSale = BLACK_FRIDAY.active && p.category === BLACK_FRIDAY.category;
    return {
      sku: p.sku,
      nombre: p.name,
      marca: p.brand ?? null,
      presentacion: p.size ?? null,
      especies: p.species.map((s) => SPECIES_LABEL[s].plural),
      categoria: CATEGORY_LABEL[p.category],
      categoria_id: p.category,
      precio: p.price,
      ...(onSale
        ? {
            precio_promocion: promoPrice(p.price, BLACK_FRIDAY.pct),
            promocion: `${BLACK_FRIDAY.title}: ${BLACK_FRIDAY.pct} % hasta ${BLACK_FRIDAY.endsAt.slice(0, 10)}`,
          }
        : {}),
      moneda: "USD",
      url: `${SITE.url}/productos/${p.slug}/`,
      imagen: p.image ? `${SITE.url}${p.image}` : null,
    };
  });
  const body = {
    tienda: SITE.name,
    url: SITE.url,
    actualizado: SITE.lastUpdated,
    moneda: "USD",
    total: items.length,
    productos: items,
  };
  return new Response(JSON.stringify(body, null, 1), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
