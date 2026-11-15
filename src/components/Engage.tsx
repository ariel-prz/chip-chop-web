"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, ChevronRight, House, LayoutGrid, MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/Cart";
import { waLink } from "@/lib/site";

// Cuenta regresiva: el HTML trae las fechas escritas (para bots y sin JavaScript);
// al cargar, el navegador muestra cuánto falta para que empiece y para que termine.
function parts(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

function Clock({ label, ms }: { label: string; ms: number }) {
  const { d, h, m, s } = parts(ms);
  return (
    <div className="countdown">
      <span className="countdown-label">{label}</span>
      <span className="countdown-units">
        <span><strong>{d}</strong> días</span>
        <span><strong>{h}</strong> horas</span>
        <span><strong>{m}</strong> min</span>
        <span><strong>{String(s).padStart(2, "0")}</strong> seg</span>
      </span>
    </div>
  );
}

export function Countdown({ from, to }: { from: string; to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  if (now >= end) return <p className="countdown-done">Black Friday terminó. Gracias por comprar en Chip Chop.</p>;
  return (
    <div className="countdowns" role="timer" aria-live="off">
      {now < start && <Clock label="Empieza en" ms={start - now} />}
      <Clock label={now < start ? "Termina en" : "Termina en (¡ya empezó!)"} ms={end - now} />
    </div>
  );
}

// Aviso en carrito y checkout cuando la promoción está activa en este momento.
export function PromoNotice({ from, to, text }: { from: string; to: string; text: string }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const n = Date.now();
    setActive(n >= new Date(from).getTime() && n <= new Date(to).getTime());
  }, [from, to]);
  return active ? <p className="promo-notice">{text}</p> : null;
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

// Botón para volver arriba: aparece cuando la persona ya bajó bastante.
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      className="to-top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector("h1")?.setAttribute("tabindex", "-1");
        (document.querySelector("h1") as HTMLElement | null)?.focus({ preventScroll: true });
      }}
    >
      <ArrowUp aria-hidden="true" />
      <span>Subir</span>
    </button>
  );
}
