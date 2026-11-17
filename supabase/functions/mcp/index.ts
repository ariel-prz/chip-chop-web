// Servidor MCP de Chip Chop Pet Shop (JSON-RPC 2.0 sobre HTTP, spec MCP 2025-06-18).
// Solo lectura: catálogo, envíos e información de la tienda. No crea pedidos.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SITE = "https://chipchoppetshop.com";
const PROTOCOL = "2025-06-18";
const VERSION = "1.0.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, mcp-protocol-version, mcp-session-id",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

type Producto = {
  sku: string; nombre: string; marca: string | null; presentacion: string | null;
  especies: string[]; categoria: string; categoria_id: string;
  precio: number; precio_promocion?: number; promocion?: string; url: string;
};

let cache: { at: number; data: { productos: Producto[]; actualizado: string; total: number } } | null = null;

async function catalogo() {
  if (cache && Date.now() - cache.at < 300_000) return cache.data;
  const r = await fetch(`${SITE}/catalogo.json`, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`No se pudo leer el catálogo (${r.status})`);
  const data = await r.json();
  cache = { at: Date.now(), data };
  return data;
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const ENVIOS: Record<string, { nombre: string; desde: number }> = {
  sur: { nombre: "Quito Sur", desde: 1.5 },
  centro: { nombre: "Quito Centro", desde: 1.5 },
  norte: { nombre: "Quito Norte", desde: 3 },
  valles: { nombre: "Valles (Cumbayá, Tumbaco, Los Chillos)", desde: 3 },
};

const TOOLS = [
  {
    name: "buscar_productos",
    title: "Buscar productos del catálogo",
    description:
      "Busca productos de Chip Chop Pet Shop (Quito) por texto, especie o categoría. Devuelve nombre, presentación, precio en USD, promoción vigente y el enlace a la ficha.",
    inputSchema: {
      type: "object",
      properties: {
        consulta: { type: "string", description: "Texto libre: marca, sabor o tipo de producto. Ej.: 'alimento seco cachorro'." },
        especie: { type: "string", enum: ["perros", "gatos", "conejos", "peces"], description: "Filtrar por especie." },
        categoria: {
          type: "string",
          enum: ["alimento-seco", "alimento-humedo", "snacks", "masticables", "antiparasitarios", "suplementos", "higiene", "accesorios", "juguetes"],
          description: "Filtrar por categoría.",
        },
        max: { type: "integer", minimum: 1, maximum: 50, default: 10, description: "Cuántos resultados devolver." },
      },
    },
  },
  {
    name: "consultar_envio",
    title: "Consultar costo de envío",
    description:
      "Devuelve el costo de envío desde la tienda hasta un sector de Quito, o el costo de retirar en el local.",
    inputSchema: {
      type: "object",
      properties: {
        zona: { type: "string", enum: ["norte", "centro", "sur", "valles", "retiro"], description: "Sector de entrega, o 'retiro' para recoger en la tienda." },
      },
      required: ["zona"],
    },
  },
  {
    name: "info_tienda",
    title: "Información de la tienda",
    description: "Dirección, horario, WhatsApp, formas de pago y de entrega de Chip Chop Pet Shop.",
    inputSchema: { type: "object", properties: {} },
  },
];

function text(obj: unknown) {
  return { content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 1) }] };
}

async function callTool(name: string, args: Record<string, unknown>) {
  if (name === "info_tienda") {
    return text({
      nombre: "Chip Chop Pet Shop",
      descripcion: "Tienda de mascotas en Quito con alimento, snacks y accesorios para perros, gatos, conejos y peces.",
      direccion: "Serapio Japerabi y Miguel Pontón, 170504 Quito, Ecuador",
      horario: "Todos los días, de 8:00 a 22:00 (hora de Quito)",
      whatsapp: "+593995252457",
      instagram: "https://www.instagram.com/chipchop_uio/",
      mapa: "https://www.google.com/maps?cid=17926873769618128884",
      pago: "Deuna (código QR). Cada pedido tiene un monto único con centavos que identifica el pago.",
      entrega: "Retiro en tienda sin costo, o envío con InDrive/Uber desde $1.50 (Sur y Centro) y desde $3.00 (Norte y Valles).",
      web: SITE,
    });
  }
  if (name === "consultar_envio") {
    const zona = String(args.zona ?? "").toLowerCase();
    if (zona === "retiro") {
      return text({ zona: "Retiro en tienda", costo: 0, moneda: "USD", nota: "Sin costo. Serapio Japerabi y Miguel Pontón, 8:00 a 22:00." });
    }
    const z = ENVIOS[zona];
    if (!z) return text(`Zona desconocida. Opciones: ${Object.keys(ENVIOS).join(", ")} o "retiro".`);
    return text({
      zona: z.nombre, desde: z.desde, moneda: "USD",
      nota: "Valor referencial. El costo exacto depende de la dirección y lo confirma la tienda por WhatsApp antes de despachar.",
      detalle: `${SITE}/envios/`,
    });
  }
  if (name === "buscar_productos") {
    const { productos, actualizado } = await catalogo();
    const q = args.consulta ? norm(String(args.consulta)).split(/\s+/).filter(Boolean) : [];
    const esp = args.especie ? String(args.especie) : null;
    const cat = args.categoria ? String(args.categoria) : null;
    const max = Math.min(Math.max(Number(args.max ?? 10) || 10, 1), 50);
    const res = productos
      .filter((p) => (!esp || p.especies.includes(esp)) && (!cat || p.categoria_id === cat))
      .map((p) => {
        const hay = norm([p.nombre, p.marca ?? "", p.categoria, p.presentacion ?? ""].join(" "));
        const score = q.length ? q.filter((t) => hay.includes(t)).length : 1;
        return { p, score };
      })
      .filter((x) => (q.length ? x.score > 0 : true))
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map(({ p }) => ({
        nombre: p.nombre, presentacion: p.presentacion, categoria: p.categoria,
        precio_usd: p.precio_promocion ?? p.precio,
        ...(p.precio_promocion ? { precio_normal_usd: p.precio, promocion: p.promocion } : {}),
        url: p.url,
      }));
    return text({ encontrados: res.length, catalogo_actualizado: actualizado, productos: res,
      nota: res.length ? "Precios en USD. Para comprar, abre la URL del producto." : "Sin coincidencias. Escribe a la tienda por WhatsApp: +593995252457." });
  }
  throw new Error(`Herramienta desconocida: ${name}`);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ name: "chipchop-petshop", version: VERSION, protocolVersion: PROTOCOL,
        transport: "streamable-http (POST JSON-RPC)", tools: TOOLS.map((t) => t.name), website: SITE }, null, 1),
      { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } },
    );
  }
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

  let msg: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    msg = await req.json();
  } catch {
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  }

  const { id, method, params = {} } = msg;
  const ok = (result: unknown) =>
    new Response(JSON.stringify({ jsonrpc: "2.0", id, result }), { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
  const fail = (code: number, message: string) =>
    new Response(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }), { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });

  try {
    if (method === "initialize") {
      const asked = String((params as { protocolVersion?: string }).protocolVersion ?? PROTOCOL);
      return ok({
        protocolVersion: asked.startsWith("20") ? asked : PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "chipchop-petshop", title: "Chip Chop Pet Shop", version: VERSION },
        instructions:
          "Catálogo, envíos e información de Chip Chop Pet Shop (Quito, Ecuador). Solo lectura: los pedidos se hacen en " + SITE + " o por WhatsApp.",
      });
    }
    if (method === "notifications/initialized" || method === "notifications/cancelled") {
      return new Response(null, { status: 202, headers: CORS });
    }
    if (method === "ping") return ok({});
    if (method === "tools/list") return ok({ tools: TOOLS });
    if (method === "tools/call") {
      const { name, arguments: args = {} } = params as { name: string; arguments?: Record<string, unknown> };
      try {
        return ok(await callTool(name, args));
      } catch (e) {
        return ok({ content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true });
      }
    }
    if (method === "resources/list") return ok({ resources: [] });
    if (method === "prompts/list") return ok({ prompts: [] });
    return fail(-32601, `Método no soportado: ${method}`);
  } catch (e) {
    return fail(-32603, e instanceof Error ? e.message : String(e));
  }
});
