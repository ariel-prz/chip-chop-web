import Link from "next/link";
import { BadgePercent, CalendarDays, Droplets, MessageCircle, Repeat, Stethoscope } from "lucide-react";
import { AddToCart } from "@/components/Cart";
import { CarouselNav, Countdown } from "@/components/Engage";
import { CATEGORY_ICON, SPECIES_ICON } from "@/components/Icons";
import { BLACK_FRIDAY } from "@/data/promos";
import { CATEGORY_LABEL, formatUSD, PRODUCTS, SPECIES_LABEL, thumbOf, type Category, type Product } from "@/data/products";
import { waLink } from "@/lib/site";

// Fila de categorías con ícono: se recorre con el dedo en el teléfono.
export function CategoryRail() {
  const cats = (Object.keys(CATEGORY_LABEL) as Category[])
    .map((c) => ({ c, n: PRODUCTS.filter((p) => p.category === c).length }))
    .filter((x) => x.n > 0);
  return (
    <ul className="cat-rail">
      {cats.map(({ c, n }) => {
        const Icon = CATEGORY_ICON[c];
        return (
          <li key={c}>
            <Link href={`/productos/#cat-${c}`}>
              <span className="cat-icon">
                <Icon aria-hidden="true" strokeWidth={1.75} />
              </span>
              <span className="cat-name">{CATEGORY_LABEL[c]}</span>
              <span className="cat-count">{n} productos</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MiniProduct({ p }: { p: Product }) {
  return (
    <li className="mini">
      <Link href={`/productos/${p.slug}/`} className="mini-link">
        {p.image && <img src={thumbOf(p.image)} alt={`${p.name}${p.size ? `, ${p.size}` : ""}`} width="400" height="400" loading="lazy" decoding="async" />}
        <span className="mini-species" aria-label={`Para ${p.species.map((s) => SPECIES_LABEL[s].plural).join(" y ")}`}>
          {p.species.map((s) => {
            const I = SPECIES_ICON[s];
            return <I key={s} aria-hidden="true" size={16} />;
          })}
        </span>
        {BLACK_FRIDAY.active && p.category === BLACK_FRIDAY.category && (
          <span className="promo-badge">-{BLACK_FRIDAY.pct} % el 27 nov</span>
        )}
        <span className="mini-cat">{CATEGORY_LABEL[p.category]}</span>
        <span className="mini-name">{p.name}</span>
        {p.size && <span className="mini-size">{p.size}</span>}
      </Link>
      <span className="mini-price">{formatUSD(p.price)}</span>
      <AddToCart sku={p.sku} name={p.name} price={p.price} slug={p.slug} />
    </li>
  );
}

export function ProductCarousel({ id, products }: { id: string; products: Product[] }) {
  return (
    <div className="carousel">
      <CarouselNav targetId={id} />
      <ul className="carousel-track" id={id}>
        {products.map((p) => (
          <MiniProduct key={p.sku} p={p} />
        ))}
      </ul>
    </div>
  );
}

// Consejos de Caramelo: datos útiles y generales; lo de salud siempre se deriva al veterinario.
export function CarameloTips() {
  const tips = [
    {
      Icon: Repeat,
      title: "¿Cambias de alimento?",
      text: "Hazlo poco a poco: mezcla el nuevo con el anterior durante varios días para que su estómago se acostumbre.",
    },
    {
      Icon: Droplets,
      title: "Agua fresca siempre",
      text: "Deja su plato de agua limpio y lleno todo el día, sobre todo si come alimento seco.",
    },
    {
      Icon: Stethoscope,
      title: "Antiparasitarios con guía",
      text: "La dosis depende del peso de tu mascota. Pregúntale a tu veterinario cada cuánto aplicarlos.",
    },
  ];
  return (
    <div className="tips">
      <div className="tips-head">
        <img src="/img/caramelo-144.webp" alt="Caramelo, el perro mascota de Chip Chop" width="88" height="88" loading="lazy" />
        <p>
          Soy Caramelo. Esto es lo que más le preguntan a mi familia en la tienda. Si tu mascota deja de comer más de
          un día, llévala al veterinario.
        </p>
      </div>
      <ul className="tips-list">
        {tips.map(({ Icon, title, text }) => (
          <li key={title}>
            <Icon aria-hidden="true" strokeWidth={1.75} />
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Franja de Black Friday, visible en todo el sitio antes del pie de página.
export function BlackFridayBand() {
  if (!BLACK_FRIDAY.active) return null;
  const bf = BLACK_FRIDAY;
  return (
    <section className="bf" aria-labelledby="bf-title">
      <div className="wrap bf-grid">
        <div className="bf-tag" aria-hidden="true">
          <BadgePercent size={40} strokeWidth={1.75} />
        </div>
        <div>
          <h2 id="bf-title">{bf.title}</h2>
          <p className="bf-date">
            <CalendarDays aria-hidden="true" size={18} /> {bf.dateLabel}
          </p>
          <p>{bf.intro}</p>
        </div>
        <ul className="bf-offers">
          {bf.items.map((it) => (
            <li key={it.label}>
              <strong>{it.label}</strong>
              <span>{it.detail}</span>
              {it.href && (
                <Link href={it.href} className="bf-link">
                  Ver el alimento seco
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="bf-side">
          <Countdown from={bf.startsAt} to={bf.endsAt} />
          <a className="btn btn-gold" href={waLink("Hola Chip Chop, quiero apartar mi alimento para Black Friday")} target="_blank" rel="noopener">
            <MessageCircle aria-hidden="true" size={20} /> Apartar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
