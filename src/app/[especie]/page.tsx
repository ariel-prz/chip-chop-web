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
      "Alimento, premios, correas, juguetes e higiene para perros en Quito, con precios en línea. Paga con Deuna y retira en tienda o recibe en tu sector de Quito.",
    intro:
      "Todo lo que vendemos para perros, con precio final. Si no sabes qué alimento elegir para la edad o el tamaño de tu perro, escríbenos por WhatsApp y te ayudamos a escoger.",
  },
  gato: {
    title: "Productos para gatos en Quito | Chip Chop Pet Shop",
    description:
      "Alimento, snacks, arena y accesorios para gatos en Quito con precios en línea. Compra desde el celular, paga con Deuna y retira en tienda o recibe en casa.",
    intro:
      "Todo lo que vendemos para gatos, con precio final. Si tienes dudas sobre qué producto le conviene a tu gato, escríbenos por WhatsApp antes de comprar.",
  },
  conejo: {
    title: "Productos para conejos en Quito | Chip Chop Pet Shop",
    description:
      "Alimento y accesorios para conejos en Quito con precios en línea. Compra en Chip Chop Pet Shop, paga con Deuna y retira en tienda o recibe en tu sector.",
    intro:
      "Productos para conejos con precio final. Si buscas algo específico para tu conejo que no ves aquí, pregúntanos por WhatsApp.",
  },
  pez: {
    title: "Productos para peces y acuarios en Quito | Chip Chop",
    description:
      "Alimento para peces y artículos de acuario en Quito con precios en línea. Compra en Chip Chop Pet Shop, paga con Deuna y retira en el local o recibe en casa.",
    intro:
      "Alimento y artículos para el acuario con precio final. Si estás armando tu primer acuario, escríbenos y te decimos qué necesitas.",
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
  return pageMeta({ title: COPY[s].title, description: COPY[s].description, path: `/${especie}/` });
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
      <ProductGrid products={list} />
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
