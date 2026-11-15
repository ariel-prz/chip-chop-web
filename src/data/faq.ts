import { SHIPPING_SUMMARY, SITE } from "@/lib/site";

// Preguntas reales de clientes. Cada respuesta: corta, completa y sin relleno.
// Solo hechos confirmados por el dueño. Si algo cambia, se cambia aquí y se
// actualiza en todo el sitio y en el schema FAQPage.

export type Faq = { q: string; a: string };

export const FAQ_GENERAL: Faq[] = [
  {
    q: "¿Dónde queda Chip Chop Pet Shop?",
    a: `Estamos en ${SITE.address.street}, Quito (código postal ${SITE.address.postalCode}). Puedes retirar tu pedido en el local sin costo de envío.`,
  },
  {
    q: "¿Cuál es el horario de atención?",
    a: "Atendemos todos los días, de lunes a domingo, de 8:00 a 22:00, en el local y por WhatsApp.",
  },
  {
    q: "¿Para qué mascotas tienen productos?",
    a: "Tenemos alimento, snacks, accesorios y productos de cuidado para perros, gatos, conejos y peces.",
  },
  {
    q: "¿Cómo pago mi pedido en línea?",
    a: "Pagas con la app Deuna escaneando nuestro código QR por el monto exacto que te muestra el sitio. Ese monto identifica tu pedido, así que el pago se valida automáticamente en pocos minutos.",
  },
  {
    q: "¿Por qué el monto a pagar tiene unos centavos menos que el total?",
    a: "Cada pedido recibe un monto único con unos centavos de descuento. Así reconocemos tu pago al instante sin que tengas que escribir ningún código. Nunca pagas más que el total de tus productos.",
  },
  {
    q: "¿Hacen envíos a domicilio en Quito?",
    a: `Sí. Enviamos a Quito Norte, Centro, Sur y a los Valles con un conductor de InDrive o Uber, ${SHIPPING_SUMMARY}. El valor exacto lo confirmamos por WhatsApp antes de despachar.`,
  },
  {
    q: "¿Cuánto cuesta el envío?",
    a: `El envío cuesta ${SHIPPING_SUMMARY}. El valor exacto depende de tu dirección y de la tarifa del conductor de InDrive o Uber; te lo enviamos por WhatsApp para que lo apruebes antes de despachar. Retirar en el local no tiene costo.`,
  },
  {
    q: "¿Aceptan cambios o devoluciones?",
    a: "Sí, en la comida que vendemos por libras: puedes cambiarla o te devolvemos el dinero. Para los demás productos todavía no tenemos una política de cambios; si tienes un problema con tu compra, escríbenos por WhatsApp.",
  },
  {
    q: "¿Qué hago después de pagar?",
    a: "Sube la captura de tu pago en la página de tu pedido. Cuando el pago se valida, te escribimos por WhatsApp para coordinar el retiro o el envío.",
  },
];
