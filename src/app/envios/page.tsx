import { Breadcrumbs, FaqList } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import type { Faq } from "@/data/faq";
import { pageMeta } from "@/lib/meta";
import { faqSchema } from "@/lib/schema";
import { SITE, ZONES, fullAddress, mapsLink, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Envíos para mascotas en Quito y los Valles | Chip Chop",
  description:
    "Enviamos a Quito Norte, Centro, Sur y a los Valles con InDrive o Uber. El costo depende de tu sector y lo confirmas por WhatsApp. Retiro en tienda sin costo.",
  path: "/envios/",
});

const FAQ_ENVIOS: Faq[] = [
  {
    q: "¿Quién lleva mi pedido?",
    a: "Un conductor de InDrive o Uber que contratamos nosotros cuando tu pago está confirmado. Te enviamos los datos del viaje por WhatsApp.",
  },
  {
    q: "¿Cómo pago el envío?",
    a: "El envío se cobra aparte de los productos. Te enviamos el valor por WhatsApp antes de despachar y lo apruebas antes de que salga el pedido.",
  },
  {
    q: "¿Puedo retirar el pedido en la tienda?",
    a: `Sí, sin costo, en ${SITE.address.street}, ${SITE.hours.label.toLowerCase()}. Te avisamos por WhatsApp cuando esté listo.`,
  },
];

export default function Envios() {
  return (
    <div className="wrap">
      <JsonLd data={faqSchema(FAQ_ENVIOS)} />
      <Breadcrumbs items={[{ name: "Envíos", path: "/envios/" }]} />
      <h1>Envíos en Quito y los Valles</h1>
      <p>
        Entregamos en Quito Norte, Centro, Sur y en los Valles con un conductor de InDrive o Uber. El costo del
        envío se calcula según la distancia entre la tienda y tu sector, y te lo confirmamos por WhatsApp antes
        de despachar. Retirar en el local no tiene costo.
      </p>

      <h2>¿A qué sectores envían?</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Zona</th>
            <th scope="col">Costo del envío</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Retiro en tienda</td>
            <td>Sin costo</td>
          </tr>
          {ZONES.map((z) => (
            <tr key={z.id}>
              <td>{z.name}</td>
              <td>Según la tarifa de InDrive o Uber a tu dirección, confirmada por WhatsApp</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>¿Cómo funciona el envío paso a paso?</h2>
      <ol className="steps">
        <li>Haces tu pedido, eliges «Envío» y escribes tu dirección y sector.</li>
        <li>Pagas tus productos con Deuna y el pago se valida.</li>
        <li>Cotizamos el viaje y te enviamos el valor del envío por WhatsApp.</li>
        <li>Lo apruebas y despachamos tu pedido con el conductor.</li>
      </ol>

      <h2>Preguntas sobre envíos</h2>
      <FaqList items={FAQ_ENVIOS} />

      <h2>¿Desde dónde sale mi pedido?</h2>
      <p>
        Desde nuestra tienda en{" "}
        <a href={mapsLink} target="_blank" rel="noopener">
          {fullAddress}
        </a>
        .{" "}
        <a href={waLink("Hola Chip Chop, quiero saber cuánto cuesta el envío a mi sector")} target="_blank" rel="noopener">
          Pregunta por WhatsApp cuánto cuesta el envío a tu sector
        </a>
        .
      </p>
      <p className="updated">Actualizado el 15 de noviembre de 2026.</p>
    </div>
  );
}
