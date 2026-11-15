"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
// El carrito guarda solo lo que muestra (nombre, precio, enlace). No importa el catálogo
// completo, para no cargarlo en cada página. El precio real lo calcula el servidor al crear
// el pedido, así que un precio viejo en el navegador nunca se cobra.
export type CartItem = { sku: string; name: string; price: number; slug: string };
export type CartLine = CartItem & { qty: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (item: CartItem, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  products: CartLine[];
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "chipchop-carrito-v2";

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return parsed.filter(
      (l) => typeof l.sku === "string" && typeof l.price === "number" && typeof l.name === "string" && l.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(readStorage());
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* almacenamiento no disponible: el carrito vive solo en memoria */
    }
  }, []);

  const value = useMemo<CartCtx>(() => {
    return {
      lines,
      products: lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: Math.round(lines.reduce((s, p) => s + p.price * p.qty, 0) * 100) / 100,
      add: (item, qty = 1) => {
        const found = lines.find((l) => l.sku === item.sku);
        persist(
          found
            ? lines.map((l) => (l.sku === item.sku ? { ...l, ...item, qty: Math.min(50, l.qty + qty) } : l))
            : [...lines, { ...item, qty }],
        );
      },
      setQty: (sku, qty) =>
        persist(
          qty <= 0
            ? lines.filter((l) => l.sku !== sku)
            : lines.map((l) => (l.sku === sku ? { ...l, qty: Math.min(50, qty) } : l)),
        ),
      clear: () => persist([]),
    };
  }, [lines, persist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}

export function CartBadge() {
  const { count } = useCart();
  return (
    <Link href="/carrito/" className="cart-link" aria-label={`Carrito, ${count} productos`}>
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
      </svg>
      <span>Carrito</span>
      {count > 0 && <span className="badge">{count}</span>}
    </Link>
  );
}

export function AddToCart({ sku, name, price, slug }: CartItem) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        add({ sku, name, price, slug });
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
      aria-label={`Agregar al carrito: ${name}`}
    >
      {done ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}
