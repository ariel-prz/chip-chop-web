"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/data/products";

export type CartLine = { sku: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  products: (Product & { qty: number })[];
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "chipchop-carrito-v1";

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return parsed.filter((l) => PRODUCTS.some((p) => p.sku === l.sku) && l.qty > 0);
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
    const products = lines
      .map((l) => {
        const p = PRODUCTS.find((x) => x.sku === l.sku);
        return p ? { ...p, qty: l.qty } : null;
      })
      .filter(Boolean) as (Product & { qty: number })[];
    return {
      lines,
      products,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: Math.round(products.reduce((s, p) => s + p.price * p.qty, 0) * 100) / 100,
      add: (sku, qty = 1) => {
        const found = lines.find((l) => l.sku === sku);
        persist(
          found
            ? lines.map((l) => (l.sku === sku ? { ...l, qty: Math.min(50, l.qty + qty) } : l))
            : [...lines, { sku, qty }],
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

export function AddToCart({ sku, name }: { sku: string; name: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        add(sku);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
      aria-label={`Agregar al carrito: ${name}`}
    >
      {done ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}
