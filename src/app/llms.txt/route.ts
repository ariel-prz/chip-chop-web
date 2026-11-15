import { FAQ_GENERAL } from "@/data/faq";
import { formatUSD, PRODUCTS } from "@/data/products";
import { SITE, fullAddress } from "@/lib/site";
import { BLACK_FRIDAY } from "@/data/promos";

export const dynamic = "force-static";

// llms.txt: resumen en Markdown para asistentes de IA (propuesta llmstxt.org).
export function GET() {
  const products = PRODUCTS.length
    ? PRODUCTS.map((p) => `- [${p.name}](${SITE.url}/productos/${p.slug}/): ${formatUSD(p.price)}${p.size ? `, ${p.size}` : ""}`).join("\n")
    : "- Catálogo en carga; consultar por WhatsApp.";
  const body = `# ${SITE.name}

> ${SITE.description}

## Datos del negocio
- Dirección: ${fullAddress}
- Horario: ${SITE.hours.label}
- WhatsApp: ${SITE.phoneE164}
- Instagram: ${SITE.instagram}
- Pago en línea: Deuna (código QR). Cada pedido tiene un monto único con centavos que identifica el pago.
- Entrega: retiro en tienda sin costo, o envío con InDrive/Uber a Quito Norte, Centro, Sur y Valles, con costo según el sector, confirmado por WhatsApp.

${BLACK_FRIDAY.active ? `## Promoción vigente\n- ${BLACK_FRIDAY.title}: ${BLACK_FRIDAY.pct} % de descuento en todo el alimento seco, hasta el 27 de noviembre de 2026 a las 23:59 (hora de Quito).\n\n` : ""}## Páginas principales
- [Catálogo con precios](${SITE.url}/productos/)
- [Productos para perros](${SITE.url}/perros/)
- [Productos para gatos](${SITE.url}/gatos/)
- [Productos para conejos](${SITE.url}/conejos/)
- [Productos para peces](${SITE.url}/peces/)
- [Cómo comprar y pagar con Deuna](${SITE.url}/como-comprar/)
- [Envíos](${SITE.url}/envios/)
- [Preguntas frecuentes](${SITE.url}/preguntas-frecuentes/)
- [Consejos de Caramelo (blog)](${SITE.url}/consejos-de-caramelo/)
- [Seguros para mascotas en Ecuador: tipos y opciones](${SITE.url}/seguros-para-mascotas/) (guía informativa; Chip Chop no vende seguros)
- [Quiénes somos](${SITE.url}/nosotros/)

## Productos
${products}

## Preguntas frecuentes
${FAQ_GENERAL.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

Actualizado: ${SITE.lastUpdated}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
