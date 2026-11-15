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
- Catálogo: `src/data/catalog.json` (generado desde el CSV con `scripts/import_catalog.py`, que también renombra las fotos como producto-presentación-especie-categoría). Tipos en `src/data/products.ts`. Después de cambiar precios, sincronizar `public.products` en
  Supabase (el servidor calcula el total con esos precios, nunca con los del navegador).
- Preguntas frecuentes: `src/data/faq.ts` (alimentan la página y el schema FAQPage).
- Marca: Manual de marca (colores, Bitter + Nunito Sans, voz "experto cercano", Caramelo es el perro
  del logo). Tokens en `src/app/globals.css`. El dorado nunca se usa como color de texto.

## Diseño de interfaz (vigente desde el 15 nov 2026)

Usar la skill `frontend-design` para cualquier pantalla nueva o rediseño. Público: clientes de 10 a 65
años, mayoría en teléfono. Objetivo: que naveguen más tiempo y encuentren rápido, sin trucos que
retengan a la fuerza (nada de pop-ups, contadores falsos ni urgencia inventada).

- **Elemento memorable:** la "vitrina" de la portada (Caramelo sobre un estante azul con fotos reales
  de productos). No usar fotos de stock ni ilustraciones genéricas de mascotas.
- **Íconos:** Lucide (`lucide-react`), trazo 1.75, siempre con texto visible al lado o debajo (los
  íconos ahorran lectura pero no reemplazan la etiqueta). Mapas en `src/components/Icons.tsx`
  (categoría y especie). Se renderizan como SVG en el servidor: no suman JavaScript.
- **Navegación:** fila de categorías con ícono y conteo (`CategoryRail`), botones por especie, y en
  teléfonos la barra inferior fija `MobileTabBar` (Inicio, Productos, Carrito, WhatsApp). Áreas
  táctiles de 44 px mínimo; botones grandes `btn-lg` en acciones principales.
- **Permanencia:** carruseles de productos con scroll-snap (`ProductCarousel`), consejos de
  Caramelo (`CarameloTips`), productos relacionados en cada ficha, enlaces internos descriptivos.
- **Promociones:** franja `BlackFridayBand` sobre el pie, alimentada por `src/data/promos.ts`.
  Solo descuentos confirmados por Ariel. Cuenta regresiva real hacia `startsAt`.
  Vigente: 10 % en todo el alimento seco desde el viernes 27 nov 2026 (el descuento aún NO se
  aplica automáticamente en `create_order`; implementarlo antes de esa fecha o aplicarlo a mano).
- **Movimiento:** casi nada. Sin animaciones de entrada por sección. Respetar `prefers-reduced-motion`.
- **Colores en promociones:** fondo negro tinta con el dorado como superficie; el dorado nunca es
  color de texto.

### Diseño sin perder SEO/AEO (no negociable)

- El H1 y el párrafo de respuesta directa van primero en el HTML y arriba en el teléfono; las imágenes
  decorativas van después.
- Todo texto importante es texto HTML, nunca dentro de una imagen.
- Los carruseles y pestañas renderizan todo su contenido en el HTML (sin cargar al hacer clic).
- Cada componente interactivo es una isla `"use client"` pequeña; no importar el catálogo completo
  en componentes de cliente.
- Antes de publicar: `python3 scripts/audit.py out` en 0 y Lighthouse móvil de la portada y del
  catálogo con rendimiento 90+ y LCP < 2.5 s.

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

Lighthouse móvil de referencia (15 nov 2026, tras el rediseño): portada 97 / LCP 0.8 s; catálogo 99 / LCP 0.8 s; accesibilidad, buenas prácticas y SEO en 100; CLS 0.

## Rúbricas del hackatón (20 + 20 puntos)

SEO: title, meta description + OG, encabezados, tema y 300+ palabras, indexable (canonical, HTTPS,
lang), robots.txt + sitemap, imágenes con alt y livianas, Lighthouse móvil 80+ (LCP < 2.5 s,
CLS < 0.1), móvil usable, enlaces sanos y descriptivos.
AEO: respuesta directa arriba, H2 como preguntas, FAQ visible, JSON-LD válido y coherente, contenido
sin JavaScript, robots abierto a GPTBot/ClaudeBot/PerplexityBot/Google-Extended + llms.txt, formato
extraíble, identidad consistente con redes, datos concretos, señales de confianza.
