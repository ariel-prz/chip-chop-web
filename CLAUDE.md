# Chip Chop Pet Shop: sitio web y ecommerce

Tienda de mascotas en Quito. Sitio para el hackatón de Hostinger "Hazte visible en internet y vende más"
(entrega 15 nov 2026, 14:00 Ecuador) y para clientes reales. Dueño: Ariel.

## Arquitectura

- **Next.js 16 con `output: "export"`**: todo se genera como HTML estático en `out/`. Así el texto
  principal viene en el HTML inicial (los bots de IA no ejecutan JavaScript). No usar funciones que
  requieran servidor: Server Actions, cookies, rewrites, `next/image` con loader por defecto, rutas
  dinámicas sin `generateStaticParams`.
- **Hosting:** Hostinger, plan Unlimited Web Hosting (sin Node.js). Se sube el contenido de `out/`.
  Dominio: chipchoppetshop.com. `public/.htaccess` fuerza HTTPS, quita www y define caché.
- **Backend:** Supabase, proyecto `chipchop-petshop` (id `yhyquywkowydbonbphov`, us-east-1).
  Esquema en `supabase/migrations/`. El navegador NUNCA lee tablas con datos personales: usa
  funciones `SECURITY DEFINER` (`create_order`, `get_order_status`, `attach_receipt`).
  El personal entra en `/panel/` con Supabase Auth y su `user_id` debe estar en `public.staff`.
- **Pagos:** Deuna Negocios en un Android del local. MacroDroid reenvía cada notificación
  "Recibiste $X,XX" a `rpc/ingest_deuna_notification` (con token secreto guardado en
  `private.settings`). Cada pedido recibe un monto único restando 1 a 99 centavos al subtotal; el
  monto de la notificación empareja el pedido. Ver `docs/MACRODROID.md`.

## Fuentes de verdad

- Datos del negocio (nombre, dirección, horario, WhatsApp, redes): `src/lib/site.ts`. El texto visible y
  el schema leen de ahí; deben coincidir letra por letra con Google Business.
- Catálogo: `src/data/products.ts`. Después de cambiar precios, sincronizar `public.products` en
  Supabase (el servidor calcula el total con esos precios, nunca con los del navegador).
- Preguntas frecuentes: `src/data/faq.ts` (alimentan la página y el schema FAQPage).
- Marca: Manual de marca (colores, Bitter + Nunito Sans, voz "experto cercano", Caramelo es el perro
  del logo). Tokens en `src/app/globals.css`. El dorado nunca se usa como color de texto.

## Reglas de contenido

- Nunca inventar precios, cifras, reseñas, años, políticas ni datos de productos. Si falta un dato,
  dejar `TODO` y preguntar a Ariel.
- Voz: tuteo, claro antes que técnico, sin emojis en la web, sin promesas de salud. Para temas de
  salud, recomendar ir al veterinario.
- Cada página pública: un solo H1, H2 en forma de pregunta cuando aplique, respuesta directa en el
  primer párrafo (40 a 60 palabras), title de 50 a 60 caracteres, description de 140 a 160, fecha de
  actualización visible.

## Publicar (mientras GitHub no esté conectado en hPanel)

1. `npm run build && python3 scripts/audit.py out`
2. Empaquetar: `cd out && zip -qr ../site.zip .` y subir `site.zip` como único archivo a la rama
   `artifact` del repo `ariel-prz/chip-chop-web` (push forzado).
3. Hostinger Connector: `hosting_git_deploy-website-repository` (usuario `u671917736`, dominio
   `chipchoppetshop.com`, rama `artifact`, directorio `_paquete`) y luego
   `hosting_websites_deploy-static-site-archive` con `archive_path: "_paquete/site.zip"`.
   El segundo paso reemplaza todo el contenido del sitio por el zip.
4. Verificar el sitio en vivo.

Cuando Ariel conecte GitHub en hPanel (Sitios web > Administrar > Avanzado > Git), usar
`hosting_deploy` con `type: "static"` sobre una rama que contenga `out/` para tener despliegue
automático en cada push.

## Comandos

```bash
npm run build                 # genera out/
python3 scripts/audit.py out  # auditoría de la rúbrica SEO/AEO sobre el HTML crudo
```

Lighthouse móvil de referencia (15 nov 2026): 100/100/100/100, LCP 1.1 s, CLS 0.

## Rúbricas del hackatón (20 + 20 puntos)

SEO: title, meta description + OG, encabezados, tema y 300+ palabras, indexable (canonical, HTTPS,
lang), robots.txt + sitemap, imágenes con alt y livianas, Lighthouse móvil 80+ (LCP < 2.5 s,
CLS < 0.1), móvil usable, enlaces sanos y descriptivos.
AEO: respuesta directa arriba, H2 como preguntas, FAQ visible, JSON-LD válido y coherente, contenido
sin JavaScript, robots abierto a GPTBot/ClaudeBot/PerplexityBot/Google-Extended + llms.txt, formato
extraíble, identidad consistente con redes, datos concretos, señales de confianza.
