import type { NextConfig } from "next";

// Exportación estática: `next build` genera HTML puro en /out,
// listo para subir a cualquier plan de hosting web de Hostinger.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
