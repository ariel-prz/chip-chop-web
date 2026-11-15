"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/Cart";
import { formatUSD } from "@/lib/format";
import { ZONES } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export function CheckoutClient() {
  const { lines, total, products, clear } = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"retiro" | "envio">("retiro");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (products.length === 0) {
    return (
      <div className="note">
        <p>No hay productos en tu carrito.</p>
        <Link className="btn btn-primary" href="/productos/">
          Ver productos
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const phone = String(f.get("phone") ?? "").replace(/\D/g, "");
    if (!/^0?9\d{8}$/.test(phone) && !/^593\d{9}$/.test(phone)) {
      setError("Escribe un número de celular válido, por ejemplo 0991234567.");
      return;
    }
    const doc = String(f.get("doc") ?? "").trim();
    if (doc && !/^\d{10}(\d{3})?$/.test(doc)) {
      setError("La cédula debe tener 10 dígitos o el RUC 13. Si no necesitas factura, déjalo vacío.");
      return;
    }
    setSending(true);
    const { data, error: rpcError } = await supabase().rpc("create_order", {
      p_name: String(f.get("name") ?? ""),
      p_phone: phone,
      p_id_document: doc || null,
      p_delivery: delivery,
      p_address: delivery === "envio" ? String(f.get("address") ?? "") : null,
      p_zone: delivery === "envio" ? String(f.get("zone") ?? "") : null,
      p_notes: String(f.get("notes") ?? "") || null,
      p_items: lines.map((l) => ({ sku: l.sku, qty: l.qty })),
      p_consent: f.get("consent") === "on",
    });
    setSending(false);
    if (rpcError || !data) {
      setError(rpcError?.message ?? "No pudimos crear el pedido. Intenta de nuevo o escríbenos por WhatsApp.");
      return;
    }
    const order = data as { id: string; code: string };
    try {
      const prev = JSON.parse(localStorage.getItem("chipchop-pedidos") ?? "[]") as string[];
      localStorage.setItem("chipchop-pedidos", JSON.stringify([order.id, ...prev].slice(0, 10)));
    } catch {
      /* sin almacenamiento local */
    }
    clear();
    router.push(`/pedido/?id=${order.id}`);
  }

  return (
    <div className="two-col">
      <form onSubmit={onSubmit} noValidate={false}>
        <div className="field">
          <label htmlFor="name">Nombre y apellido</label>
          <input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="phone">Celular con WhatsApp</label>
          <input id="phone" name="phone" required inputMode="tel" autoComplete="tel" placeholder="0991234567" />
        </div>
        <div className="field">
          <label htmlFor="doc">Cédula o RUC (opcional, solo si necesitas factura)</label>
          <input id="doc" name="doc" inputMode="numeric" maxLength={13} />
        </div>
        <fieldset className="field" style={{ border: 0, padding: 0 }}>
          <legend style={{ fontWeight: 700, marginBottom: ".4rem" }}>¿Cómo recibes tu pedido?</legend>
          <label className="choice">
            <input type="radio" name="delivery" checked={delivery === "retiro"} onChange={() => setDelivery("retiro")} />
            Retiro en la tienda (sin costo)
          </label>
          <label className="choice">
            <input type="radio" name="delivery" checked={delivery === "envio"} onChange={() => setDelivery("envio")} />
            Envío a domicilio (costo según sector, se cotiza por WhatsApp)
          </label>
        </fieldset>
        {delivery === "envio" && (
          <>
            <div className="field">
              <label htmlFor="zone">Sector</label>
              <select id="zone" name="zone" required defaultValue="">
                <option value="" disabled>
                  Elige tu sector
                </option>
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="address">Dirección de entrega y referencia</label>
              <textarea id="address" name="address" required rows={3} autoComplete="street-address" />
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="notes">Nota para la tienda (opcional)</label>
          <textarea id="notes" name="notes" rows={2} maxLength={500} />
        </div>
        <label className="choice">
          <input type="checkbox" name="consent" required />
          <span>
            Acepto que Chip Chop use mis datos solo para gestionar este pedido, según la{" "}
            <Link href="/privacidad/" target="_blank">
              política de privacidad
            </Link>
            .
          </span>
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="btn-row">
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? "Generando pedido..." : "Generar pedido y ver cómo pagar"}
          </button>
        </div>
      </form>
      <aside className="card" aria-label="Resumen del pedido">
        <h2 style={{ marginTop: 0 }}>Resumen</h2>
        <ul>
          {products.map((p) => (
            <li key={p.sku}>
              {p.qty} × {p.name}: {formatUSD(p.price * p.qty)}
            </li>
          ))}
        </ul>
        <p className="price">Total productos: {formatUSD(total)}</p>
        <p className="hint">
          En el siguiente paso verás el monto exacto a pagar: tendrá unos centavos menos, para identificar tu pago.
        </p>
      </aside>
    </div>
  );
}
