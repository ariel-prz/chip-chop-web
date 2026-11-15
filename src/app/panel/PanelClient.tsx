"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { formatUSD } from "@/data/products";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  code: string;
  created_at: string;
  customer_name: string;
  phone: string;
  id_document: string | null;
  delivery_method: "retiro" | "envio";
  address: string | null;
  zone: string | null;
  notes: string | null;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  amount_due: number;
  status: string;
  receipt_path: string | null;
  validated_by: string | null;
};

type Payment = {
  id: string;
  received_at: string;
  amount: number;
  payer_name: string | null;
  account_last4: string | null;
  matched_order_id: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pendiente_pago: "Esperando pago",
  en_revision: "En revisión",
  pago_validado: "Pagado: preparar",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const NEXT: Record<string, { to: string; label: string }[]> = {
  pendiente_pago: [
    { to: "pago_validado", label: "Validar pago a mano" },
    { to: "cancelado", label: "Cancelar" },
  ],
  en_revision: [
    { to: "pago_validado", label: "Validar pago a mano" },
    { to: "cancelado", label: "Cancelar" },
  ],
  pago_validado: [{ to: "listo", label: "Marcar listo" }],
  listo: [{ to: "entregado", label: "Marcar entregado" }],
};

const time = (s: string) =>
  new Date(s).toLocaleString("es-EC", { timeZone: "America/Guayaquil", dateStyle: "short", timeStyle: "short" });

function waTo(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "593");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function PanelClient() {
  const sb = supabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [msg, setMsg] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const load = useCallback(async () => {
    const since = new Date(Date.now() - 7 * 864e5).toISOString();
    const [o, p] = await Promise.all([
      sb.from("orders").select("*").gte("created_at", since).order("created_at", { ascending: false }),
      sb.from("payments").select("*").gte("received_at", since).order("received_at", { ascending: false }),
    ]);
    if (o.error) setMsg("Tu usuario todavía no tiene acceso. Pide que lo agreguen como personal.");
    const list = (o.data as Order[]) ?? [];
    setOrders(list);
    setPayments((p.data as Payment[]) ?? []);
    const toPrepare = list.filter((x) => x.status === "pago_validado").length;
    document.title = toPrepare ? `(${toPrepare}) por preparar | Panel` : "Panel de pedidos";
  }, [sb]);

  useEffect(() => {
    if (!session) return;
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [session, load]);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await sb.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    if (error) setMsg("Correo o contraseña incorrectos.");
  }

  async function setStatus(o: Order, to: string) {
    if (to === "cancelado" && !window.confirm(`¿Cancelar el pedido ${o.code}?`)) return;
    const patch: Record<string, unknown> = { status: to };
    if (to === "pago_validado") {
      patch.paid_at = new Date().toISOString();
      patch.validated_by = session?.user.email ?? "manual";
    }
    const { error } = await sb.from("orders").update(patch).eq("id", o.id);
    setMsg(error ? `Error: ${error.message}` : `Pedido ${o.code} actualizado.`);
    load();
  }

  async function viewReceipt(path: string) {
    const { data } = await sb.storage.from("comprobantes").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  if (!ready) return <p>Cargando...</p>;

  if (!session) {
    return (
      <form onSubmit={login} style={{ maxWidth: 420 }}>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" required autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {msg && <p className="error">{msg}</p>}
        <button className="btn btn-primary" type="submit">
          Entrar
        </button>
      </form>
    );
  }

  const shown = orders.filter((o) => showAll || !["entregado", "cancelado"].includes(o.status));
  const unmatched = payments.filter((p) => !p.matched_order_id);

  return (
    <>
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Ver solo activos" : "Ver todos (7 días)"}
        </button>
        <button className="btn btn-secondary" onClick={load}>
          Actualizar
        </button>
        <button className="btn btn-secondary" onClick={() => sb.auth.signOut()}>
          Salir
        </button>
      </div>
      {msg && <p aria-live="polite">{msg}</p>}

      <h2>Pedidos ({shown.length})</h2>
      {shown.length === 0 && <p>No hay pedidos activos.</p>}
      {shown.map((o) => (
        <article key={o.id} className="admin-order">
          <p>
            <strong>{o.code}</strong> · {time(o.created_at)} ·{" "}
            <span className={`status ${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
            {o.validated_by && <span className="hint"> · validado por: {o.validated_by}</span>}
          </p>
          <p>
            <strong>Monto Deuna: {formatUSD(Number(o.amount_due))}</strong> (productos {formatUSD(Number(o.subtotal))})
          </p>
          <p>
            {o.customer_name} ·{" "}
            <a
              href={waTo(o.phone, `Hola ${o.customer_name}, te escribimos de Chip Chop Pet Shop sobre tu pedido ${o.code}.`)}
              target="_blank"
              rel="noopener"
            >
              {o.phone} (WhatsApp)
            </a>
            {o.id_document && <> · Factura a: {o.id_document}</>}
          </p>
          <p>
            {o.delivery_method === "retiro" ? "Retiro en tienda" : `Envío a ${o.zone}: ${o.address}`}
            {o.notes && <> · Nota: {o.notes}</>}
          </p>
          <ul>
            {o.items.map((i, k) => (
              <li key={k}>
                {i.qty} × {i.name} ({formatUSD(Number(i.price))})
              </li>
            ))}
          </ul>
          <div className="btn-row">
            {o.receipt_path && (
              <button className="btn btn-secondary" onClick={() => viewReceipt(o.receipt_path!)}>
                Ver captura
              </button>
            )}
            {(NEXT[o.status] ?? []).map((n) => (
              <button key={n.to} className="btn btn-primary" onClick={() => setStatus(o, n.to)}>
                {n.label}
              </button>
            ))}
          </div>
        </article>
      ))}

      <h2>Pagos Deuna sin pedido ({unmatched.length})</h2>
      <p className="hint">
        Pagos cuyo monto no coincidió con ningún pedido pendiente. Compáralos con las capturas y valida a mano el
        pedido correcto.
      </p>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Monto</th>
            <th>De</th>
          </tr>
        </thead>
        <tbody>
          {unmatched.map((p) => (
            <tr key={p.id}>
              <td>{time(p.received_at)}</td>
              <td>{formatUSD(Number(p.amount))}</td>
              <td>
                {p.payer_name ?? "Sin nombre"} {p.account_last4 && `(cta. ...${p.account_last4})`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
