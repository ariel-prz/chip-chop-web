import Link from "next/link";
import { Breadcrumbs, ProductGrid } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_LABEL, PRODUCTS, SPECIES_LABEL, type Category, type Species } from "@/data/products";
import { pageMeta } from "@/lib/meta";
import { itemListSchema } from "@/lib/schema";

export const metadata = pageMeta({
  title: "Productos para mascotas con precios | Chip Chop Pet Shop Quito",
  description:
    "Catálogo con precios de alimento, snacks, accesorios e higiene para perros, gatos, conejos y peces. Compra en línea en Quito y paga con Deuna en minutos.",
  path: "/productos/",
});

export default function Catalogo() {
  const categories = (Object.keys(CATEGORY_LABEL) as Category[]).filter((c) =>
    PRODUCTS.some((p) => p.category === c),
  );
  return (
    <div className="wrap">
      <JsonLd data={itemListSchema(PRODUCTS, "Catálogo de Chip Chop Pet Shop")} />
      <Breadcrumbs items={[{ name: "Productos", path: "/productos/" }]} />
      <h1>Productos para mascotas con precios en Quito</h1>
      <p>
        Aquí están los productos que vendemos en Chip Chop Pet Shop con su precio en dólares.
        Puedes comprarlos en línea y pagar con Deuna, o pedirlos por WhatsApp. Si buscas algo que no ves en la
        lista, escríbenos: es posible que lo tengamos en el local.
      </p>
      <p>
        Filtra por mascota:{" "}
        {(Object.keys(SPECIES_LABEL) as Species[]).map((s, i) => (
          <span key={s}>
            {i > 0 && " · "}
            <Link href={`/${SPECIES_LABEL[s].slug}/`}>{SPECIES_LABEL[s].plural}</Link>
          </span>
        ))}
      </p>
      {categories.length === 0 ? (
        <ProductGrid products={[]} />
      ) : (
        categories.map((c, i) => (
          <section key={c} aria-labelledby={`cat-${c}`}>
            <h2 id={`cat-${c}`}>{CATEGORY_LABEL[c]}</h2>
            <ProductGrid products={PRODUCTS.filter((p) => p.category === c)} priority={i === 0} />
          </section>
        ))
      )}
    </div>
  );
}
