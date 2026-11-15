import Link from "next/link";
import { notFound } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { Breadcrumbs } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { POSTS, postBySlug } from "@/data/blog";
import { pageMeta } from "@/lib/meta";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return pageMeta({ title: `${p.title} | Chip Chop`, description: p.description, path: `/consejos-de-caramelo/${p.slug}/` });
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  const url = `${SITE.url}/consejos-de-caramelo/${p.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    url,
    mainEntityOfPage: url,
    datePublished: p.datePublished,
    dateModified: p.dateModified,
    inLanguage: SITE.locale,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@id": `${SITE.url}/#tienda` },
    image: `${SITE.url}/img/og-image.jpg`,
  };
  const others = POSTS.filter((x) => x.slug !== p.slug);
  return (
    <article className="wrap post">
      <JsonLd data={schema} />
      <Breadcrumbs
        items={[
          { name: "Consejos de Caramelo", path: "/consejos-de-caramelo/" },
          { name: p.title, path: `/consejos-de-caramelo/${p.slug}/` },
        ]}
      />
      <h1>{p.title}</h1>
      <p className="updated">
        Por el equipo de {SITE.name} · Publicado el 15 de noviembre de 2026
      </p>
      <p className="lead post-summary">{p.summary}</p>
      {p.sections.map((s) => (
        <section key={s.h2}>
          <h2>{s.h2}</h2>
          {s.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {s.list && (
            <ul>
              {s.list.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <p className="disclosure">
        <Stethoscope aria-hidden="true" size={20} />
        <span>
          Esta guía es información general y no reemplaza la consulta veterinaria. Cada mascota es distinta: ante
          cualquier duda o síntoma, acude a tu veterinario.
        </span>
      </p>
      {p.related && (
        <p>
          <Link className="btn btn-primary" href={p.related.href}>
            {p.related.label}
          </Link>
        </p>
      )}
      <section aria-labelledby="mas">
        <h2 id="mas">Más consejos de Caramelo</h2>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/consejos-de-caramelo/${o.slug}/`}>{o.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
