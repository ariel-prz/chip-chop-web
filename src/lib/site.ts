// Fuente única de verdad del negocio. Todo el sitio (texto visible y schema)
// lee de aquí, para que nombre, dirección y contacto coincidan siempre (AEO #8).

export const SITE = {
  name: "Chip Chop Pet Shop",
  url: "https://chipchoppetshop.com",
  locale: "es-EC",
  description:
    "Pet shop en Quito con alimento y accesorios para perros, gatos, conejos y peces. Compra en línea, paga con Deuna y retira en tienda o recibe en tu casa.",
  phoneDisplay: "099 525 2457 (+593 99 525 2457)",
  phoneE164: "+593995252457",
  whatsapp: "593995252457",
  instagram: "https://www.instagram.com/chipchop_uio/",
  instagramHandle: "@chipchop_uio",
  googleBusiness: "https://www.google.com/maps?cid=17926873769618128884",
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

// Tarifas "desde" confirmadas por Ariel (15 nov 2026). El valor final depende de la dirección
// y se confirma por WhatsApp antes de despachar.
export const ZONES = [
  { id: "sur", name: "Quito Sur", from: 1.5 },
  { id: "centro", name: "Quito Centro", from: 1.5 },
  { id: "norte", name: "Quito Norte", from: 3 },
  { id: "valles", name: "Valles (Cumbayá, Tumbaco, Los Chillos)", from: 3 },
] as const;

export const SHIPPING_SUMMARY = "desde $1.50 a Quito Sur y Centro, y desde $3.00 a Quito Norte y los Valles";

export const STORE_PHOTOS = [
  { file: "fachada-chip-chop-pet-shop-quito-equipo", alt: "Ariel, dueño de Chip Chop Pet Shop, en la entrada de la tienda en Quito, bajo el letrero con Caramelo" },
  { file: "interior-chip-chop-pet-shop-alimento-accesorios", alt: "Interior de Chip Chop Pet Shop: perchas con alimento, snacks y accesorios para mascotas" },
  { file: "interior-chip-chop-pet-shop-balanza-alimento-por-libras", alt: "Mostrador de Chip Chop Pet Shop con balanza y recipientes de alimento por libras" },
  { file: "fachada-chip-chop-pet-shop-quito", alt: "Fachada de Chip Chop Pet Shop en Serapio Japerabi y Miguel Pontón, Quito" },
] as const;

export const GEO = { lat: -0.2565227, lng: -78.5344705 };


export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const fullAddress = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, Ecuador`;

export const mapsLink = SITE.googleBusiness;
