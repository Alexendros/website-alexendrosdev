// Helpers JSON-LD para datos estructurados (Schema.org).
// Generan el objeto @graph que se inyecta como <script type="application/ld+json">
// en cada página. Todos los tipos se validan vía schema-dts.

import type {
  WithContext,
  Graph,
  Person,
  WebSite,
  ProfessionalService,
  BlogPosting,
  SoftwareApplication,
} from "schema-dts";
import type { Post, Project } from "@/lib/content/types";

const SITE_URL = "https://alexendros.dev";
const AUTHOR_NAME = "Alejandro Domingo Agustí";

// --------------------------------------------------------------------------
// Nodos reutilizables
// --------------------------------------------------------------------------

function buildPersonNode(): Person {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: SITE_URL,
    sameAs: [`${SITE_URL}/about`],
    jobTitle: "Desarrollador Fullstack",
    description:
      "Desarrollador fullstack especializado en plataformas, webs y aplicaciones a medida.",
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "DevOps",
    ],
  };
}

function buildWebSiteNode(): WebSite {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Alexendros",
    description:
      "Portafolio y blog de Alejandro Domingo Agustí — desarrollo de plataformas, webs y apps.",
    inLanguage: "es",
    author: { "@id": `${SITE_URL}/#person` },
  };
}

function buildProfessionalServiceNode(): ProfessionalService {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: "Alexendros · Desarrollo Web y de Plataformas",
    url: SITE_URL,
    description:
      "Desarrollo de plataformas, webs y aplicaciones a medida en Valencia. Tecnología moderna, código que es tuyo.",
    areaServed: "ES",
    knowsAbout: ["Desarrollo Web", "Aplicaciones a medida", "Plataformas SaaS"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
  };
}

// --------------------------------------------------------------------------
// Builders por tipo de página
// --------------------------------------------------------------------------

/** Grafo para la página de inicio (Person + WebSite + ProfessionalService). */
export function buildHomeGraph(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildPersonNode(),
      buildWebSiteNode(),
      buildProfessionalServiceNode(),
    ],
  };
}

/** Grafo para una entrada de blog. */
export function buildBlogPostGraph(post: Post): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.id}`,
    headline: post.title,
    description: post.desc,
    url: `${SITE_URL}/blog/${post.id}`,
    datePublished: post.date,
    inLanguage: "es",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/** Grafo para un proyecto del portafolio. */
export function buildProjectGraph(project: Project): WithContext<SoftwareApplication> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/projects#${project.id}`,
    name: project.title,
    description: project.desc,
    applicationCategory: project.category,
    dateCreated: project.year,
    author: { "@id": `${SITE_URL}/#person` },
  };
}

// --------------------------------------------------------------------------
// Componente de renderizado (Server Component compatible)
// --------------------------------------------------------------------------

/** Serializa el grafo JSON-LD como string seguro para inyectar en <head>. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
