import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/Cart";
import { breadcrumbSchema } from "@/lib/schema";
import type { Faq } from "@/data/faq";
import { CATEGORY_LABEL, formatUSD, SPECIES_LABEL, type Product } from "@/data/products";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <nav className="crumbs" aria-label="Ruta de navegación">
      <JsonLd data={breadcrumbSchema(all)} />
      <ol>
        {all.map((it, i) => (
          <li key={it.path}>
            {i === all.length - 1 ? <span aria-current="page">{it.name}</span> : <Link href={it.path}>{it.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ items, headingLevel = 3 }: { items: Faq[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>
            <H>{f.q}</H>
          </summary>
          <p className="answer">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <li className="card">
      <Link href={`/productos/${p.slug}/`} className="stretch">
        <div className="thumb">
          {p.image ? (
            <img src={p.image} alt={`${p.name}${p.size ? `, presentación ${p.size}` : ""}`} width="400" height="400" loading="lazy" decoding="async" />
          ) : (
            <img src="/img/logo-240.webp" alt="" width="160" height="160" loading="lazy" />
          )}
        </div>
        <h3>{p.name}</h3>
      </Link>
      <p className="meta">
        {CATEGORY_LABEL[p.category]} para {p.species.map((s) => SPECIES_LABEL[s].plural).join(", ")}
        {p.size ? ` · ${p.size}` : ""}
      </p>
      <p className="price">{formatUSD(p.price)}</p>
      <AddToCart sku={p.sku} name={p.name} />
    </li>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="note">
        Estamos cargando el catálogo con fotos de nuestros productos. Mientras tanto, pregúntanos por
        WhatsApp lo que necesitas y te confirmamos precio y disponibilidad.
      </p>
    );
  }
  return (
    <ul className="cards">
      {products.map((p) => (
        <ProductCard key={p.sku} p={p} />
      ))}
    </ul>
  );
}

export function BuySteps() {
  return (
    <ol className="steps">
      <li>
        <strong>Arma tu carrito.</strong> Elige tus productos y revisa el total.
      </li>
      <li>
        <strong>Deja tus datos.</strong> Nombre, WhatsApp y si retiras en la tienda o prefieres envío.
      </li>
      <li>
        <strong>Paga con Deuna el monto exacto.</strong> Escanea nuestro QR y paga el valor que te muestra el
        sitio, con sus centavos. Ese monto identifica tu pedido.
      </li>
      <li>
        <strong>Sube la captura del pago.</strong> Queda como respaldo de tu compra.
      </li>
      <li>
        <strong>Recibe la confirmación.</strong> El pago se valida en minutos y te escribimos por WhatsApp
        para el retiro o el envío.
      </li>
    </ol>
  );
}
