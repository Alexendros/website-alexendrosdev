import "server-only";

// Rate limiter en memoria (ventana deslizante por clave/IP). Suficiente para una
// instancia única (VPS). En despliegues multi-instancia es best-effort; migrar a
// Upstash/Redis si se requiere límite global estricto.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** Extrae una IP de cabeceras de proxy habituales. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "anon";
}
