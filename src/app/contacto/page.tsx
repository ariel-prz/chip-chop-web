import Link from "next/link";
import { Clock, MapPin, MessageCircle, Store } from "lucide-react";
import { Breadcrumbs } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import { SHIPPING_SUMMARY, SITE, fullAddress, mapsLink, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contacto, horario y ubicación | Chip Chop Pet Shop",
  description:
    "Cómo contactar a Chip Chop Pet Shop en Quito: dirección del local, horario de 8:00 a 22:00, WhatsApp, Instagram y mapa. Te respondemos el mismo día.",
  path: "/contacto/",
});

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto de Chip Chop Pet Shop",
  url: `${SITE.url}/contacto/`,
  about: { "@id": `${SITE.url}/#tienda` },
  mainEntity: { "@id": `${SITE.url}/#tienda` },
  dateModified: SITE.lastUpdated,
};

export default function Contacto() {
  return (
    <div className="wrap">
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ name: "Contacto", path: "/contacto/" }]} />
      <h1>Contacto de Chip Chop Pet Shop</h1>
      <p className="lead">
        Atendemos en nuestro local de {SITE.address.street}, en Quito, todos los días de 8:00 a 22:00, y por WhatsApp
        al {SITE.phoneDisplay}. Escríbenos para consultar precios, disponibilidad o el costo de un envío a tu sector.
      </p>

      <h2>¿Cuál es la forma más rápida de contactarnos?</h2>
      <p>
        WhatsApp. Te respondemos en horario de atención, el mismo día. Si ya hiciste un pedido, escríbenos con el
        código que empieza con CC-.
      </p>
      <p>
        <a className="btn btn-primary btn-lg" href={waLink("Hola Chip Chop, quiero hacer una consulta")} target="_blank" rel="noopener">
          <MessageCircle aria-hidden="true" size={20} /> Escribir por WhatsApp
        </a>
      </p>

      <h2>¿Dónde queda la tienda?</h2>
      <div className="visit">
        <a className="visit-card" href={mapsLink} target="_blank" rel="noopener">
          <MapPin aria-hidden="true" />
          <span>
            <strong>Dirección</strong>
            {fullAddress}
          </span>
        </a>
        <div className="visit-card">
          <Clock aria-hidden="true" />
          <span>
            <strong>Horario</strong>
            {SITE.hours.label}, incluidos feriados
          </span>
        </div>
      </div>

      <h2>¿Por qué otros canales podemos hablar?</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">WhatsApp</th>
            <td>
              <a href={waLink("Hola Chip Chop")} target="_blank" rel="noopener">
                {SITE.phoneDisplay}
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">Instagram</th>
            <td>
              <a href={SITE.instagram} target="_blank" rel="noopener me">
                {SITE.instagramHandle}
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">Perfil en Google</th>
            <td>
              <a href={SITE.googleBusiness} target="_blank" rel="noopener me">
                Chip Chop Pet Shop en Google Maps
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">En el local</th>
            <td>Te atendemos en persona, {SITE.hours.label.toLowerCase()}</td>
          </tr>
        </tbody>
      </table>

      <h2>¿Para qué puedes escribirnos?</h2>
      <ul>
        <li>Consultar si tenemos un producto o una marca que no ves en el catálogo.</li>
        <li>Saber el costo exacto de tu envío: {SHIPPING_SUMMARY}, según tu dirección.</li>
        <li>Coordinar el retiro de un pedido ya pagado.</li>
        <li>Resolver un problema con un pago de Deuna.</li>
      </ul>

      <p>
        <Store aria-hidden="true" size={18} /> ¿Prefieres comprar primero?{" "}
        <Link href="/productos/">Mira el catálogo con precios</Link> o lee{" "}
        <Link href="/como-comprar/">cómo comprar y pagar con Deuna</Link>.
      </p>
      <p className="updated">Actualizado el 15 de noviembre de 2026.</p>
    </div>
  );
}
