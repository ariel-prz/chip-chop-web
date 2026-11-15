import { Breadcrumbs } from "@/components/Blocks";
import { pageMeta } from "@/lib/meta";
import { SITE, fullAddress, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Política de privacidad | Chip Chop Pet Shop",
  description:
    "Qué datos personales pide Chip Chop Pet Shop al comprar en línea, para qué los usa, cuánto tiempo los guarda y cómo ejercer tus derechos según la ley de Ecuador.",
  path: "/privacidad/",
});

export default function Privacidad() {
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ name: "Privacidad", path: "/privacidad/" }]} />
      <h1>Política de privacidad</h1>
      <p>
        Esta política explica cómo {SITE.name} trata tus datos personales cuando compras en este sitio, de acuerdo
        con la Ley Orgánica de Protección de Datos Personales del Ecuador.
      </p>

      <h2>¿Quién es responsable de tus datos?</h2>
      <p>
        {SITE.name}, con local en {fullAddress}. Contacto: WhatsApp {SITE.phoneDisplay}.
      </p>

      <h2>¿Qué datos pedimos?</h2>
      <ul>
        <li>Nombre y número de WhatsApp, para confirmar y coordinar tu pedido.</li>
        <li>Dirección y sector, solo si eliges envío.</li>
        <li>Cédula o RUC, opcional, solo si necesitas factura.</li>
        <li>La captura de tu pago y los datos que muestra la notificación de Deuna, para validar el pago.</li>
      </ul>

      <h2>¿Para qué los usamos?</h2>
      <p>
        Únicamente para procesar tu compra: validar el pago, preparar el pedido, coordinar el retiro o el envío y
        emitir la factura si la pides. No vendemos ni compartimos tus datos con terceros con fines comerciales. Si
        eliges envío, compartimos tu dirección y teléfono con el conductor que lleva el pedido.
      </p>

      <h2>¿Dónde y cuánto tiempo se guardan?</h2>
      <p>
        Se guardan en una base de datos con acceso restringido al personal de la tienda. Los conservamos mientras
        sean necesarios para tu pedido y para cumplir obligaciones tributarias.
      </p>

      <h2>¿Cuáles son tus derechos?</h2>
      <p>
        Puedes pedir acceso, corrección o eliminación de tus datos, u oponerte a su uso, escribiéndonos por{" "}
        <a href={waLink("Hola Chip Chop, quiero ejercer mis derechos sobre mis datos personales")} target="_blank" rel="noopener">
          WhatsApp
        </a>
        . Respondemos en un plazo razonable.
      </p>
      <p className="updated">Vigente desde el 15 de noviembre de 2026.</p>
    </div>
  );
}
