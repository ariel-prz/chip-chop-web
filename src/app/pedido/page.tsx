import { pageMeta } from "@/lib/meta";
import { PedidoClient } from "./PedidoClient";

export const metadata = pageMeta({
  title: "Tu pedido | Chip Chop Pet Shop",
  description: "Paga tu pedido con Deuna, sube la captura del pago y sigue el estado de tu compra en Chip Chop Pet Shop.",
  path: "/pedido/",
  noindex: true,
});

export default function Pedido() {
  return (
    <div className="wrap">
      <PedidoClient />
    </div>
  );
}
