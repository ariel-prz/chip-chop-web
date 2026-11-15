"use client";

import Link from "next/link";
import { useCart } from "@/components/Cart";
import { formatUSD } from "@/data/products";

export function CarritoClient() {
  const { products, total, setQty } = useCart();

  if (products.length === 0) {
    return (
      <div className="note">
        <p>Tu carrito está vacío.</p>
        <Link className="btn btn-primary" href="/productos/">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.sku}>
              <td>
                <Link href={`/productos/${p.slug}/`}>{p.name}</Link>
                <br />
                <span className="hint">{formatUSD(p.price)} c/u</span>
              </td>
              <td>
                <div className="qty">
                  <button type="button" onClick={() => setQty(p.sku, p.qty - 1)} aria-label={`Quitar uno de ${p.name}`}>
                    −
                  </button>
                  <span aria-live="polite">{p.qty}</span>
                  <button type="button" onClick={() => setQty(p.sku, p.qty + 1)} aria-label={`Agregar uno de ${p.name}`}>
                    +
                  </button>
                </div>
              </td>
              <td>{formatUSD(p.price * p.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="amount" style={{ fontSize: "1.8rem", marginTop: "1rem" }}>
        Total de productos: {formatUSD(total)}
      </p>
      <p className="hint">El envío, si lo eliges, se cotiza aparte por WhatsApp.</p>
      <div className="btn-row">
        <Link className="btn btn-primary" href="/checkout/">
          Continuar con mis datos
        </Link>
        <Link className="btn btn-secondary" href="/productos/">
          Seguir comprando
        </Link>
      </div>
    </>
  );
}
