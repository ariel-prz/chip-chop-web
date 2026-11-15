import Link from "next/link";
import { BuySteps, FaqList, ProductGrid } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { FAQ_GENERAL } from "@/data/faq";
import { PRODUCTS, SPECIES_LABEL, type Species } from "@/data/products";
import { pageMeta } from "@/lib/meta";
import { faqSchema } from "@/lib/schema";
import { SITE, fullAddress, mapsLink, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Chip Chop Pet Shop | Tienda de mascotas en Quito con envío",
  description:
    "Alimento, snacks y accesorios para perros, gatos, conejos y peces en Quito. Compra en línea, paga con Deuna y retira en tienda o recibe en Norte, Sur y Valles.",
  path: "/",
});

const SPECIES_INTRO: Record<Species, string> = {
  perro: "Alimento seco y húmedo, snacks, masticables, antiparasitarios, correas y productos de higiene.",
  gato: "Alimento seco y húmedo, snacks, juguetes, collar antipulgas y productos de higiene.",
  conejo: "Pregúntanos por WhatsApp qué tenemos hoy para tu conejo.",
  pez: "Pregúntanos por WhatsApp qué tenemos hoy para tus peces.",
};

const HOME_FAQ = FAQ_GENERAL.slice(0, 6);

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const shown = featured.length ? featured : PRODUCTS.slice(0, 8);
  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQ)} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Tienda de mascotas en Quito: Chip Chop Pet Shop</h1>
            <p className="lead">
              Chip Chop Pet Shop es una tienda de mascotas en Quito, en {SITE.address.street}, abierta todos los
              días de 8:00 a 22:00. Vendemos alimento, snacks y accesorios para perros, gatos, conejos y peces.
              Compras en línea, pagas con Deuna y retiras en el local o lo recibes en tu casa.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/productos/">
                Ver productos y precios
              </Link>
              <a className="btn btn-secondary" href={waLink("Hola Chip Chop, quiero hacer un pedido")} target="_blank" rel="noopener">
                Pedir por WhatsApp
              </a>
            </div>
            <ul className="facts">
              <li>Pago con Deuna validado en minutos</li>
              <li>Retiro en tienda sin costo</li>
              <li>Envíos a Norte, Centro, Sur y Valles</li>
            </ul>
          </div>
          <img
            src="/img/logo-480.webp"
            width="380"
            height="380"
            alt="Logo de Chip Chop Pet Shop: Caramelo, nuestro perro, recibiendo un abrazo"
            fetchPriority="high"
          />
        </div>
      </section>

      <div className="wrap">
        <section className="section" aria-labelledby="h-especies">
          <h2 id="h-especies">¿Qué productos venden para cada mascota?</h2>
          <p>
            En la tienda en línea tenemos {PRODUCTS.length} productos con foto y precio, desde $1.00. Elige tu
            mascota:
          </p>
          <ul className="cards">
            {(Object.keys(SPECIES_LABEL) as Species[]).map((s) => (
              <li className="card" key={s}>
                <h3>
                  <Link href={`/${SPECIES_LABEL[s].slug}/`}>Productos para {SPECIES_LABEL[s].plural}</Link>
                </h3>
                <p>{SPECIES_INTRO[s]}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" aria-labelledby="h-destacados">
          <h2 id="h-destacados">Productos destacados</h2>
          <ProductGrid products={shown} />
          {PRODUCTS.length > 0 && (
            <p>
              <Link href="/productos/">Ver el catálogo completo con precios</Link>
            </p>
          )}
        </section>

        <aside className="caramelo" aria-label="Consejo de Caramelo">
          <img src="/img/caramelo-144.webp" alt="Caramelo, el perro mascota de Chip Chop" width="72" height="72" loading="lazy" />
          <p>
            <strong>Caramelo te cuenta:</strong> si cambias el alimento de tu mascota, hazlo poco a poco, mezclándolo
            con el anterior durante varios días. Y si deja de comer más de un día, llévala al veterinario.
          </p>
        </aside>

        <section className="section" aria-labelledby="h-comprar">
          <h2 id="h-comprar">¿Cómo compro en línea y pago con Deuna?</h2>
          <BuySteps />
          <p>
            <Link href="/como-comprar/">Lee la guía completa para comprar y pagar con Deuna</Link>
          </p>
        </section>

        <section className="section" aria-labelledby="h-envios">
          <h2 id="h-envios">¿Hacen envíos a domicilio en Quito?</h2>
          <p>
            Sí. Enviamos a Quito Norte, Centro, Sur y a los Valles con un conductor de InDrive o Uber. El costo
            depende de la distancia a tu sector y te lo confirmamos por WhatsApp antes de despachar. Si prefieres,
            retiras en el local sin costo.
          </p>
          <p>
            <Link href="/envios/">Ver zonas y condiciones de envío</Link>
          </p>
        </section>

        <section className="section" aria-labelledby="h-ubicacion">
          <h2 id="h-ubicacion">¿Dónde está la tienda y a qué hora abre?</h2>
          <table>
            <tbody>
              <tr>
                <th scope="row">Dirección</th>
                <td>
                  <a href={mapsLink} target="_blank" rel="noopener">
                    {fullAddress}
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Horario</th>
                <td>{SITE.hours.label}, incluidos fines de semana</td>
              </tr>
              <tr>
                <th scope="row">WhatsApp</th>
                <td>
                  <a href={waLink("Hola Chip Chop, tengo una consulta")} target="_blank" rel="noopener">
                    {SITE.phoneDisplay}
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Instagram</th>
                <td>
                  <a href={SITE.instagram} target="_blank" rel="noopener">
                    {SITE.instagramHandle}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="section" aria-labelledby="h-nosotros">
          <h2 id="h-nosotros">¿Quién está detrás de Chip Chop?</h2>
          <p>
            Chip Chop es un negocio familiar de Quito. Nos atiende la misma familia que te recibe en el local, y{" "}
            {SITE.mascot}, el perro que recibe el abrazo en nuestro logo, es la mascota de la tienda: ese abrazo resume
            cómo queremos tratar a cada mascota que llega a Chip Chop.
          </p>
          <p>
            <Link href="/nosotros/">Conoce la historia de Chip Chop</Link>
          </p>
        </section>

        <section className="section" aria-labelledby="h-faq">
          <h2 id="h-faq">Preguntas frecuentes</h2>
          <FaqList items={HOME_FAQ} />
          <p>
            <Link href="/preguntas-frecuentes/">Ver todas las preguntas frecuentes</Link>
          </p>
        </section>
        <p className="updated">Información actualizada el 15 de noviembre de 2026.</p>
      </div>
    </>
  );
}
