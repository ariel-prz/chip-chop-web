import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ProductGrid } from "@/components/Blocks";
import { AddToCart } from "@/components/Cart";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_LABEL, formatUSD, PRODUCTS, SPECIES_LABEL } from "@/data/products";
import { pageMeta } from "@/lib/meta";
import { productSchema } from "@/lib/schema";
import { SITE, waLink } from "@/lib/site";

export const dynamicParams = false;

// La exportación estática exige al menos una ruta: si el catálogo está vacío,
// se genera una página "proximamente" que no se indexa.
const PLACEHOLDER = "proximamente";

export function generateStaticParams() {
  return PRODUCTS.length ? PRODUCTS.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return { title: "Catálogo en preparación | Chip Chop Pet Shop", robots: { index: false } };
  const species = p.species.map((s) => SPECIES_LABEL[s].plural).join(" y ");
  const desc = `${p.name}${p.size ? ` (${p.size})` : ""} a ${formatUSD(p.price)} en Quito. ${p.description}`;
  return pageMeta({
    title: `${p.name} | ${CATEGORY_LABEL[p.category]} para ${species} en Quito`,
    description: desc.length > 160 ? `${desc.slice(0, 157).trimEnd()}...` : desc,
    path: `/productos/${p.slug}/`,
    image: p.image,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) {
    if (slug === PLACEHOLDER) {
      return (
        <div className="wrap">
          <h1>Catálogo en preparación</h1>
          <p>
            Estamos fotografiando nuestros productos. <Link href="/productos/">Vuelve al catálogo</Link>.
          </p>
        </div>
      );
    }
    notFound();
  }
  const related = PRODUCTS.filter((x) => x.sku !== p.sku && x.species.some((s) => p.species.includes(s))).slice(0, 4);
  const first = SPECIES_LABEL[p.species[0]];
  return (
    <div className="wrap">
      <JsonLd data={productSchema(p)} />
      <Breadcrumbs
        items={[
          { name: "Productos", path: "/productos/" },
          { name: `Para ${first.plural}`, path: `/${first.slug}/` },
          { name: p.name, path: `/productos/${p.slug}/` },
        ]}
      />
      <div className="two-col">
        <div className="card">
          <div className="thumb">
            <img
              src={p.image ?? "/img/logo-480.webp"}
              alt={p.image ? `${p.name}${p.size ? `, presentación ${p.size}` : ""}` : ""}
              width="600"
              height="600"
              fetchPriority="high"
            />
          </div>
        </div>
        <div>
          <h1>{p.name}</h1>
          <p className="price amount">{formatUSD(p.price)}</p>
          <p>{p.description}</p>
          <table>
            <tbody>
              {p.brand && (
                <tr>
                  <th scope="row">Marca</th>
                  <td>{p.brand}</td>
                </tr>
              )}
              {p.size && (
                <tr>
                  <th scope="row">Presentación</th>
                  <td>{p.size}</td>
                </tr>
              )}
              <tr>
                <th scope="row">Para</th>
                <td>{p.species.map((s) => SPECIES_LABEL[s].plural).join(", ")}</td>
              </tr>
              <tr>
                <th scope="row">Entrega</th>
                <td>Retiro en tienda sin costo, o envío en Quito y Valles con costo según sector</td>
              </tr>
              <tr>
                <th scope="row">Pago</th>
                <td>Deuna, validado en minutos</td>
              </tr>
            </tbody>
          </table>
          <div className="btn-row">
            <AddToCart sku={p.sku} name={p.name} />
            <a className="btn btn-secondary" href={waLink(`Hola Chip Chop, me interesa: ${p.name}`)} target="_blank" rel="noopener">
              Preguntar por WhatsApp
            </a>
          </div>
          <p className="hint">
            Precio en dólares con IVA incluido. Atendemos {SITE.hours.label.toLowerCase()}.
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="h-rel">
          <h2 id="h-rel">Otros productos para {first.plural}</h2>
          <ProductGrid products={related} />
        </section>
      )}
      <p>
        <Link href="/como-comprar/">Cómo comprar y pagar con Deuna</Link>
      </p>
    </div>
  );
}
