import Link from "next/link";
import { Breadcrumbs } from "@/components/Blocks";
import { pageMeta } from "@/lib/meta";
import { SHIPPING_SUMMARY, SITE, fullAddress, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Términos y condiciones de compra | Chip Chop Pet Shop",
  description:
    "Condiciones de compra en Chip Chop Pet Shop: precios en dólares, pago con Deuna, validación del pedido, envíos en Quito, cambios y devoluciones, y facturación.",
  path: "/terminos/",
});

export default function Terminos() {
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ name: "Términos y condiciones", path: "/terminos/" }]} />
      <h1>Términos y condiciones de compra</h1>
      <p className="lead">
        Estas condiciones aplican a las compras hechas en chipchoppetshop.com. La tienda es {SITE.name}, con local en{" "}
        {fullAddress}. Al generar un pedido aceptas lo que se explica aquí.
      </p>

      <h2>¿Qué precios aplican?</h2>
      <p>
        Todos los precios están en dólares de Estados Unidos (USD) y son los que aparecen en cada ficha de producto al
        momento de generar el pedido. Pueden cambiar sin aviso previo, pero el monto que te mostramos al crear tu
        pedido es el que se respeta para esa compra. El costo del envío se cobra aparte.
      </p>

      <h2>¿Cómo se paga y cuándo se confirma el pedido?</h2>
      <p>
        El pago en línea se hace con la aplicación Deuna, escaneando nuestro código QR por el monto exacto que te
        muestra el sitio. Ese monto es único para tu pedido e incluye unos centavos de descuento que nos permiten
        identificar tu pago: nunca pagas más que el total de tus productos. El pedido queda confirmado cuando el pago
        se valida, normalmente en pocos minutos. Si el monto no coincide, el pedido queda en revisión y lo
        confirmamos a mano con la captura que subas.
      </p>

      <h2>¿Cómo funcionan los envíos?</h2>
      <p>
        Entregamos en Quito Norte, Centro, Sur y en los Valles con un conductor de InDrive o Uber. El envío cuesta{" "}
        {SHIPPING_SUMMARY}; el valor exacto depende de tu dirección y te lo confirmamos por WhatsApp antes de
        despachar. El pedido sale una vez que apruebas ese valor. Retirar en el local no tiene costo. Los tiempos de
        entrega dependen de la disponibilidad de conductores y no podemos garantizar una hora exacta.{" "}
        <Link href="/envios/">Ver condiciones de envío</Link>.
      </p>

      <h2>¿Aceptan cambios o devoluciones?</h2>
      <p>
        Sí, en el alimento que vendemos por libras: puedes cambiarlo o te devolvemos el dinero. Para los demás
        productos todavía no tenemos una política de cambios definida; si tienes un problema con tu compra,
        escríbenos por WhatsApp y lo revisamos caso por caso. Los productos deben estar sin abrir y conservar su
        empaque original.
      </p>

      <h2>¿Emiten factura?</h2>
      <p>
        Sí. Si necesitas factura, escribe tu cédula o RUC en el formulario del pedido. La emitimos manualmente después
        de confirmar el pago.
      </p>

      <h2>¿Qué pasa si un producto no está disponible?</h2>
      <p>
        El catálogo en línea refleja lo que solemos tener en el local, pero el inventario cambia a diario. Si un
        producto de tu pedido se agotó, te escribimos por WhatsApp para cambiarlo por otro o devolverte ese valor.
      </p>

      <h2>¿Qué información sobre salud animal publicamos?</h2>
      <p>
        Las guías de <Link href="/consejos-de-caramelo/">Consejos de Caramelo</Link> y las descripciones de los
        productos son información general y no reemplazan la consulta veterinaria. La dosis de antiparasitarios y
        suplementos depende del peso y la especie de cada mascota: consúltala con tu veterinario.
      </p>

      <h2>¿Qué pasa con mis datos personales?</h2>
      <p>
        Usamos tu nombre, teléfono y dirección solo para procesar tu pedido, según la{" "}
        <Link href="/privacidad/">política de privacidad</Link>, en cumplimiento de la Ley Orgánica de Protección de
        Datos Personales del Ecuador.
      </p>

      <h2>¿Y la página de seguros para mascotas?</h2>
      <p>
        La página de <Link href="/seguros-para-mascotas/">seguros para mascotas</Link> es solo informativa. Chip Chop
        no vende seguros ni tiene convenio con ninguna aseguradora, y no participa en la relación entre tú y la
        empresa que contrates.
      </p>

      <h2>¿Cómo reclamo o pregunto por estas condiciones?</h2>
      <p>
        Escríbenos por{" "}
        <a href={waLink("Hola Chip Chop, tengo una consulta sobre los términos y condiciones")} target="_blank" rel="noopener">
          WhatsApp al {SITE.phoneDisplay}
        </a>{" "}
        o acércate al local. Estas condiciones se rigen por la legislación ecuatoriana.
      </p>
      <p className="updated">Vigente desde el 17 de noviembre de 2026.</p>
    </div>
  );
}
