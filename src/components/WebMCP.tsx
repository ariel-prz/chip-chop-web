"use client";

import { useEffect } from "react";

// WebMCP: expone herramientas al agente que navega la página.
// Se registra solo si el navegador implementa navigator.modelContext; si no, no hace nada.
// No importa el catálogo: lo descarga desde /catalogo.json cuando una herramienta se usa.

type Result = { content: { type: "text"; text: string }[] };
type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<Result>;
};

type Producto = {
  nombre: string;
  marca: string | null;
  presentacion: string | null;
  especies: string[];
  categoria: string;
  categoria_id: string;
  precio: number;
  precio_promocion?: number;
  promocion?: string;
  url: string;
};

const say = (v: unknown): Result => ({
  content: [{ type: "text", text: typeof v === "string" ? v : JSON.stringify(v, null, 1) }],
});

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Catalogo = { productos: Producto[]; actualizado: string };
let cache: Promise<Catalogo> | null = null;
const catalogo = (): Promise<Catalogo> => (cache ??= fetch("/catalogo.json").then((r) => r.json() as Promise<Catalogo>));

const ZONAS: Record<string, { nombre: string; desde: number }> = {
  sur: { nombre: "Quito Sur", desde: 1.5 },
  centro: { nombre: "Quito Centro", desde: 1.5 },
  norte: { nombre: "Quito Norte", desde: 3 },
  valles: { nombre: "Valles (Cumbayá, Tumbaco, Los Chillos)", desde: 3 },
};

const TOOLS: Tool[] = [
  {
    name: "buscar_productos",
    description:
      "Busca productos de Chip Chop Pet Shop por texto, especie o categoría. Devuelve nombre, presentación, precio en USD y el enlace de la ficha.",
    inputSchema: {
      type: "object",
      properties: {
        consulta: { type: "string", description: "Texto libre: marca, sabor o tipo de producto." },
        especie: { type: "string", enum: ["perros", "gatos", "conejos", "peces"] },
        categoria: {
          type: "string",
          enum: ["alimento-seco", "alimento-humedo", "snacks", "masticables", "antiparasitarios", "suplementos", "higiene", "accesorios", "juguetes"],
        },
        max: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
    },
    async execute(args) {
      const { productos, actualizado } = await catalogo();
      const q = args.consulta ? norm(String(args.consulta)).split(/\s+/).filter(Boolean) : [];
      const esp = args.especie ? String(args.especie) : null;
      const cat = args.categoria ? String(args.categoria) : null;
      const max = Math.min(Math.max(Number(args.max ?? 10) || 10, 1), 50);
      const res = productos
        .filter((p) => (!esp || p.especies.includes(esp)) && (!cat || p.categoria_id === cat))
        .map((p) => {
          const hay = norm([p.nombre, p.marca ?? "", p.categoria, p.presentacion ?? ""].join(" "));
          return { p, score: q.length ? q.filter((t) => hay.includes(t)).length : 1 };
        })
        .filter((x) => (q.length ? x.score > 0 : true))
        .sort((a, b) => b.score - a.score)
        .slice(0, max)
        .map(({ p }) => ({
          nombre: p.nombre,
          presentacion: p.presentacion,
          categoria: p.categoria,
          precio_usd: p.precio_promocion ?? p.precio,
          ...(p.precio_promocion ? { precio_normal_usd: p.precio, promocion: p.promocion } : {}),
          url: p.url,
        }));
      return say({ encontrados: res.length, catalogo_actualizado: actualizado, productos: res });
    },
  },
  {
    name: "consultar_envio",
    description: "Costo de envío de Chip Chop Pet Shop a un sector de Quito, o retiro en el local.",
    inputSchema: {
      type: "object",
      properties: { zona: { type: "string", enum: ["norte", "centro", "sur", "valles", "retiro"] } },
      required: ["zona"],
    },
    async execute(args) {
      const zona = String(args.zona ?? "").toLowerCase();
      if (zona === "retiro") return say({ zona: "Retiro en tienda", costo: 0, moneda: "USD" });
      const z = ZONAS[zona];
      if (!z) return say(`Zona desconocida. Opciones: ${Object.keys(ZONAS).join(", ")} o "retiro".`);
      return say({
        zona: z.nombre,
        desde: z.desde,
        moneda: "USD",
        nota: "Valor referencial; el costo exacto se confirma por WhatsApp antes de despachar.",
      });
    },
  },
  {
    name: "info_tienda",
    description: "Dirección, horario, WhatsApp y formas de pago y entrega de Chip Chop Pet Shop.",
    inputSchema: { type: "object", properties: {} },
    async execute() {
      return say({
        nombre: "Chip Chop Pet Shop",
        direccion: "Serapio Japerabi y Miguel Pontón, 170504 Quito, Ecuador",
        horario: "Todos los días, de 8:00 a 22:00",
        whatsapp: "+593995252457",
        pago: "Deuna (código QR), con monto único por pedido",
        entrega: "Retiro sin costo, o envío desde $1.50 (Sur y Centro) y desde $3.00 (Norte y Valles)",
        mcp: "https://chipchoppetshop.com/.well-known/mcp/server-card.json",
      });
    },
  },
];

type ModelContext = {
  registerTool?: (tool: Tool) => unknown;
  provideContext?: (ctx: { tools: Tool[] }) => unknown;
};

export function WebMCP() {
  useEffect(() => {
    const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!mc) return;
    try {
      if (typeof mc.registerTool === "function") {
        for (const tool of TOOLS) mc.registerTool(tool);
      } else if (typeof mc.provideContext === "function") {
        mc.provideContext({ tools: TOOLS });
      }
    } catch {
      /* el navegador cambió la API: no es crítico para la página */
    }
  }, []);
  return null;
}
