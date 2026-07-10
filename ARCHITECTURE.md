# ARCHITECTURE — website-alexendrosdev

> Mapeado vivo de la aplicación. Se amplía conforme se crean rutas y módulos.
> Diseño origen: **Arctic Ocean** (Next.js + Tailwind v4 + shadcn/ui). Bundle prototipo: `~/Repositorios/portfolioalejandrovargas.zip`.

## Stack

| Capa             | Tecnología                                                                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack), React 19, TypeScript estricto                                                                                                                                                     |
| Estilos          | Tailwind CSS v4 (`@theme`) + `src/styles/site.css` (portado, clases `ak-*`) + tokens `design-tokens.css`                                                                                                              |
| Fuentes / iconos | `next/font` (Inter, JetBrains Mono) · `lucide-react`                                                                                                                                                                  |
| Contenido        | Módulos TS tipados (`src/lib/content/`) + blog en MDX (`content/blog/`)                                                                                                                                               |
| Backend          | Route Handlers + zod + Resend + React Email + Prisma 7 / Postgres (Supabase self-hosted en Coolify)                                                                                                                   |
| Pagos            | Stripe Checkout **live activo** (`sk_live_...`, webhook `we_1TrUSpK8xOmiNNUKB8yz7tob`) + catálogo unificado con price IDs dual-mode (`test`/`live`) + canal transferencia + Payment Link fallback (F7 + F17 + F17.5b) |
| CRM              | API REST (`/api/crm/`) con 9 stages de pipeline, auth `X-API-Key` (F14 hecho)                                                                                                                                         |
| Agentes IA       | Módulos TS integrados en `src/lib/agents/` — 3 agentes (Auditor/Diagnosticador/Reparador) con provider LLM híbrido Gemini 3.5 Flash (primario) + OpenCode Zen free (fallback) (F15 pendiente)                         |
| Calidad          | ESLint, Prettier, tsc, Vitest, Playwright, axe, Lighthouse/CWV                                                                                                                                                        |
| Gestor           | pnpm ≥10                                                                                                                                                                                                              |

## Árbol de rutas (App Router)

```
/                       app/page.tsx              (RSC + islas)   Home
/sobre-mi               app/sobre-mi/page.tsx      (RSC)           Sobre mí
/proximamente           app/proximamente/page.tsx  (RSC)           Landing (opt-in COMING_SOON=1)
/proyectos              app/proyectos/page.tsx     (RSC + isla)    Lista + filtros
/proyectos/[slug]       app/proyectos/[slug]/      (RSC · SSG)     Caso de estudio
/stack                  app/stack/page.tsx         (RSC + isla)    Grafo radial
/blog                   app/blog/page.tsx          (RSC)           Lista de posts
/blog/[slug]            app/blog/[slug]/           (RSC · SSG·MDX) Post
/servicios              app/servicios/page.tsx     (RSC + isla)    Tiers + FAQ
/escaparate             app/escaparate/page.tsx    (RSC + isla)    Proyectos featured + comprables
/contacto               app/contacto/page.tsx      (RSC + isla)    Form multi-step
/checkout/success       app/checkout/success/      (RSC)           Confirmación post-pago
/api/contact            app/api/contact/route.ts   (Route Handler) POST lead
/api/newsletter         app/api/newsletter/route.ts(Route Handler) POST suscripción
/api/newsletter/confirm app/api/newsletter/confirm/(Route Handler) GET confirmación (double opt-in)
/api/checkout           app/api/checkout/route.ts  (Route Handler) POST sesión Stripe / transferencia
/api/stripe/webhook     app/api/stripe/webhook/route.ts (Route Handler) POST eventos Stripe
/api/crm/*              app/api/crm/** (pendiente) (11 Route Handlers) REST CRM (auth X-API-Key)
/api/health           app/api/health/route.ts    (Route Handler) Health check (F17)
/api/agents/*         app/api/agents/** (F15)    (5 Route Handlers) health, hooks, audit, diagnose, repair
/sitemap.xml /robots.txt /feed.xml                 SEO
```

## Árbol de directorios (objetivo)

```
src/
  app/                  rutas (arriba) + layout.tsx + globals.css
  components/
    ui/                 Button, Icon, Eyebrow, SectionHead, Input
    sections/           Header, Footer, Terminal, Marquee, Hero, Zigzag,
                        Testimonials, ServicesList, StackGraph, ContactForm, ...
    providers/          ThemeProvider (no-flash)
  lib/
    content/            catalog.ts (fuente de verdad precios, 9 items con `stripePriceId`),
                        projects.ts, posts.ts, services.ts, timeline.ts, stack.ts,
                        testimonials.ts, faq.ts, checkout.ts (deprecado → reexporta catálogo),
                        types.ts
    crm/                invoice-number.ts, pipeline.ts, crm-auth.ts
    agents/         F15: auditor, diagnosticador, reparador, llm, crm-client, prompts, schemas
    db/                 cliente Prisma
    stripe.ts           cliente Stripe + `isLiveMode` (deriva del prefijo `sk_live_`)
    validation/         esquemas zod (contact, newsletter, checkout)
    hooks/              useReveal, useTheme
    utils/              helpers
  styles/               design-tokens.css, site.css (portados)
emails/                 plantillas React Email
content/blog/           *.mdx
prisma/                 schema.prisma
tests/                  unit + integration + component (Vitest) + e2e (Playwright); helpers/, fixtures/
public/                 assets estáticos
.github/workflows/      ci.yml
.claude/                scaffolding MCEOD L2
```

## Testing

Pirámide en cuatro capas con gate de cobertura (detalle y patrones en `tests/README.md`):

- **Unit** (`tests/unit/`, Vitest/node): lógica pura/stateful — validación zod, rate-limit, JSON-LD, blog, contenido, init null-safe de clientes.
- **Integración** (`tests/integration/`, Vitest/node): los 4 Route Handlers invocando el `POST` exportado con un `Request` y mockeando `prisma`/`resend`/`stripe` (`vi.mock` + getters hoisted). Cubre 200/400/422/429/503/502, honeypot, rate-limit y la degradación null-safe.
- **Componentes** (`tests/component/`, Vitest/jsdom + RTL): islas cliente, con MSW para la red. Regla RSC: los Server Components **asíncronos** no se testean aquí, van a e2e.
- **E2E** (`tests/e2e/`, Playwright + axe): flujos sobre el build de producción y accesibilidad multi-ruta.

Vitest usa dos `projects` (node + jsdom) y aliasa `server-only`→módulo vacío para poder importar la lógica servidor. Cobertura v8 sobre `src/lib/**` + `src/app/api/**` con umbrales que bloquean el merge (`pnpm test:coverage`, también en CI).

## Frontera cliente/servidor

- **Server Components** (por defecto): páginas, layout, lectura de contenido tipado y MDX, SEO.
- **Client Components** (`"use client"`): `Terminal`, `StackGraph`, `ContactForm`, `Testimonials` (carrusel), `ThemeToggle`, `Marquee`, nav móvil del `Header`, filtros de `/proyectos`.

## Tema (no-flash)

`localStorage` del prototipo → **cookie `ao-theme`** leída en `app/layout.tsx` (SSR) + script bloqueante mínimo que aplica `.dark` en `<html>` antes de la hidratación. Toggle cliente persiste cookie + actualiza `<html>`.

Tokens: light **Arctic Frost** (steel) / dark **Ocean Depths** (teal). Acento configurable (artefacto Tweaks descartado en prod).

## Checkout + canales de cobro

```
POST /api/checkout { itemId, mode?, paymentMethod? }
│
├─ paymentMethod = "stripe" (default)
│   ├─ stripe.checkout.sessions.create → 200 { url }
│   │   ├─ error → stripe.paymentLinks.create → 200 { url, fallback: true }
│   │   └─ ambos fallan → 502 { error, fallbackAttempted: true }
│   └─ !stripe → 503 → ¿TRANSFER_IBAN configurado? → sí → datos transferencia
│                                                   → no → { error }
│
├─ paymentMethod = "transfer"
│   ├─ email/name → 422
│   ├─ prisma → Invoice proforma (status: pending_transfer, INV-YYYY-NNN)
│   │   └─ 200 { iban, beneficiary, reference, amount, concept, invoiceId }
│   ├─ !prisma → 503
│   └─ !TRANSFER_IBAN → 503
│
├─ Zod parse → 422
├─ Rate-limit 5/min → 429
├─ item one_time + mode subscription → fuerza payment + warn (no 422)
└─ item recurring → mode subscription por defecto
```

Webhook (`POST /api/stripe/webhook`, ampliado en F14):

- `checkout.session.completed` → upsert Order. Si `dealId` en metadata → avance a "Cerrado ganado".
- `invoice.paid` → upsert Invoice CRM.
- `customer.subscription.updated` → upsert Subscription.
- `customer.subscription.deleted` → cancela Subscription + crea Task HIGH.

## Flujo de datos de formularios

```
ContactForm (cliente, multi-step)
   └─ fetch POST /api/contact
        └─ zod parse  ──(inválido)──► 422 + errores de campo
        └─ rate-limit + honeypot ──(abuso)──► 429
        └─ Prisma: crea Lead
        └─ Resend: email de notificación (React Email)
        └─ 200 { ok: true }
NewsletterForm (Footer/CTA) ─► POST /api/newsletter ─► zod ─► Subscriber ─► email bienvenida
```

## Modelo de datos (Prisma)

```
Lead          { id, name, email, type?, message, source, createdAt, utm* }
Subscriber    { id, email (unique), confirmed, token?, tokenExpiresAt?, confirmedAt?, createdAt }
Order         { id, stripeSessionId (unique), item, amount, currency, email?, status, createdAt }

─ CRM (registrado en schema.prisma, migración 20260616120000_add_crm_schema en DB) ─
Contact       { id, type, status, firstName, lastName?, email?, phone?, company?, position?, website?, notes? }
Product       { id, name, description?, unitPrice, currency, active }
PipelineStage { id, name, description?, order (unique), color? }
Deal          { id, title, value, currency, probability, closedAt?, notes?, contactId→Contact, stageId?→PipelineStage }
DealItem      { id, quantity, unitPrice, totalPrice, dealId→Deal, productId?→Product }
Activity      { id, type (EMAIL|CALL|MEETING|NOTE|TASK|OTHER), title, description?, occurredAt, contactId?, dealId? }
Task          { id, title, description?, priority (LOW|MEDIUM|HIGH|URGENT), doneAt?, dueAt?, contactId?, dealId? }
Invoice       { id, number (unique), status, issuedAt, dueAt?, paidAt?, subtotal, taxRate, taxAmount, total, currency, notes?, contactId?, dealId? }
InvoiceItem   { id, description, quantity, unitPrice, totalPrice, invoiceId→Invoice, productId?→Product }

─ Pendientes (F14, 3 migraciones) ─
Subscription  { id, stripeSubscriptionId (unique), customerId?, itemId, status, currentPeriodEnd?, cancelledAt?, createdAt, updatedAt }
stripeInvoiceId en Invoice: columna String? @unique para idempotencia de webhook invoice.paid
PipelineStage seed: 9 stages con orden 0-9 y colores hex
```

## Mapa prototipo → producción

| Prototipo (zip)                  | Destino                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| `colors_and_type.css`            | `src/styles/design-tokens.css`                              |
| `site.css`                       | `src/styles/site.css`                                       |
| `lib/core.jsx`                   | `components/sections/*` + `components/ui/*` + `lib/hooks/*` |
| `lib/data.jsx`                   | `src/lib/content/*.ts`                                      |
| `lib/home.jsx`, `about.jsx`, ... | páginas `app/**` correspondientes                           |
| `lib/tweaks-panel.jsx`           | descartado (dev-only opcional)                              |
| `*.html`                         | rutas App Router                                            |

## Agentes IA (F15, pendiente)

Servicio Python/FastAPI en repo externo `agentes-ia-catalog/`, puerto `localhost:8400`:

| Agente         | Endpoint                                  | Función                                                                           |
| -------------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| Auditor        | `POST /hooks/stripe`, `POST /audit/deals` | Clasifica eventos Stripe, detecta anomalías, audita deals estancados              |
| Diagnosticador | `POST /diagnose`                          | Formula hipótesis de fallo con confianza (DB caída, Stripe down, rate-limit, red) |
| Reparador      | `POST /repair`                            | Reintenta persistencia vía CRM API, regenera Payment Link, notifica operador      |
| Health         | `GET /health`                             | `{ status, agents, ollama, cloud_api }`                                           |

Modelos: Ollama local `ornith:9b` (clasificación) + Anthropic API (razonamiento diagnóstico).
Degradación: sin Ollama → cloud para todo. Sin cloud → solo logs. Gestor: `uv`.

## Stripe live (F17, hecho)

`alexendros.dev` acepta pagos reales desde 2026-07-10. Configuración:

- **Catálogo** (`src/lib/content/catalog.ts`): 9 items, cada uno con
  `stripePriceIds: { test, live }` apuntando a sus precios en cada Dashboard.
  Los importes en céntimos siguen siendo server-trusted. El helper
  `getCatalogPriceId(item, mode)` resuelve el ID del modo activo o `null`.
- **Cliente** (`src/lib/stripe.ts`): exporta `stripe` (null-safe) y `isLiveMode`
  (booleano derivado del prefijo de la clave activa).
- **Checkout** (`src/app/api/checkout/route.ts`): resuelve el `priceId` con
  `getCatalogPriceId(item, isLiveMode ? "live" : "test")`; lo usa si existe;
  si no, degrada a `price_data` inline con los importes del catálogo. Esto
  se aplica tanto a `checkout.sessions.create` como al fallback de
  `paymentLinks.create` (F13).
- **Webhook** (`src/app/api/stripe/webhook/route.ts`): sin cambios respecto a
  F14. Verifica firma y procesa 4 eventos (`checkout.session.completed`,
  `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`).
- **Env vars Vercel Production**:
  - `STRIPE_SECRET_KEY` = `sk_live_...` (Standard key)
  - `STRIPE_WEBHOOK_SECRET` = `whsec_...` del webhook live
- **Webhook endpoint live**: `we_1TrUSpK8xOmiNNUKB8yz7tob`
  apuntando a `https://alexendros.dev/api/stripe/webhook`.
- **Productos live** (Dashboard Stripe): 9 productos con sus 9 precios
  pre-creados. Smoke test post-F17.5b confirmó que el checkout live usa
  `price: "price_1TrUSW..."` y `product: prod_UrCswCK6GqUFDm` (no productos
  anónimos generados por `price_data`).

Para auditoría/rollback, las claves viven en el item "Stripe" del vault
"Infraestructura" en Proton Pass, junto con las claves test.

### Tests de integridad del catálogo (F17.5b)

`tests/unit/catalog.test.ts` añade 7 tests de invariantes:

- Todo item activo y comprable (PURCHASABLES) tiene AMBOS IDs (`test` y `live`).
- Todos los IDs siguen el formato `^price_[A-Za-z0-9]{10,}$`.
- Para el mismo item, los IDs de test y live son distintos.
- Ningún ID de test se reusa como ID de live en otro item (detecta swap).
- `getCatalogPriceId` devuelve el ID del modo solicitado.
- `getCatalogPriceId` devuelve `null` si falta el ID del modo.

`tests/integration/checkout.test.ts` añade 3 tests E2E:

- En live mode usa `stripePriceIds.live`.
- En test mode usa `stripePriceIds.test`.
- En live mode con retainer usa el `price_...` live con `mode: "subscription"`.

`isLiveMode` en el mock pasa a ser un getter sobre `mocks.state.isLiveMode`,
lo que permite alternar test ↔ live dentro de la misma suite.

```

```
