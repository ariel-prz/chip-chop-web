import Link from "next/link";
import { Breadcrumbs } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { POSTS } from "@/data/blog";
import { pageMeta } from "@/lib/meta";
import { SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "Consejos de Caramelo | Blog de Chip Chop Pet Shop Quito",
  description:
    "Guías cortas y prácticas para cuidar a tu perro o gato: cómo cambiar su alimento, cuánta agua necesita y cómo usar antiparasitarios. Por Chip Chop Pet Shop, Quito.",
  path: "/consejos-de-caramelo/",
});

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Consejos de Caramelo",
  url: `${SITE.url}/consejos-de-caramelo/`,
  publisher: { "@id": `${SITE.url}/#tienda` },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${SITE.url}/consejos-de-caramelo/${p.slug}/`,
    datePublished: p.datePublished,
  })),
};

export default function Blog() {
  return (
    <div className="wrap">
      <JsonLd data={blogSchema} />
      <Breadcrumbs items={[{ name: "Consejos de Caramelo", path: "/consejos-de-caramelo/" }]} />
      <div className="blog-head">
        <img src="/img/caramelo-144.webp" alt="Caramelo, el perro mascota de Chip Chop" width="96" height="96" />
        <div>
          <h1>Consejos de Caramelo</h1>
          <p className="lead">
            Soy Caramelo, el perro del logo de Chip Chop. Aquí mi familia responde con calma las preguntas que más le
            hacen en la tienda sobre alimentación, agua y antiparasitarios. Son guías generales: para el caso de tu
            mascota, tu veterinario tiene la última palabra.
          </p>
        </div>
      </div>
      <ul className="blog-list">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <h2>
              <Link href={`/consejos-de-caramelo/${p.slug}/`}>{p.title}</Link>
            </h2>
            <p>{p.summary}</p>
            <p className="updated">Publicado el 15 de noviembre de 2026</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
