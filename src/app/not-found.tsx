import Link from "next/link";

export const metadata = {
  title: "Página no encontrada | Chip Chop Pet Shop",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: "2rem 0" }}>
      <h1>No encontramos esta página</h1>
      <p>Puede que el enlace haya cambiado. Estas páginas te pueden servir:</p>
      <ul>
        <li><Link href="/productos/">Catálogo de productos con precios</Link></li>
        <li><Link href="/como-comprar/">Cómo comprar y pagar con Deuna</Link></li>
        <li><Link href="/">Página de inicio de Chip Chop Pet Shop</Link></li>
      </ul>
    </div>
  );
}
