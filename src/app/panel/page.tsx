import { pageMeta } from "@/lib/meta";
import { PanelClient } from "./PanelClient";

export const metadata = pageMeta({
  title: "Panel de pedidos | Chip Chop Pet Shop",
  description: "Panel interno del personal de Chip Chop Pet Shop.",
  path: "/panel/",
  noindex: true,
});

export default function Panel() {
  return (
    <div className="wrap">
      <h1>Panel de pedidos</h1>
      <PanelClient />
    </div>
  );
}
