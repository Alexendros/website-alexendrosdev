# ARCHITECTURE — portfolio-alexendros

> Mapeado vivo de la aplicación. Se amplía conforme se crean rutas y módulos.
> Diseño origen: **Arctic Ocean** (Next.js + Tailwind v4 + shadcn/ui). Bundle prototipo: `~/Repositorios/portfolioalejandrovargas.zip`.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript estricto |
| Estilos | Tailwind CSS v4 (`@theme`) + `src/styles/site.css` (portado, clases `ak-*`) + tokens `design-tokens.css` |
| Fuentes / iconos | `next/font` (Inter, JetBrains Mono) · `lucide-react` |
| Contenido | Módulos TS tipados (`src/lib/content/`) + blog en MDX (`content/blog/`) |
| Backend | Route Handlers + zod + Resend + React Email + Prisma/Supabase |
| Calidad | ESLint, Prettier, tsc, Vitest, Playwright, axe, Lighthouse/CWV |
| Gestor | pnpm ≥10 |

## Árbol de rutas (App Router)

```
/                       app/page.tsx              (RSC + islas)   Home
/sobre-mi               app/sobre-mi/page.tsx      (RSC)           Sobre mí
/proyectos              app/proyectos/page.tsx     (RSC + isla)    Lista + filtros
/proyectos/[slug]       app/proyectos/[slug]/      (RSC · SSG)     Caso de estudio
/stack                  app/stack/page.tsx         (RSC + isla)    Grafo radial
/blog                   app/blog/page.tsx          (RSC)           Lista de posts
/blog/[slug]            app/blog/[slug]/           (RSC · SSG·MDX) Post
/servicios              app/servicios/page.tsx     (RSC + isla)    Tiers + FAQ
/contacto               app/contacto/page.tsx      (RSC + isla)    Form multi-step
/api/contact            app/api/contact/route.ts   (Route Handler) POST lead
/api/newsletter         app/api/newsletter/route.ts(Route Handler) POST suscripción
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
    content/            projects.ts, posts.ts, services.ts, timeline.ts,
                        stack.ts, testimonials.ts, faq.ts (tipados)
    db/                 cliente Prisma
    validation/         esquemas zod (contact, newsletter)
    hooks/              useReveal, useTheme
    utils/              helpers
  styles/               design-tokens.css, site.css (portados)
emails/                 plantillas React Email
content/blog/           *.mdx
prisma/                 schema.prisma
tests/                  unit (Vitest) + e2e (Playwright)
public/                 assets estáticos
.github/workflows/      ci.yml
.claude/                scaffolding MCEOD L2
```

## Frontera cliente/servidor

- **Server Components** (por defecto): páginas, layout, lectura de contenido tipado y MDX, SEO.
- **Client Components** (`"use client"`): `Terminal`, `StackGraph`, `ContactForm`, `Testimonials` (carrusel), `ThemeToggle`, `Marquee`, nav móvil del `Header`, filtros de `/proyectos`.

## Tema (no-flash)

`localStorage` del prototipo → **cookie `ao-theme`** leída en `app/layout.tsx` (SSR) + script bloqueante mínimo que aplica `.dark` en `<html>` antes de la hidratación. Toggle cliente persiste cookie + actualiza `<html>`.

Tokens: light **Arctic Frost** (steel) / dark **Ocean Depths** (teal). Acento configurable (artefacto Tweaks descartado en prod).

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
Lead        { id, name, email, company?, budget?, message, source, createdAt }
Subscriber  { id, email (unique), confirmed, createdAt }
```

## Mapa prototipo → producción

| Prototipo (zip) | Destino |
|---|---|
| `colors_and_type.css` | `src/styles/design-tokens.css` |
| `site.css` | `src/styles/site.css` |
| `lib/core.jsx` | `components/sections/*` + `components/ui/*` + `lib/hooks/*` |
| `lib/data.jsx` | `src/lib/content/*.ts` |
| `lib/home.jsx`, `about.jsx`, ... | páginas `app/**` correspondientes |
| `lib/tweaks-panel.jsx` | descartado (dev-only opcional) |
| `*.html` | rutas App Router |
