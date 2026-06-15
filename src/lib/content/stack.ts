import type { StackCategory, StackDetail } from "./types";

export const STACK_CATS: StackCategory[] = [
  { name: "Lenguajes", color: "var(--primary-400)", leaves: ["Rust", "Python", "TypeScript", "Bash"] },
  { name: "Web", color: "var(--success)", leaves: ["Next.js", "React", "Tailwind", "Node.js"] },
  { name: "Infra & Datos", color: "var(--warning)", leaves: ["Docker", "PostgreSQL", "Vercel", "OpenTelemetry"] },
  { name: "Tooling & IA", color: "var(--primary-600)", leaves: ["MCP", "Claude Code", "GitHub Actions", "JSON Schema"] },
];

// `level` y `years` son estimaciones (TODO: ajustar a tu experiencia real).
// `projects` referencia los proyectos públicos reales de `projects.ts`.
export const STACK_DETAIL: Record<string, StackDetail> = {
  Rust: { level: 0.82, years: "TODO", projects: ["TrenchPass"], note: "Lenguaje elegido para TrenchPass cuando hace falta máximo rendimiento y fiabilidad: un servicio rápido y sin sorpresas en producción." },
  Python: { level: 0.9, years: "TODO", projects: ["plantillas", "XEK", "GV.ERRA"], note: "El caballo de batalla para tooling, validadores y automatización: el ecosistema de plantillas, los validadores `--strict` y la validación JSON Schema de GV.ERRA." },
  TypeScript: { level: 0.88, years: "TODO", projects: ["alexendros.me", "portfolio"], note: "Por defecto en todo el frontend. Tipos estrictos como documentación ejecutable en los sitios Next.js." },
  Bash: { level: 0.85, years: "TODO", projects: ["XEK"], note: "Lenguaje principal de las 40+ skills de verificación de XEK: composable, portable y auditable en cualquier host Linux." },
  "Next.js": { level: 0.86, years: "TODO", projects: ["alexendros.me", "portfolio"], note: "App Router en producción: `alexendros.me` (export estático) y este portfolio (RSC + backend propio)." },
  React: { level: 0.85, years: "TODO", projects: ["alexendros.me", "portfolio"], note: "Server Components por defecto, islas cliente solo donde aportan interacción real." },
  Tailwind: { level: 0.82, years: "TODO", projects: ["alexendros.me", "portfolio"], note: "Tailwind v4 (CSS-first) sobre tokens de diseño propios — oklch dark-first en `.me`, Arctic Ocean aquí." },
  "Node.js": { level: 0.8, years: "TODO", projects: ["portfolio"], note: "Runtime de los Route Handlers y el tooling de build. Migro a Rust/Go cuando el caso lo pide." },
  Docker: { level: 0.85, years: "TODO", projects: ["TrenchPass"], note: "Empaquetado consistente de servicios para que se desplieguen igual en cualquier entorno." },
  PostgreSQL: { level: 0.82, years: "TODO", projects: ["TrenchPass", "portfolio"], note: "Base de datos por defecto: fiable, estándar y sin lock-in. Respaldo de la persistencia de este portfolio y del registro de TrenchPass." },
  Vercel: { level: 0.85, years: "TODO", projects: ["alexendros.me", "portfolio"], note: "Despliegue y red global para que los sitios carguen rápido en cualquier parte, con vistas previas en cada cambio." },
  OpenTelemetry: { level: 0.78, years: "TODO", projects: ["TrenchPass"], note: "Instrumentación vendor-neutral exportada a SigNoz: trazas y métricas del gateway de extremo a extremo." },
  MCP: { level: 0.85, years: "TODO", projects: ["TrenchPass", "plantillas"], note: "Model Context Protocol como interfaz: TrenchPass expone secretos como tools MCP; las plantillas generan servidores MCP listos para usar." },
  "Claude Code": { level: 0.88, years: "TODO", projects: ["plantillas"], note: "Plantillas `claude-init`-ready para agentes, skills, comandos, hooks y plugins, con validación automática y CI." },
  "GitHub Actions": { level: 0.84, years: "TODO", projects: ["plantillas", "XEK", "portfolio"], note: "CI en todos los repos: format → lint → typecheck → test → build, validadores `--strict` y pre-commit hooks." },
  "JSON Schema": { level: 0.82, years: "TODO", projects: ["GV.ERRA"], note: "draft-07 como contrato de datos: cada entrada de GV.ERRA se valida automáticamente antes de publicarse." },
  Lenguajes: { level: 0.86, years: "TODO", projects: ["TrenchPass", "XEK", "plantillas"], note: "Rust para sistemas, Python para tooling, TypeScript para web y Bash para verificación: cada herramienta para su trabajo." },
  Web: { level: 0.85, years: "TODO", projects: ["alexendros.me", "portfolio"], note: "Next.js + React + Tailwind sobre tokens propios; rendimiento y accesibilidad antes que efectos." },
  "Infra & Datos": { level: 0.8, years: "TODO", projects: ["TrenchPass", "portfolio"], note: "Bases de datos, despliegue y monitorización para que lo que construyo sea fiable, rápido y fácil de mantener." },
  "Tooling & IA": { level: 0.86, years: "TODO", projects: ["plantillas", "TrenchPass"], note: "MCP y Claude Code como base para construir agentes y herramientas reproducibles que aceleran el desarrollo." },
};
