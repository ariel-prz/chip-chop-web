#!/usr/bin/env python3
"""Auditoría SEO/AEO del sitio exportado (carpeta out/), según la rúbrica del hackatón.

Uso: python3 scripts/audit.py [out]
Revisa el HTML crudo (lo que ven los bots que no ejecutan JavaScript).
"""
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out"
SITE = "https://chipchoppetshop.com"
PRIVATE = ("/panel/", "/checkout/", "/pedido/", "/carrito/", "/productos/proximamente/", "/404", "/conejos/", "/peces/")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta = {}
        self.links = []
        self.canonical = None
        self.lang = None
        self.headings = []
        self.cur_h = None
        self.imgs = []
        self.jsonld = []
        self.in_ld = False
        self.ld_buf = ""
        self.skip = 0
        self.text = []
        self.anchors = []
        self.cur_a = None

    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            k = a.get("name") or a.get("property")
            if k:
                self.meta[k] = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        if re.fullmatch(r"h[1-6]", tag):
            self.cur_h = [int(tag[1]), ""]
        if tag == "img":
            self.imgs.append(a)
        if tag == "script":
            if a.get("type") == "application/ld+json":
                self.in_ld = True
                self.ld_buf = ""
            else:
                self.skip += 1
        if tag in ("style", "noscript"):
            self.skip += 1
        if tag == "a":
            self.cur_a = [a.get("href", ""), ""]

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if self.cur_h and tag == f"h{self.cur_h[0]}":
            self.headings.append((self.cur_h[0], self.cur_h[1].strip()))
            self.cur_h = None
        if tag == "script":
            if self.in_ld:
                self.jsonld.append(self.ld_buf)
                self.in_ld = False
            else:
                self.skip -= 1
        if tag in ("style", "noscript"):
            self.skip -= 1
        if tag == "a" and self.cur_a:
            self.anchors.append((self.cur_a[0], self.cur_a[1].strip()))
            self.cur_a = None

    def handle_data(self, d):
        if self.in_title:
            self.title += d
        if self.in_ld:
            self.ld_buf += d
            return
        if self.skip:
            return
        if self.cur_h:
            self.cur_h[1] += d
        if self.cur_a:
            self.cur_a[1] += d
        self.text.append(d)


def route_of(path):
    rel = os.path.relpath(path, ROOT).replace(os.sep, "/")
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def exists(href):
    p = href.split("#")[0].split("?")[0]
    if not p.startswith("/"):
        return True
    f = os.path.join(ROOT, p.lstrip("/"))
    return os.path.isfile(f) or os.path.isfile(os.path.join(f, "index.html"))


def main():
    pages = []
    for d, _, files in os.walk(ROOT):
        for f in files:
            if f.endswith(".html"):
                pages.append(os.path.join(d, f))
    issues = 0
    titles = {}
    for path in sorted(pages):
        route = route_of(path)
        if route.startswith("/_next") or route.startswith("/_not-found"):
            continue
        html = open(path, encoding="utf-8").read()
        pg = Page()
        pg.feed(html)
        private = route.startswith(PRIVATE) or route == "/404.html"
        out = []
        t = pg.title.strip()
        titles.setdefault(t, []).append(route)
        if not private:
            if not (30 <= len(t) <= 65):
                out.append(f"title {len(t)} chars: {t!r}")
            d = pg.meta.get("description", "")
            if not (120 <= len(d) <= 165):
                out.append(f"description {len(d)} chars")
            for k in ("og:title", "og:description", "og:image"):
                if not pg.meta.get(k):
                    out.append(f"falta {k}")
            if pg.canonical != SITE + route:
                out.append(f"canonical {pg.canonical}")
            if "noindex" in pg.meta.get("robots", ""):
                out.append("noindex en página pública")
        if pg.lang != "es-EC":
            out.append(f"lang={pg.lang}")
        if not pg.meta.get("viewport"):
            out.append("sin viewport")
        h1 = [h for h in pg.headings if h[0] == 1]
        if len(h1) != 1:
            out.append(f"{len(h1)} H1")
        prev = 0
        for lvl, txt in pg.headings:
            if prev and lvl > prev + 1:
                out.append(f"salto de encabezado h{prev}->h{lvl} ({txt[:30]})")
            prev = lvl
        for img in pg.imgs:
            if "alt" not in img:
                out.append(f"img sin alt: {img.get('src')}")
            if not img.get("width") or not img.get("height"):
                out.append(f"img sin tamaño: {img.get('src')}")
        for raw in pg.jsonld:
            try:
                data = json.loads(raw)
            except Exception as e:  # noqa
                out.append(f"JSON-LD inválido: {e}")
                continue
        for href, txt in pg.anchors:
            if href.startswith("/") and not exists(href):
                out.append(f"enlace roto {href}")
            if re.search(r"\b(clic|click) aqu[ií]\b|^aqu[ií]$", txt, re.I):
                out.append(f"enlace genérico: {txt}")
        words = len(re.findall(r"\w+", " ".join(pg.text)))
        types = []
        for raw in pg.jsonld:
            try:
                data = json.loads(raw)
                for item in data if isinstance(data, list) else [data]:
                    types.append(item.get("@type"))
            except Exception:
                pass
        flag = "PRIV" if private else ("OK " if not out else "!! ")
        print(f"{flag} {route:32} {words:5} palabras  schema={','.join(types)}")
        for o in out:
            print("      -", o)
        if not private:
            issues += len(out)
    for t, rs in titles.items():
        if len(rs) > 1 and not all(r.startswith(PRIVATE) for r in rs):
            print("!! title duplicado:", t, rs)
            issues += 1
    for f in ("robots.txt", "sitemap.xml", "llms.txt", ".htaccess", "404.html"):
        ok = os.path.isfile(os.path.join(ROOT, f))
        print(("OK " if ok else "!! ") + f)
        issues += 0 if ok else 1
    robots = open(os.path.join(ROOT, "robots.txt")).read()
    if re.search(r"Disallow:\s*/\s*$", robots, re.M):
        print("!! robots.txt bloquea todo el sitio")
        issues += 1
    print(f"\nProblemas en páginas públicas: {issues}")


if __name__ == "__main__":
    main()
