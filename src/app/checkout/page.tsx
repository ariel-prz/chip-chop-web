import { pageMeta } from "@/lib/meta";
import { CheckoutClient } from "./CheckoutClient";

export const metadata = pageMeta({
  title: "Datos de tu pedido | Chip Chop Pet Shop",
  description: "Completa tus datos para generar tu pedido y el monto exacto a pagar con Deuna en Chip Chop Pet Shop.",
  path: "/checkout/",
  noindex: true,
});

export default function Checkout() {
  return (
    <div className="wrap">
      <h1>Datos de tu pedido</h1>
      <p>Con estos datos generamos tu pedido y el monto exacto que debes pagar con Deuna.</p>
      <CheckoutClient />
    </div>
  );
}
