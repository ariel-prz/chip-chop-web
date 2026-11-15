"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatUSD } from "@/lib/format";
import { waLink } from "@/lib/site";
import { supabase } from "@/lib/supabase";

type Status = {
  code: string;
  status: "pendiente_pago" | "pago_validado" | "en_revision" | "listo" | "entregado" | "cancelado";
  amount_due: number;
  subtotal: number;
  delivery_method: "retiro" | "envio";
  has_receipt: boolean;
};

const LABEL: Record<Status["status"], string> = {
  pendiente_pago: "Esperando tu pago",
  en_revision: "Pago en revisión por la tienda",
  pago_validado: "Pago validado ✓",
  listo: "Pedido listo",
  entregado: "Pedido entregado",
  cancelado: "Pedido cancelado",
};

export function PedidoClient() {
  const [id, setId] = useState<string | null>(null);
  const [order, setOrder] = useState<Status | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [upload, setUpload] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [uploadMsg, setUploadMsg] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("id");
    if (!q || !/^[0-9a-f-]{36}$/i.test(q)) {
      setNotFound(true);
      return;
    }
    setId(q);
  }, []);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    const load = async () => {
      const { data } = await supabase().rpc("get_order_status", { p_id: id });
      if (!alive) return;
      if (!data) {
        setNotFound(true);
        return;
      }
      setOrder(data as Status);
      const s = (data as Status).status;
      if (s !== "pendiente_pago" && s !== "en_revision" && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
    load();
    timer.current = setInterval(load, 5000);
    return () => {
      alive = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, [id]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    if (file.size > 5 * 1024 * 1024) {
      setUpload("error");
      setUploadMsg("La imagen pesa más de 5 MB. Toma una captura de pantalla en lugar de una foto.");
      return;
    }
    setUpload("sending");
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${id}/comprobante-${Date.now()}.${ext}`;
    const sb = supabase();
    const { error } = await sb.storage.from("comprobantes").upload(path, file, { contentType: file.type || "image/jpeg" });
    if (error) {
      setUpload("error");
      setUploadMsg("No pudimos subir la imagen. Envíala por WhatsApp con el código de tu pedido.");
      return;
    }
    await sb.rpc("attach_receipt", { p_id: id, p_path: path });
    setUpload("done");
    setOrder((o) => (o ? { ...o, has_receipt: true } : o));
  }

  if (notFound) {
    return (
      <div className="note">
        <h1>No encontramos ese pedido</h1>
        <p>Revisa el enlace o escríbenos por WhatsApp con el código de tu pedido.</p>
        <Link className="btn btn-primary" href="/productos/">
          Ir a productos
        </Link>
      </div>
    );
  }
  if (!order) return <p aria-live="polite">Cargando tu pedido...</p>;

  const amount = Number(order.amount_due);
  const paid = order.status !== "pendiente_pago" && order.status !== "en_revision" && order.status !== "cancelado";
  const wa = waLink(
    `Hola Chip Chop, mi pedido es ${order.code} por ${formatUSD(amount)}. ${
      paid ? "Ya está pagado." : "Te envío mi comprobante."
    }`,
  );

  return (
    <>
      <h1>Pedido {order.code}</h1>
      <p>
        Estado:{" "}
        <strong className={`status ${order.status}`} aria-live="polite">
          {LABEL[order.status]}
        </strong>
      </p>

      {paid ? (
        <div className="ok-box">
          <h2 style={{ marginTop: 0 }}>¡Gracias! Recibimos tu pago.</h2>
          <p>
            {order.delivery_method === "retiro"
              ? "Te escribimos por WhatsApp cuando tu pedido esté listo para retirar en la tienda."
              : "Te escribimos por WhatsApp con el costo del envío para despachar tu pedido."}
          </p>
          <a className="btn btn-primary" href={wa} target="_blank" rel="noopener">
            Escribir a la tienda
          </a>
        </div>
      ) : order.status === "cancelado" ? (
        <div className="warn-box">Este pedido fue cancelado. Si crees que es un error, escríbenos por WhatsApp.</div>
      ) : (
        <div className="two-col">
          <div>
            <h2 style={{ marginTop: 0 }}>1. Paga este monto exacto con Deuna</h2>
            <p className="amount">{formatUSD(amount)}</p>
            <p className="hint">
              Total de productos {formatUSD(Number(order.subtotal))}. Los centavos de diferencia identifican tu pago:
              escribe el monto tal cual, con los centavos.
            </p>
            <ol>
              <li>Abre la app Deuna.</li>
              <li>Escanea el código QR.</li>
              <li>
                Escribe <strong>{formatUSD(amount)}</strong> y confirma el pago.
              </li>
            </ol>
            <h2>2. Sube la captura del pago</h2>
            {order.has_receipt || upload === "done" ? (
              <p className="ok-box">Captura recibida. Tu pago se valida en minutos; esta página se actualiza sola.</p>
            ) : (
              <div className="field">
                <label htmlFor="receipt">Captura del comprobante de Deuna</label>
                <input id="receipt" type="file" accept="image/*" onChange={onFile} disabled={upload === "sending"} />
                {upload === "sending" && <p aria-live="polite">Subiendo...</p>}
                {upload === "error" && (
                  <p className="error" role="alert">
                    {uploadMsg}
                  </p>
                )}
              </div>
            )}
            <p>
              ¿Algún problema?{" "}
              <a href={wa} target="_blank" rel="noopener">
                Escríbenos por WhatsApp con el código {order.code}
              </a>
              .
            </p>
          </div>
          <div className="card" style={{ alignItems: "center" }}>
            <img src="/img/qr-deuna.png" width="300" height="300" alt="Código QR de Deuna de Chip Chop Pet Shop para pagar el pedido" />
            <a className="btn btn-secondary" href="/img/qr-deuna.png" download="QR-Deuna-ChipChop.png">
              Descargar el QR
            </a>
            <p className="hint">Si compras desde el mismo celular, descarga el QR o escríbenos por WhatsApp.</p>
          </div>
        </div>
      )}
      <p className="hint">Guarda esta página: con este enlace puedes ver el estado de tu pedido.</p>
    </>
  );
}
