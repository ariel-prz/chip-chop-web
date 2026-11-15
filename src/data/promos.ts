// Promociones visibles en todo el sitio (franja sobre el pie de página).
// Regla: solo descuentos confirmados por Ariel. Si `items` está vacío, la franja anuncia
// la fecha y lleva a WhatsApp, sin porcentajes.

// Precio con el descuento aplicado (mismo redondeo que el servidor)
export function promoPrice(price: number, pct: number) {
  return Math.round(price * (100 - pct)) / 100;
}

export type PromoItem = { label: string; detail: string; href?: string };

export const BLACK_FRIDAY = {
  active: true,
  title: "Black Friday en Chip Chop",
  // Viernes 27 de noviembre de 2026, hora de Quito. Debe coincidir con public.promotions
  // (id "black-friday-2026") en Supabase: el servidor aplica el descuento con esas fechas.
  startsAt: "2026-11-15T12:50:00-05:00",
  endsAt: "2026-11-27T23:59:59-05:00",
  category: "alimento-seco",
  pct: 10,
  dateLabel: "Ya empezó: hasta el viernes 27 de noviembre de 2026 a las 23:59",
  intro: "El descuento se resta solo al generar tu pedido en línea. También aplica en la tienda.",
  items: [
    {
      label: "10 % de descuento",
      detail: "en todo el alimento seco: NutraPro, Cat Chow y más, para perros y gatos",
      href: "/productos/#cat-alimento-seco",
    },
  ] as PromoItem[],
};
