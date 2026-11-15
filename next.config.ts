import type { NextConfig } from "next";

// Exportación estática: `next build` genera HTML puro en /out,
// listo para subir a cualquier plan de hosting web de Hostinger.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // CSS dentro del HTML: sin solicitud que bloquee el renderizado (la hoja pesa ~3 KB).
  experimental: { inlineCss: true },
};

export default nextConfig;
