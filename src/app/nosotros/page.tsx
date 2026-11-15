import Link from "next/link";
import { Breadcrumbs } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import { SITE, fullAddress, mapsLink, waLink } from "@/lib/site";

export const metadata = pageMeta({
  title: "Quiénes somos | Chip Chop Pet Shop, tienda familiar en Quito",
  description:
    "Chip Chop Pet Shop es una tienda familiar de mascotas en Quito con local físico y permisos de funcionamiento. Conoce quién nos atiende y a Caramelo, nuestra mascota.",
  path: "/nosotros/",
});

const about = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Quiénes somos",
  url: `${SITE.url}/nosotros/`,
  about: { "@id": `${SITE.url}/#tienda` },
  dateModified: SITE.lastUpdated,
};

export default function Nosotros() {
  return (
    <div className="wrap">
      <JsonLd data={about} />
      <Breadcrumbs items={[{ name: "Nosotros", path: "/nosotros/" }]} />
      <h1>Quiénes somos: Chip Chop Pet Shop</h1>
      <div className="two-col">
        <div>
          <p>
            Chip Chop Pet Shop es una tienda de mascotas familiar en Quito. Tenemos local físico en{" "}
            {SITE.address.street}, con permisos de funcionamiento, y atendemos todos los días de 8:00 a 22:00.
          </p>
          <h2>¿Quién te atiende?</h2>
          <p>
            La tienda la lleva Ariel, su dueño, junto con su familia. Ariel estudia Ingeniería en Sistemas y
            construyó esta tienda en línea para que puedas pedir desde el celular y pagar sin efectivo, con el
            mismo trato que recibes en el local.
          </p>
          <h2>¿Quién es Caramelo?</h2>
          <p>
            {SITE.mascot} es el perro de nuestro logo, el que recibe el abrazo. Es curioso, cariñoso y glotón, pero le
            importa comer bien, igual que a nosotros nos importa que cada mascota se alimente y se cuide mejor.
          </p>
          <h2>¿Qué vendemos?</h2>
          <p>
            Unos 60 a 70 productos seleccionados de alimento, snacks, accesorios e higiene para perros, gatos,
            conejos y peces. <Link href="/productos/">Mira el catálogo con precios</Link>.
          </p>
        </div>
        <img
          src="/img/logo-480.webp"
          width="420"
          height="420"
          alt="Caramelo, el perro mascota de Chip Chop Pet Shop, recibiendo un abrazo en el logo"
          loading="lazy"
        />
      </div>
      <h2>¿Cómo contactarnos?</h2>
      <ul>
        <li>
          Local:{" "}
          <a href={mapsLink} target="_blank" rel="noopener">
            {fullAddress}
          </a>
        </li>
        <li>
          WhatsApp:{" "}
          <a href={waLink("Hola Chip Chop")} target="_blank" rel="noopener">
            {SITE.phoneDisplay}
          </a>
        </li>
        <li>
          Instagram:{" "}
          <a href={SITE.instagram} target="_blank" rel="noopener me">
            {SITE.instagramHandle}
          </a>
        </li>
        <li>
          <a href={SITE.googleBusiness} target="_blank" rel="noopener me">
            Perfil de Chip Chop Pet Shop en Google
          </a>
        </li>
      </ul>
      <p className="updated">Actualizado el 15 de noviembre de 2026.</p>
    </div>
  );
}
