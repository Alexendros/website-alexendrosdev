import type { PurchasableItem } from "./types";

// Catálogo de items comprables (one-time) vía Stripe Checkout. Los importes
// viven aquí, en el servidor: el route handler nunca confía en un precio
// enviado por el cliente — solo recibe el `id` y resuelve el resto aquí.
// Importes en céntimos de euro. Se corresponden con los `ADDONS` de servicios.
export const PURCHASABLES: PurchasableItem[] = [
  {
    id: "auditoria-tecnica",
    name: "Auditoría técnica",
    desc: "Revisión de arquitectura, infraestructura y CI/CD. Informe priorizado con plan de acción.",
    amount: 150_000,
    currency: "eur",
  },
  {
    id: "sesion-mentoria",
    name: "Sesión de mentoría (1 h)",
    desc: "Acompañamiento a equipo de ingeniería en decisiones de stack, GitOps o cloud-native.",
    amount: 18_000,
    currency: "eur",
  },
  {
    id: "sprint-performance",
    name: "Sprint de performance",
    desc: "1-2 semanas de análisis y optimización: TTFB, Core Web Vitals, costes de infra.",
    amount: 320_000,
    currency: "eur",
  },
];

const BY_ID = new Map(PURCHASABLES.map((p) => [p.id, p]));

/** Resuelve un item comprable por id, o `null` si no existe en el catálogo. */
export function getPurchasable(id: string): PurchasableItem | null {
  return BY_ID.get(id) ?? null;
}

/** Formatea un importe en céntimos como precio legible (p. ej. «1.500 €»). */
export function formatPrice(amount: number, currency = "eur"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}
