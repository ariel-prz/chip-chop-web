import Link from "next/link";
import {
  Ambulance,
  BadgeCheck,
  ExternalLink,
  Flower2,
  HeartPulse,
  MessageCircle,
  Scale,
  ShieldPlus,
  Stethoscope,
} from "lucide-react";
import { Breadcrumbs, FaqList } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import type { Faq } from "@/data/faq";
import { pageMeta } from "@/lib/meta";
import { faqSchema } from "@/lib/schema";
import { waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Seguros para mascotas en Ecuador: tipos | Chip Chop",
  description:
    "Qué tipos de seguro para perros y gatos existen en Ecuador, qué cubren y qué aseguradoras los ofrecen. Guía de Chip Chop Pet Shop con enlaces a cada una.",
  path: "/seguros-para-mascotas/",
});

// Parámetros para que cada aseguradora vea que el visitante llegó desde Chip Chop.
// Sirven como evidencia de tráfico si más adelante se negocia un convenio.
const UTM = "utm_source=chipchoppetshop&utm_medium=referral&utm_campaign=seguros-mascotas";

const TYPES = [
  {
    id: "salud",
    Icon: HeartPulse,
    title: "Seguro de salud o gastos veterinarios",
    text: "Paga o reembolsa consultas, exámenes, hospitalización o cirugía por accidente o enfermedad, hasta el límite de la póliza.",
    when: "Si te preocupa una cuenta grande e inesperada en el veterinario.",
  },
  {
    id: "prepagada",
    Icon: Stethoscope,
    title: "Medicina prepagada o asistencia veterinaria",
    text: "Pagas una cuota mensual y usas una red de veterinarias con consultas, vacunas o desparasitación incluidas según el plan.",
    when: "Si quieres prevención y controles al día con un costo fijo cada mes.",
  },
  {
    id: "accidentes",
    Icon: Ambulance,
    title: "Seguro de accidentes",
    text: "Cubre atención por accidentes (atropellos, caídas, mordeduras) con un número de eventos y un monto máximo por año.",
    when: "Si tu mascota sale mucho a la calle o al parque.",
  },
  {
    id: "terceros",
    Icon: Scale,
    title: "Responsabilidad civil (daños a terceros)",
    text: "Responde si tu mascota causa daño a otra persona, a otra mascota o a cosas ajenas, hasta el monto asegurado.",
    when: "Si tienes un perro grande o vives en edificio o conjunto.",
  },
  {
    id: "exequial",
    Icon: Flower2,
    title: "Gastos finales y exequiales",
    text: "Ayuda con los costos de despedida de tu mascota, como cremación o sepelio, según lo que indique el plan.",
    when: "Si prefieres tener resuelto ese momento con anticipación.",
  },
];

type Provider = {
  name: string;
  what: string;
  source: string;
  href: string;
  official: boolean;
};

// Solo información publicada por las propias empresas o por medios. Sin convenio con ninguna.
const PROVIDERS: Provider[] = [
  {
    name: "Zurich Seguros Ecuador",
    what: "Póliza de seguro para mascotas (perros y gatos de compañía). Sus condiciones generales incluyen cobertura de responsabilidad civil, robo y gastos como cirugía.",
    source: "Condiciones generales publicadas por Zurich Seguros Ecuador",
    href: `https://www.zurichseguros.com.ec/?${UTM}`,
    official: true,
  },
  {
    name: "Sweaden Seguros (Sweaden Pet)",
    what: "Seguro para accidentes de perros y gatos, daños a terceros, reembolso por sepelio, orientación veterinaria, veterinario a domicilio, hotel y traslado por emergencia.",
    source: "Revista Ekos y revista Vistazo",
    href: `https://www.sweadenseguros.com/?${UTM}`,
    official: true,
  },
  {
    name: "Amascota (Corporación Inmedical)",
    what: "Planes de asistencia médica veterinaria, preventiva y curativa, lanzados en agosto de 2023 por la empresa de medicina prepagada Inmedical.",
    source: "Diario Primicias",
    href: "https://primicias.ec/noticias/economia/empresa-medicina-mascotas-ecuador-salud",
    official: false,
  },
  {
    name: "AsistVET",
    what: "Asistencia veterinaria prepagada con tres planes mensuales (Silver, Gold y Black) que varían según la raza y la edad de la mascota.",
    source: "Diario Primicias",
    href: "https://www.primicias.ec/economia/empresas/perros-gatos-seguros-salud-vida-mascotas-costo-precio-127084/",
    official: false,
  },
  {
    name: "Diners Club con Coris",
    what: "Plan para perros en Quito, Guayaquil y Cuenca, con un paquete básico y uno plus de pago mensual.",
    source: "Diario Primicias",
    href: "https://primicias.ec/economia/perrhijos-seguros-medicos-servicios-exequiales-mascotas-92733",
    official: false,
  },
];

const FAQ_SEGUROS: Faq[] = [
  {
    q: "¿Existen seguros médicos para mascotas en Ecuador?",
    a: "Sí. Varias aseguradoras y empresas de medicina prepagada ofrecen planes para perros y gatos, sobre todo en Quito, Guayaquil y Cuenca. Cubren desde accidentes y enfermedades hasta daños a terceros y gastos finales, según el plan.",
  },
  {
    q: "¿Qué debo revisar antes de contratar un seguro para mi mascota?",
    a: "Las exclusiones (lo que no cubre), si acepta enfermedades que tu mascota ya tiene, la edad mínima y máxima de ingreso, la ciudad de cobertura, el límite por evento y por año, y si funciona con red de veterinarias o por reembolso.",
  },
  {
    q: "¿Chip Chop vende seguros para mascotas?",
    a: "No. Chip Chop no vende seguros ni tiene convenio con ninguna aseguradora por ahora. En esta página te explicamos los tipos de seguro y te dejamos los enlaces para que contrates directamente con cada empresa.",
  },
  {
    q: "¿Los seguros cubren a conejos o peces?",
    a: "Los planes que encontramos en Ecuador son para perros y gatos. Si tienes otra mascota, pregunta directamente a la aseguradora.",
  },
];

export default function Seguros() {
  return (
    <div className="wrap">
      <JsonLd data={faqSchema(FAQ_SEGUROS)} />
      <Breadcrumbs items={[{ name: "Seguros para mascotas", path: "/seguros-para-mascotas/" }]} />

      <section className="ins-hero">
        <ShieldPlus className="ins-hero-icon" aria-hidden="true" strokeWidth={1.5} />
        <div>
          <h1>Seguros para mascotas en Ecuador: tipos y opciones</h1>
          <p className="lead">
            En Ecuador hay seguros para perros y gatos que cubren accidentes, enfermedades, daños a terceros y gastos
            finales, además de planes de medicina prepagada veterinaria. Aquí te explicamos cada tipo en un minuto y
            te dejamos los enlaces de las empresas que los ofrecen, para que compares y contrates directamente.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary btn-lg" href="#tipos">
              ¿Qué tipo necesito?
            </a>
            <a className="btn btn-secondary btn-lg" href="#opciones">
              Ver aseguradoras
            </a>
          </div>
        </div>
      </section>

      <p className="disclosure">
        <BadgeCheck aria-hidden="true" size={20} />
        <span>
          <strong>Información independiente.</strong> Chip Chop no vende seguros ni tiene convenio con ninguna de
          estas empresas. Los datos vienen de sus documentos públicos y de medios ecuatorianos; precios y coberturas
          pueden cambiar, así que confírmalos con cada aseguradora antes de contratar.
        </span>
      </p>

      <section aria-labelledby="tipos">
        <h2 id="tipos">¿Qué tipos de seguro para mascotas existen?</h2>
        <ul className="ins-types">
          {TYPES.map(({ id, Icon, title, text, when }) => (
            <li key={id} id={`tipo-${id}`}>
              <Icon aria-hidden="true" strokeWidth={1.75} />
              <h3>{title}</h3>
              <p>{text}</p>
              <p className="ins-when">{when}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="checklist">
        <h2 id="checklist">¿Qué revisar antes de contratar?</h2>
        <ol className="steps">
          <li>
            <strong>Lo que no cubre.</strong> Lee la lista de exclusiones antes que la de coberturas.
          </li>
          <li>
            <strong>Enfermedades previas.</strong> Muchas pólizas no cubren lo que tu mascota ya tiene.
          </li>
          <li>
            <strong>Edad de ingreso.</strong> Algunos planes solo aceptan mascotas dentro de un rango de edad.
          </li>
          <li>
            <strong>Ciudad y red.</strong> Confirma que funcione en Quito y con qué veterinarias.
          </li>
          <li>
            <strong>Límites.</strong> Cuánto paga por evento, cuántos eventos al año y si es por reembolso.
          </li>
        </ol>
      </section>

      <section aria-labelledby="opciones">
        <h2 id="opciones">¿Qué empresas ofrecen seguros para mascotas en Ecuador?</h2>
        <p>
          Estas son opciones que encontramos con información pública. El orden no es una recomendación. Los enlaces se
          abren en una pestaña nueva.
        </p>
        <ul className="ins-providers">
          {PROVIDERS.map((p) => (
            <li key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.what}</p>
              <p className="hint">Fuente: {p.source}.</p>
              <a className="btn btn-secondary" href={p.href} target="_blank" rel="noopener">
                {p.official ? `Ir al sitio de ${p.name.split(" (")[0]}` : `Leer sobre ${p.name.split(" (")[0]}`}
                <ExternalLink aria-hidden="true" size={18} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="ins-cta" aria-labelledby="ayuda">
        <h2 id="ayuda">¿Tienes dudas sobre qué te conviene?</h2>
        <p>
          Escríbenos por WhatsApp contándonos la edad y la especie de tu mascota, y te decimos qué tipo de seguro revisar
          primero. No vendemos seguros: solo te orientamos para que preguntes lo correcto.
        </p>
        <a className="btn btn-gold btn-lg" href={waLink("Hola Chip Chop, quiero orientación sobre seguros para mi mascota")} target="_blank" rel="noopener">
          <MessageCircle aria-hidden="true" size={20} /> Pedir orientación por WhatsApp
        </a>
      </section>

      <section aria-labelledby="faq-seguros">
        <h2 id="faq-seguros">Preguntas frecuentes sobre seguros para mascotas</h2>
        <FaqList items={FAQ_SEGUROS} />
      </section>

      <p>
        Mientras eliges un seguro, la prevención diaria también cuenta:{" "}
        <Link href="/productos/#cat-antiparasitarios">mira nuestros antiparasitarios</Link> y{" "}
        <Link href="/productos/#cat-suplementos">suplementos</Link>.
      </p>
      <p className="updated">Información revisada el 15 de noviembre de 2026.</p>
    </div>
  );
}
