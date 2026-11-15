// Fuente única de verdad del negocio. Todo el sitio (texto visible y schema)
// lee de aquí, para que nombre, dirección y contacto coincidan siempre (AEO #8).

export const SITE = {
  name: "Chip Chop Pet Shop",
  url: "https://chipchoppetshop.com",
  locale: "es-EC",
  description:
    "Pet shop en Quito con alimento y accesorios para perros, gatos, conejos y peces. Compra en línea, paga con Deuna y retira en tienda o recibe en tu casa.",
  phoneDisplay: "099 525 2457",
  phoneE164: "+593995252457",
  whatsapp: "593995252457",
  instagram: "https://www.instagram.com/chipchop_uio/",
  instagramHandle: "@chipchop_uio",
  // TODO: pegar el enlace público del perfil de Google Business (botón "Compartir").
  googleBusiness: "",
  address: {
    street: "Serapio Japerabi y Miguel Pontón",
    city: "Quito",
    region: "Pichincha",
    postalCode: "170504",
    country: "EC",
  },
  hours: { opens: "08:00", closes: "22:00", label: "Todos los días, de 8:00 a 22:00" },
  mascot: "Caramelo",
  species: ["perros", "gatos", "conejos", "peces"] as const,
  lastUpdated: "2026-11-15",
};

export const ZONES = [
  { id: "norte", name: "Quito Norte" },
  { id: "centro", name: "Quito Centro" },
  { id: "sur", name: "Quito Sur" },
  { id: "valles", name: "Valles (Cumbayá, Tumbaco, Los Chillos)" },
] as const;

export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const fullAddress = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, Ecuador`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.name} ${SITE.address.street} ${SITE.address.city}`,
)}`;
