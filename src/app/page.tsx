import Link from "next/link";
import { Clock, MapPin, QrCode, Truck } from "lucide-react";
import { BuySteps, FaqList } from "@/components/Blocks";
import { BlackFridayBand, CategoryRail, ProductCarousel } from "@/components/HomeBlocks";
import { BackToTop } from "@/components/Engage";
import { SPECIES_ICON } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { FAQ_GENERAL } from "@/data/faq";
import { PRODUCTS, productsBySpecies, SPECIES_LABEL, thumbOf, type Species } from "@/data/products";
import { pageMeta } from "@/lib/meta";
import { faqSchema } from "@/lib/schema";
import { SITE, fullAddress, mapsLink, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Chip Chop Pet Shop | Tienda de mascotas en Quito con envío",
  description:
    "Alimento, snacks y accesorios para perros y gatos en Quito. Compra en línea, paga con Deuna y retira en tienda o recibe en Norte, Centro, Sur y Valles.",
  path: "/",
});

const HOME_FAQ = FAQ_GENERAL.slice(0, 6);

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const shelf = featured.slice(0, 4);
  const dry = PRODUCTS.filter((p) => p.category === "alimento-seco");
  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQ)} />

      <section className="hero2">
        <div className="wrap hero2-grid">
          <div className="hero2-copy">
            <h1>Tienda de mascotas en Quito: Chip Chop Pet Shop</h1>
            <p className="lead">
              Chip Chop Pet Shop es una tienda de mascotas en Quito, en {SITE.address.street}, abierta todos los
              días de 8:00 a 22:00. Vendemos alimento, snacks y accesorios para perros, gatos, conejos y peces.
              Compras en línea, pagas con Deuna y retiras en el local o lo recibes en tu casa.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary btn-lg" href="/productos/">
                Ver productos y precios
              </Link>
              <a className="btn btn-secondary btn-lg" href={waLink("Hola Chip Chop, quiero hacer un pedido")} target="_blank" rel="noopener">
                Pedir por WhatsApp
              </a>
            </div>
            <ul className="hero-facts">
              <li>
                <Clock aria-hidden="true" /> Abierto todos los días, 8:00 a 22:00
              </li>
              <li>
                <QrCode aria-hidden="true" /> Pago con Deuna, validado en minutos
              </li>
              <li>
                <Truck aria-hidden="true" /> Envíos a Norte, Centro, Sur y Valles
              </li>
            </ul>
          </div>

          <div className="vitrina">
            <img
              className="vitrina-caramelo"
              src="/img/logo-320.webp"
              srcSet="/img/logo-320.webp 320w, /img/logo-480.webp 480w"
              sizes="(max-width: 860px) 170px, 300px"
              width="300"
              height="300"
              alt="Logo de Chip Chop Pet Shop: Caramelo, nuestro perro, recibiendo un abrazo"
              fetchPriority="high"
            />
            <ul className="vitrina-shelf" aria-label="Algunos productos de la tienda">
              {shelf.map((p) => (
                <li key={p.sku}>
                  <Link href={`/productos/${p.slug}/`} prefetch={false}>
                    <img
                      src={p.image!.replace(/\.webp$/, "-160.webp")}
                      srcSet={`${p.image!.replace(/\.webp$/, "-160.webp")} 160w, ${thumbOf(p.image!)} 400w`}
                      sizes="(max-width: 860px) 80px, 130px"
                      alt={p.name}
                      width="160"
                      height="160"
                    />
                    <span>${p.price.toFixed(2)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <BlackFridayBand />

      <div className="wrap">
        <section className="section" aria-labelledby="h-cats">
          <h2 id="h-cats">¿Qué buscas para tu mascota?</h2>
          <p>Tenemos {PRODUCTS.length} productos con foto y precio, desde $1.00. Toca una categoría para verlos.</p>
          <CategoryRail />
          <ul className="species-row">
            {(Object.keys(SPECIES_LABEL) as Species[]).map((s) => {
              const Icon = SPECIES_ICON[s];
              const n = productsBySpecies(s).length;
              return (
                <li key={s}>
                  {n > 0 ? (
                    <Link href={`/${SPECIES_LABEL[s].slug}/`}>
                      <Icon aria-hidden="true" strokeWidth={1.75} />
                      <span>
                        Productos para {SPECIES_LABEL[s].plural}
                        <small>{n} en línea</small>
                      </span>
                    </Link>
                  ) : (
                    <a href={waLink(`Hola Chip Chop, ¿qué tienen para ${SPECIES_LABEL[s].plural}?`)} target="_blank" rel="noopener">
                      <Icon aria-hidden="true" strokeWidth={1.75} />
                      <span>
                        Productos para {SPECIES_LABEL[s].plural}
                        <small>consulta por WhatsApp</small>
                      </span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="section" aria-labelledby="h-destacados">
          <h2 id="h-destacados">Productos destacados</h2>
          <ProductCarousel id="car-destacados" products={featured} />
        </section>

        <section className="section" aria-labelledby="h-seco">
          <h2 id="h-seco">¿Qué alimento seco tienen para perros y gatos?</h2>
          <p>
            Fundas de 2 kg de NutraPro para cachorros, adultos y gatos, además de Cat Chow. Black Friday ya empezó:
            10 % de descuento en todo el alimento seco hasta el viernes 27 de noviembre.
          </p>
          <ProductCarousel id="car-seco" products={dry} />
        </section>

        <section className="section" aria-labelledby="h-tips">
          <h2 id="h-tips">¿Qué consejos te da Caramelo?</h2>
          <Link className="tips-cta" href="/consejos-de-caramelo/">
            <img src="/img/caramelo-144.webp" alt="" width="72" height="72" loading="lazy" />
            <span>
              <strong>Consejos de Caramelo</strong>
              Guías sobre cómo cambiar su alimento, el agua que necesita y los antiparasitarios.
            </span>
            <span className="tips-cta-go">Leer el blog</span>
          </Link>
        </section>

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
          <div className="visit">
            <a className="visit-card" href={mapsLink} target="_blank" rel="noopener">
              <MapPin aria-hidden="true" />
              <span>
                <strong>Cómo llegar</strong>
                {fullAddress}
              </span>
            </a>
            <div className="visit-card">
              <Clock aria-hidden="true" />
              <span>
                <strong>Horario</strong>
                {SITE.hours.label}, incluidos fines de semana
              </span>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="h-nosotros">
          <h2 id="h-nosotros">¿Quién está detrás de Chip Chop?</h2>
          <p>
            Chip Chop es un negocio familiar de Quito. Nos atiende la misma familia que te recibe en el local, y{" "}
            {SITE.mascot}, el perro que recibe el abrazo en nuestro logo, es la mascota de la tienda.
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
      <BackToTop />
    </>
  );
}
