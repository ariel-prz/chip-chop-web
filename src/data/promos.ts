// Promociones visibles en todo el sitio (franja sobre el pie de página).
// Regla: solo descuentos confirmados por Ariel. Si `items` está vacío, la franja anuncia
// la fecha y lleva a WhatsApp, sin porcentajes.

export type PromoItem = { label: string; detail: string; href?: string };

export const BLACK_FRIDAY = {
  active: true,
  title: "Black Friday en Chip Chop",
  // Viernes 27 de noviembre de 2026, hora de Quito
  startsAt: "2026-11-27T00:00:00-05:00",
  dateLabel: "Viernes 27 de noviembre de 2026",
  intro: "Confirmado por la tienda: descuento en todo el alimento seco, para perros y gatos.",
  items: [
    {
      label: "10 % de descuento",
      detail: "en todo el alimento seco: NutraPro, Cat Chow y más, para perros y gatos",
      href: "/productos/#cat-alimento-seco",
    },
  ] as PromoItem[],
};
