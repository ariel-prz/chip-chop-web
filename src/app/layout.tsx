import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/Cart";
import { Footer, Header, WhatsAppFab } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { businessSchema, websiteSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

// Fuentes del manual de marca, servidas desde el propio sitio (sin pedir nada a Google).
const bitter = localFont({
  src: [
    { path: "../fonts/bitter-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/bitter-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-bitter",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const nunitoSans = localFont({
  src: [
    { path: "../fonts/nunito-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/nunito-sans-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-nunito-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  formatDetection: { telephone: true, address: true },
  // TODO: pegar los códigos de verificación al registrar el sitio.
  verification: {},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B688A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-EC" className={`${bitter.variable} ${nunitoSans.variable}`}>
      <body>
        <JsonLd data={[businessSchema(), websiteSchema()]} />
        <CartProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
