# CLAUDE.md — portfolio-alexendros (overlay)

> Extiende `~/.claude/CLAUDE.md` (canon L0). El CLAUDE.md RICO vive en la RAÍZ: `../CLAUDE.md` — consúltalo primero.

## Contexto
Portfolio fullstack Next.js 16 (App Router/Turbopack) · React 19 · TS estricto · Tailwind v4 · pnpm ≥10.
Backend: Route Handlers + zod + rate-limit en memoria + Prisma 7 (Postgres/Supabase) + Resend/React Email.

## Convención central (no obvia)
Degradación null-safe SIN credenciales: `prisma`/`resend` son `… | null`; todo acceso va guardado. Ver raíz §Arquitectura.

## Agents / Skills locales
Ninguno local (decisión: mínimo + herencia). El kit (code-reviewer, repo-developer, repo-launcher, ci-runner; skills dev-*/app-*) se hereda lanzando `claude` desde `~/Repositorios`.

## Plugins / MCP
settings.json: typescript-lsp, playwright, code-simplifier, vercel, supabase (requieren binarios en PATH; `vercel` pide `/mcp` auth). MCP deepwiki para docs.

## Notas
- ROADMAP.md = fuente de verdad; actualizar en cada PR.
- Antes de cerrar trabajo, replicar el orden CI: format:check → lint → typecheck → test → build → e2e.
- Pendiente: credenciales reales (DATABASE_URL Supabase, RESEND_API_KEY), migrar Prisma, deploy Vercel.
