import Link from "next/link";
import { Breadcrumbs, BuySteps } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import { SITE, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Cómo comprar y pagar con Deuna | Chip Chop Pet Shop Quito",
  description:
    "Guía paso a paso para comprar en Chip Chop Pet Shop: arma tu carrito, paga con Deuna el monto exacto, sube la captura y recibe la confirmación por WhatsApp.",
  path: "/como-comprar/",
});

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo comprar en Chip Chop Pet Shop y pagar con Deuna",
  totalTime: "PT5M",
  step: [
    "Agrega los productos al carrito y revisa el total.",
    "Escribe tu nombre, tu WhatsApp y elige retiro en tienda o envío.",
    "Escanea el QR de Deuna y paga el monto exacto que muestra el sitio, con sus centavos.",
    "Sube la captura del pago en la página de tu pedido.",
    "Espera la confirmación por WhatsApp para retirar o recibir tu pedido.",
  ].map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
};

export default function ComoComprar() {
  return (
    <div className="wrap">
      <JsonLd data={howTo} />
      <Breadcrumbs items={[{ name: "Cómo comprar", path: "/como-comprar/" }]} />
      <h1>Cómo comprar en Chip Chop y pagar con Deuna</h1>
      <p>
        Comprar en Chip Chop Pet Shop toma unos cinco minutos: armas tu carrito, pagas con la app Deuna el monto
        exacto que te mostramos y subes la captura del pago. El sistema reconoce tu pago por el monto y te
        confirmamos por WhatsApp.
      </p>

      <h2>¿Cuáles son los pasos para comprar?</h2>
      <BuySteps />

      <h2>¿Por qué debo pagar el monto exacto con centavos?</h2>
      <p>
        Cada pedido recibe un monto único. Por ejemplo, si tus productos suman $24.50, el sitio puede pedirte
        $24.47. Esos centavos de descuento son la forma en que identificamos tu pago sin que tengas que escribir
        códigos ni mensajes. Nunca pagas más que el total de tus productos.
      </p>
      <div className="note">
        Si pagas un valor distinto, no pasa nada grave: el pedido queda en revisión y una persona de la tienda lo
        confirma con tu captura. Solo tarda un poco más.
      </div>

      <h2>¿Qué métodos de pago aceptan?</h2>
      <ul>
        <li>
          <strong>En línea:</strong> Deuna, escaneando nuestro código QR.
        </li>
        <li>
          <strong>En el local:</strong> Deuna.
        </li>
      </ul>

      <h2>¿Cuánto tarda la confirmación?</h2>
      <p>
        Cuando el monto coincide, el pago se valida solo, normalmente en pocos minutos. La página de tu pedido se
        actualiza sola y además te escribimos por WhatsApp en horario de atención ({SITE.hours.label.toLowerCase()}).
      </p>

      <h2>¿Qué pasa si tengo un problema con el pago?</h2>
      <p>
        Escríbenos por WhatsApp con el código de tu pedido (empieza con CC-) y la captura del pago. Lo revisamos
        a mano y te respondemos.
      </p>
      <div className="btn-row">
        <Link className="btn btn-primary" href="/productos/">
          Empezar mi compra
        </Link>
        <a className="btn btn-secondary" href={waLink("Hola Chip Chop, tengo una duda sobre mi pago")} target="_blank" rel="noopener">
          Ayuda por WhatsApp
        </a>
      </div>
      <p className="updated">Actualizado el 15 de noviembre de 2026.</p>
    </div>
  );
}
