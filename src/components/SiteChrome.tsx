import Link from "next/link";
import { CartBadge } from "@/components/Cart";
import { SITE, fullAddress, mapsLink, waLink } from "@/lib/site";

const NAV = [
  { href: "/productos/", label: "Productos" },
  { href: "/como-comprar/", label: "Cómo comprar" },
  { href: "/envios/", label: "Envíos" },
  { href: "/nosotros/", label: "Nosotros" },
  { href: "/preguntas-frecuentes/", label: "Preguntas frecuentes" },
];

export function Header() {
  return (
    <header className="site-header">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="wrap header-row">
        <Link href="/" className="brand">
          <img src="/img/isotipo-120.webp" alt="" width="64" height="48" />
          <span>
            <strong>Chip Chop</strong>
            <small>Pet Shop · Quito</small>
          </span>
        </Link>
        <nav aria-label="Principal" className="nav-desktop">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Menú móvil" className="nav-mobile">
          <details className="menu">
            <summary aria-label="Abrir menú">Menú</summary>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>
        <CartBadge />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <img className="footer-logo" src="/img/logo-blanco-200.webp" alt="Chip Chop Pet Shop" width="120" height="118" loading="lazy" />
      </div>
      <div className="wrap footer-grid">
        <section aria-labelledby="f-tienda">
          <h2 id="f-tienda">{SITE.name}</h2>
          <address>
            <a href={mapsLink} rel="noopener" target="_blank">
              {fullAddress}
            </a>
            <br />
            {SITE.hours.label}
            <br />
            WhatsApp:{" "}
            <a href={waLink("Hola Chip Chop, tengo una consulta")} rel="noopener" target="_blank">
              {SITE.phoneDisplay}
            </a>
          </address>
        </section>
        <section aria-labelledby="f-links">
          <h2 id="f-links">Compra</h2>
          <ul>
            <li><Link href="/productos/">Catálogo de productos</Link></li>
            <li><Link href="/como-comprar/">Cómo comprar y pagar con Deuna</Link></li>
            <li><Link href="/envios/">Envíos en Quito y los Valles</Link></li>
            <li><Link href="/preguntas-frecuentes/">Preguntas frecuentes</Link></li>
          </ul>
        </section>
        <section aria-labelledby="f-info">
          <h2 id="f-info">La tienda</h2>
          <ul>
            <li><Link href="/nosotros/">Quiénes somos</Link></li>
            <li><Link href="/privacidad/">Política de privacidad</Link></li>
            <li>
              <a href={SITE.instagram} rel="noopener me" target="_blank">
                Instagram {SITE.instagramHandle}
              </a>
            </li>
            {SITE.googleBusiness && (
              <li>
                <a href={SITE.googleBusiness} rel="noopener me" target="_blank">
                  Perfil en Google
                </a>
              </li>
            )}
          </ul>
        </section>
      </div>
      <p className="wrap fine">
        © 2026 {SITE.name}. Página actualizada el 15 de noviembre de 2026.
      </p>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={waLink("Hola Chip Chop, quiero hacer un pedido")}
      target="_blank"
      rel="noopener"
      aria-label="Escribir a Chip Chop por WhatsApp"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" width="28" height="28" fill="currentColor">
        <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4z" />
      </svg>
    </a>
  );
}
