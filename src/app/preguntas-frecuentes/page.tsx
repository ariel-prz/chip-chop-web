import { Breadcrumbs, FaqList } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { FAQ_GENERAL } from "@/data/faq";
import { pageMeta } from "@/lib/meta";
import { faqSchema } from "@/lib/schema";
import { waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Preguntas frecuentes | Chip Chop Pet Shop, mascotas en Quito",
  description:
    "Respuestas sobre horario, ubicación, pagos con Deuna, montos con centavos, envíos en Quito y Valles y retiro en tienda en Chip Chop Pet Shop. Todo en un solo lugar.",
  path: "/preguntas-frecuentes/",
});

export default function PreguntasFrecuentes() {
  return (
    <div className="wrap">
      <JsonLd data={faqSchema(FAQ_GENERAL)} />
      <Breadcrumbs items={[{ name: "Preguntas frecuentes", path: "/preguntas-frecuentes/" }]} />
      <h1>Preguntas frecuentes sobre Chip Chop Pet Shop</h1>
      <p>
        Estas son las preguntas que más nos hacen en la tienda y por WhatsApp, sobre ubicación, horario, pagos con
        Deuna y envíos en Quito. Si tu duda no está aquí,{" "}
        <a href={waLink("Hola Chip Chop, tengo una pregunta")} target="_blank" rel="noopener">
          escríbenos por WhatsApp
        </a>
        .
      </p>
      <FaqList items={FAQ_GENERAL} headingLevel={2} />
      <p className="updated">Actualizado el 15 de noviembre de 2026.</p>
    </div>
  );
}
