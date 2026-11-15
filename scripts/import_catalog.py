#!/usr/bin/env python3
"""Importa el catálogo desde el CSV de Ariel: genera src/data/catalog.json y las fotos
optimizadas con nombre descriptivo (producto, presentación, especie, categoría).

Uso: python3 -I scripts/import_catalog.py CSV CARPETA_FOTOS
"""
import csv, json, os, re, sys, unicodedata
from PIL import Image

CSV, PHOTOS = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_IMG = os.path.join(ROOT, "public", "img", "productos")
os.makedirs(OUT_IMG, exist_ok=True)

CAT = {
    "Alimento húmedo": "alimento-humedo", "Alimento seco": "alimento-seco",
    "Snacks y premios": "snacks", "Masticables": "masticables", "Accesorios": "accesorios",
    "Juguetes": "juguetes", "Higiene y cuidado": "higiene", "Antiparasitarios": "antiparasitarios",
    "Suplementos": "suplementos",
}
SP = {"Perro": ["perro"], "Gato": ["gato"], "Perro y gato": ["perro", "gato"]}
SP_TXT = {"perro": "perros", "gato": "gatos"}
# Precio en conflicto en el CSV (dos filas con precios distintos): se excluye hasta confirmar.
EXCLUDE_IMG = {"IMG_3646", "IMG_3650"}
FEATURED = {"IMG_3639", "IMG_3697", "IMG_3604", "IMG_3658", "IMG_3682", "IMG_3620", "IMG_3608", "IMG_3645"}

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-+", "-", s)

def size_of(p):
    p = p.replace("(peso no visible)", "").strip()
    return p or None

def describe(r, species, size):
    sp = " y ".join(SP_TXT[s] for s in species)
    brand = r["Marca"] if r["Marca"] != "Genérica" else ""
    de = f" {brand}" if brand else ""
    pres = f", {size.lower()}" if size else ""
    c = r["Categoría"]
    if c == "Alimento húmedo":
        return f"Alimento húmedo{de} para {sp}{pres}. Precio por unidad."
    if c == "Alimento seco":
        return f"Alimento seco (croquetas){de} para {sp}{pres}."
    if c == "Snacks y premios":
        return f"Snack{de} para {sp}{pres}. Dalo como premio, sin reemplazar su comida diaria."
    if c == "Masticables":
        return f"Masticable{de} para {sp}{pres}. Supervisa a tu perro mientras lo mastica."
    if c == "Antiparasitarios":
        return (f"Antiparasitario{de} para {sp}{pres}. Úsalo según las indicaciones del empaque y "
                "consulta a tu veterinario la dosis adecuada para el peso de tu mascota.")
    if c == "Suplementos":
        return f"Suplemento{de} para {sp}{pres}. Consulta a tu veterinario antes de agregarlo a su dieta."
    if c == "Higiene y cuidado":
        return f"Producto de higiene{de} para {sp}{pres}. Sigue las indicaciones del empaque."
    if c == "Juguetes":
        return f"Juguete{de} para {sp}. Precio por unidad."
    return f"Accesorio para {sp}{pres}. Precio por unidad."

rows = list(csv.DictReader(open(CSV, encoding="utf-8-sig")))
seen, products = set(), []
for r in rows:
    img = r["Imagen"].strip()
    if img in EXCLUDE_IMG:
        continue
    size = size_of(r["Presentación"])
    key = (r["Nombre"].strip(), r["Presentación"].strip())
    if key in seen:
        continue  # fila duplicada (misma foto de otro ángulo)
    seen.add(key)
    species = SP[r["Especie"].strip()]
    cat = CAT[r["Categoría"].strip()]
    name = r["Nombre"].strip().replace(" – ", ", ")
    slug = slugify(f"{name} {size or ''}")
    while any(p["slug"] == slug for p in products):
        slug += "-2"
    base = slugify(f"{name} {size or ''} {r['Especie']} {r['Categoría']}")[:110].strip("-")
    src = os.path.join(PHOTOS, f"{img}_formateada.jpeg")
    im = Image.open(src).convert("RGB")
    im.resize((800, 800), Image.LANCZOS).save(os.path.join(OUT_IMG, f"{base}.webp"), "WEBP", quality=78, method=6)
    im.resize((400, 400), Image.LANCZOS).save(os.path.join(OUT_IMG, f"{base}-400.webp"), "WEBP", quality=74, method=6)
    p = {
        "sku": "CC-" + img.replace("IMG_", ""),
        "slug": slug,
        "name": name,
        "species": species,
        "category": cat,
        "price": float(r["Precio"].replace("$", "").strip()),
        "description": describe(r, species, size),
        "image": f"/img/productos/{base}.webp",
    }
    if r["Marca"] != "Genérica":
        p["brand"] = r["Marca"].strip()
    if size:
        p["size"] = size
    if img in FEATURED:
        p["featured"] = True
    products.append(p)

json.dump(products, open(os.path.join(ROOT, "src", "data", "catalog.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(products), "productos")
