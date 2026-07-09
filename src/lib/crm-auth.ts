import "server-only";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const CRM_API_KEY = process.env.CRM_API_KEY;

/**
 * Middleware de autenticación para la API CRM.
 *
 * Valida el header `X-API-Key` contra la variable de entorno `CRM_API_KEY`.
 * Rate-limit: 60 req/min por API key.
 *
 * @returns `NextResponse` con error si la autenticación falla, `undefined` si OK.
 */
export function requireCrmAuth(req: Request): NextResponse | undefined {
  // Sin CRM_API_KEY configurada: la API CRM no está disponible
  if (!CRM_API_KEY) {
    return NextResponse.json({ error: "CRM no disponible." }, { status: 503 });
  }

  const apiKey = req.headers.get("x-api-key");

  // Sin API key: no autorizado
  if (!apiKey) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // API key inválida
  if (apiKey !== CRM_API_KEY) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // Rate-limit por API key: 60 req/min
  if (!rateLimit(`crm:${apiKey}`, 60, 60_000)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      },
    );
  }

  // Auth OK
  return undefined;
}
