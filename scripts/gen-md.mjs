// Genera una versión Markdown de cada página pública en out/<ruta>/index.md.
// El .htaccess la sirve cuando un agente pide Accept: text/markdown.
// Uso: node scripts/gen-md.mjs [out]
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";

const ROOT = process.argv[2] ?? "out";
const SITE = "https://chipchoppetshop.com";
const SKIP = ["panel", "checkout", "pedido", "carrito", "_next", "404", "_not-found"];

const nhm = new NodeHtmlMarkdown({ useLinkReferenceDefinitions: false, keepDataImages: false });

const pick = (html, re) => (html.match(re)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim();

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP.includes(name)) walk(p, out);
    } else if (name === "index.html") out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).split(sep).slice(0, -1).join("/");
  const route = rel ? `/${rel}/` : "/";
  if (SKIP.some((s) => route.startsWith(`/${s}`))) continue;
  const html = readFileSync(file, "utf8");
  if (/<meta name="robots" content="noindex/.test(html)) continue;

  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) continue;

  const title = pick(html, /<title>([^<]*)<\/title>/i);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/i);
  const body = nhm
    .translate(main)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const md = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(desc)}
canonical: ${SITE}${route}
site: Chip Chop Pet Shop — tienda de mascotas en Quito, Ecuador
license: search=yes, ai-input=yes, ai-train=no
---

${body}

---
Fuente: ${SITE}${route}
Catálogo en JSON: ${SITE}/catalogo.json · Resumen: ${SITE}/llms.txt · MCP: ${SITE}/.well-known/mcp/server-card.json
`;
  writeFileSync(join(ROOT, rel, "index.md"), md, "utf8");
  n++;
}
console.log(`${n} páginas en Markdown`);
