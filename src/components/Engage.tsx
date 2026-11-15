"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, House, LayoutGrid, MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/Cart";
import { waLink } from "@/lib/site";

// Cuenta regresiva: el HTML trae la fecha escrita (para bots y sin JavaScript);
// al cargar, el navegador agrega los días que faltan.
export function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState<{ d: number; h: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const ms = new Date(to).getTime() - Date.now();
      setLeft(ms > 0 ? { d: Math.floor(ms / 864e5), h: Math.floor((ms % 864e5) / 36e5) } : { d: 0, h: 0 });
    };
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, [to]);
  if (!left) return null;
  if (left.d === 0 && left.h === 0) return <p className="countdown">¡Ya empezó!</p>;
  return (
    <p className="countdown" aria-live="polite">
      <span>
        <strong>{left.d}</strong> días
      </span>
      <span>
        <strong>{left.h}</strong> horas
      </span>
    </p>
  );
}

// Flechas del carrusel: en el teléfono se desliza con el dedo; en computadora, con estos botones.
export function CarouselNav({ targetId }: { targetId: string }) {
  const move = (dir: 1 | -1) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div className="carousel-nav">
      <button type="button" onClick={() => move(-1)} aria-label="Ver productos anteriores">
        <ChevronLeft aria-hidden="true" />
      </button>
      <button type="button" onClick={() => move(1)} aria-label="Ver más productos">
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}

// Barra inferior en el teléfono: las cuatro acciones que más se usan, siempre a mano.
export function MobileTabBar() {
  const { count } = useCart();
  const [path, setPath] = useState("/");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => setPath(window.location.pathname), []);
  const is = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  return (
    <nav className="tabbar" aria-label="Accesos rápidos" ref={ref}>
      <Link href="/" aria-current={is("/") ? "page" : undefined}>
        <House aria-hidden="true" />
        <span>Inicio</span>
      </Link>
      <Link href="/productos/" aria-current={is("/productos/") ? "page" : undefined}>
        <LayoutGrid aria-hidden="true" />
        <span>Productos</span>
      </Link>
      <Link href="/carrito/" aria-current={is("/carrito/") ? "page" : undefined}>
        <span className="tab-icon">
          <ShoppingCart aria-hidden="true" />
          {count > 0 && <span className="tab-badge">{count}</span>}
        </span>
        <span>Carrito</span>
      </Link>
      <a href={waLink("Hola Chip Chop, quiero hacer un pedido")} target="_blank" rel="noopener">
        <MessageCircle aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
