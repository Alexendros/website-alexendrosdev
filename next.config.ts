import type { NextConfig } from "next";

// Cabeceras de seguridad aplicadas a todas las rutas. Complementan el HSTS que ya
// inyecta Vercel. La CSP permite estilos inline (Next + Tailwind inyectan <style>
// inline y next/font sirve fuentes self-hosted); el script de tema (app/layout.tsx)
// se firma con su hash SHA-256 estático, de modo que `script-src` NO usa
// 'unsafe-inline'.
const THEME_SCRIPT_HASH = "'sha256-hbpvxDGDgjtAQDU8vySCO/VmzNl3coK8Bui/PvwIRzw='";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' NO: el script de tema va por hash, Stripe.js por origen.
      `script-src 'self' https://js.stripe.com ${THEME_SCRIPT_HASH}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // API de contacto/checkout propia + Stripe.
      "connect-src 'self' https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
