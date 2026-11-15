import { pageMeta } from "@/lib/meta";
import { CarritoClient } from "./CarritoClient";

export const metadata = pageMeta({
  title: "Tu carrito | Chip Chop Pet Shop",
  description: "Revisa los productos de tu carrito en Chip Chop Pet Shop antes de pagar con Deuna.",
  path: "/carrito/",
  noindex: true,
});

export default function Carrito() {
  return (
    <div className="wrap">
      <h1>Tu carrito</h1>
      <CarritoClient />
    </div>
  );
}
