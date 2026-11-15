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

// Title de 30 a 60 caracteres: se elige la variante más completa que entra.
function productTitle(name: string, size?: string) {
  const options = [
    size ? `${name} ${size} | Chip Chop Pet Shop` : "",
    `${name} | Chip Chop Pet Shop Quito`,
    `${name} | Chip Chop Pet Shop`,
    `${name} | Chip Chop`,
  ].filter(Boolean);
  const fit = options.find((t) => t.length <= 60);
  if (fit) return fit.length < 30 ? `${fit} en Quito` : fit;
  return `${name.slice(0, 57).trimEnd()}...`;
}

// Meta description de 140 a 160 caracteres con precio, presentación y forma de compra.
function productDescription(name: string, size: string | undefined, price: number, cat: string, species: string) {
  const base = `${name}${size ? `, ${size.toLowerCase()}` : ""}, a ${formatUSD(price)} en Quito.`;
  const tails = [
    ` ${cat} para ${species}. Paga con Deuna y retira en Chip Chop Pet Shop o recíbelo en tu casa.`,
    ` ${cat} para ${species}. Paga con Deuna y retira en tienda o recíbelo en casa.`,
    ` Paga con Deuna y retira en tienda o recíbelo en casa.`,
    ` Paga con Deuna, retira o recibe en casa.`,
  ];
  for (const t of tails) {
    const d = base + t;
    if (d.length <= 160) return d.length >= 140 ? d : `${d} Atendemos todos los días.`.slice(0, 160);
  }
  return `${base.slice(0, 157).trimEnd()}...`;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return { title: "Catálogo en preparación | Chip Chop Pet Shop", robots: { index: false } };
  const species = p.species.map((s) => SPECIES_LABEL[s].plural).join(" y ");
  return pageMeta({
    title: productTitle(p.name, p.size),
    description: productDescription(p.name, p.size, p.price, CATEGORY_LABEL[p.category], species),
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
            <AddToCart sku={p.sku} name={p.name} price={p.price} slug={p.slug} />
            <a className="btn btn-secondary" href={waLink(`Hola Chip Chop, me interesa: ${p.name}`)} target="_blank" rel="noopener">
              Preguntar por WhatsApp
            </a>
          </div>
          <p className="hint">
            Precio en dólares. Atendemos {SITE.hours.label.toLowerCase()}.
          </p>
        </div>
      </div>
      <section aria-labelledby="h-compra">
        <h2 id="h-compra">¿Cómo compro {p.name}?</h2>
        <p>
          Agrégalo al carrito, deja tus datos y paga con Deuna el monto exacto que te muestra el sitio. Cuando el
          pago se valida te escribimos por WhatsApp: puedes retirarlo sin costo en la tienda, abierta todos los días de
          8:00 a 22:00, o recibirlo en Quito Norte, Centro, Sur o los Valles con costo de envío según tu sector.
        </p>
      </section>
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
