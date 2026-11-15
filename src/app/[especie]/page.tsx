import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ProductGrid } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { productsBySpecies, SPECIES_LABEL, type Species } from "@/data/products";
import { pageMeta } from "@/lib/meta";
import { itemListSchema } from "@/lib/schema";
import { waLink } from "@/lib/site";

export const dynamicParams = false;

const BY_SLUG = Object.fromEntries(
  (Object.keys(SPECIES_LABEL) as Species[]).map((s) => [SPECIES_LABEL[s].slug, s]),
) as Record<string, Species>;

const COPY: Record<Species, { title: string; description: string; intro: string }> = {
  perro: {
    title: "Productos para perros en Quito | Chip Chop Pet Shop",
    description:
      "Alimento seco y húmedo, snacks, masticables, antiparasitarios y correas para perros en Quito, con precios en línea. Paga con Deuna y retira o recibe en casa.",
    intro:
      "Todo lo que vendemos para perros, con precio final. Si no sabes qué alimento elegir para la edad o el tamaño de tu perro, escríbenos por WhatsApp y te ayudamos a escoger.",
  },
  gato: {
    title: "Productos para gatos en Quito | Chip Chop Pet Shop",
    description:
      "Alimento seco y húmedo, snacks, juguetes y collar antipulgas para gatos en Quito, con precios en línea. Paga con Deuna y retira en tienda o recibe en casa.",
    intro:
      "Todo lo que vendemos para gatos, con precio final. Si tienes dudas sobre qué producto le conviene a tu gato, escríbenos por WhatsApp antes de comprar.",
  },
  conejo: {
    title: "Productos para conejos en Quito | Chip Chop Pet Shop",
    description:
      "Consulta por WhatsApp los productos para conejos de Chip Chop Pet Shop en Quito. Abrimos todos los días de 8:00 a 22:00, con retiro en tienda o envío.",
    intro:
      "Todavía no publicamos productos para conejos en la tienda en línea. Escríbenos por WhatsApp y te contamos qué tenemos hoy en el local.",
  },
  pez: {
    title: "Productos para peces y acuarios en Quito | Chip Chop",
    description:
      "Consulta por WhatsApp los productos para peces y acuarios de Chip Chop Pet Shop en Quito. Abrimos todos los días de 8:00 a 22:00, con retiro o envío.",
    intro:
      "Todavía no publicamos productos para peces en la tienda en línea. Escríbenos por WhatsApp y te contamos qué tenemos hoy en el local.",
  },
};

export function generateStaticParams() {
  return Object.keys(BY_SLUG).map((especie) => ({ especie }));
}

type Props = { params: Promise<{ especie: string }> };

export async function generateMetadata({ params }: Props) {
  const { especie } = await params;
  const s = BY_SLUG[especie];
  if (!s) return {};
  // Sin productos publicados la página es delgada: no se indexa hasta tener catálogo.
  return pageMeta({
    title: COPY[s].title,
    description: COPY[s].description,
    path: `/${especie}/`,
    noindex: productsBySpecies(s).length === 0,
  });
}

export default async function EspeciePage({ params }: Props) {
  const { especie } = await params;
  const s = BY_SLUG[especie];
  if (!s) notFound();
  const label = SPECIES_LABEL[s];
  const list = productsBySpecies(s);
  return (
    <div className="wrap">
      <JsonLd data={itemListSchema(list, `Productos para ${label.plural}`)} />
      <Breadcrumbs
        items={[
          { name: "Productos", path: "/productos/" },
          { name: `Para ${label.plural}`, path: `/${especie}/` },
        ]}
      />
      <h1>Productos para {label.plural} en Quito</h1>
      <p>{COPY[s].intro}</p>
      {list.length > 0 && (
        <section aria-labelledby="h-lista">
          <h2 id="h-lista">
            {list.length} productos para {label.plural} con precio
          </h2>
          <ProductGrid products={list} priority />
        </section>
      )}
      <h2>¿Cómo los recibo?</h2>
      <p>
        Pagas con Deuna y retiras en la tienda sin costo, o te lo enviamos a Quito Norte, Centro, Sur o los Valles
        con costo según tu sector. <Link href="/envios/">Ver condiciones de envío</Link>.
      </p>
      <p>
        <a href={waLink(`Hola Chip Chop, busco productos para mi ${label.singular}`)} target="_blank" rel="noopener">
          Consultar por WhatsApp productos para {label.plural}
        </a>
      </p>
    </div>
  );
}
