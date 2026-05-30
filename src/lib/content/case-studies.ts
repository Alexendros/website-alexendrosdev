import type { Project } from "./types";

export interface CaseBlock {
  type: "p" | "callout" | "code" | "figure" | "quote";
  text?: string;
  // code
  file?: string;
  code?: string;
  // figure
  label?: string;
  caption?: string;
  // quote
  author?: string;
}

export interface CaseSection {
  id: string;
  title: string;
  blocks: CaseBlock[];
}

export interface CaseStudy {
  summary: string;
  role: string;
  duration: string;
  client: string;
  sections: CaseSection[];
}

// Estudio curado para el proyecto destacado (contenido seed completo).
const STUDIES: Record<string, CaseStudy> = {
  "plataforma-idp": {
    summary:
      "Diseñé y construí la plataforma interna de developers para una fintech en crecimiento: 40 equipos de producto, ciclos de deploy de 2 horas y una dependencia total del equipo de plataforma para cualquier cambio en producción. El resultado: de 3 días de onboarding a 4 horas, y €2.4M de ahorro anual en costes operativos.",
    role: "Platform Engineer",
    duration: "8 meses",
    client: "Fintech (conf.)",
    sections: [
      {
        id: "contexto",
        title: "Contexto",
        blocks: [
          {
            type: "p",
            text: "Una fintech con 40 equipos de ingeniería y crecimiento acelerado llegó a un punto de inflexión: cada deploy requería intervención manual del equipo de plataforma, el onboarding de un nuevo servicio tardaba entre dos y tres días y los equipos de producto pasaban más tiempo esperando que construyendo.",
          },
          {
            type: "p",
            text: "El equipo de plataforma tenía cuatro personas para dar soporte a más de 200 ingenieros. La arquitectura de microservicios era correcta en papel, pero el andamiaje operacional no había escalado con ella.",
          },
        ],
      },
      {
        id: "reto",
        title: "El reto",
        blocks: [
          {
            type: "p",
            text: "El problema no era técnico en el sentido clásico: la infraestructura funcionaba. El problema era de experiencia del desarrollador. Scaffolding manual, pipelines copiados de repositorio en repositorio, secretos gestionados con acceso directo a la consola de AWS y sin forma de conocer el estado real de un servicio en producción.",
          },
          {
            type: "callout",
            text: "Decisión clave: no construir otra herramienta interna más. Adoptar Backstage como base y extenderlo con plugins propios para tener una IDP real, no un conjunto de scripts de bash bien organizados.",
          },
        ],
      },
      {
        id: "solucion",
        title: "La solución",
        blocks: [
          {
            type: "p",
            text: "Diseñé la plataforma sobre tres pilares: Backstage como portal del desarrollador, ArgoCD como engine de GitOps y Terraform modules como la capa de infraestructura self-service. Los developers rellenan un formulario en Backstage y en 15 minutos tienen repositorio, pipeline CI/CD, namespace en el cluster y monitorización configurados.",
          },
          {
            type: "code",
            file: "argocd/application.yaml",
            code: `# ArgoCD Application generada por el scaffolding de Backstage
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payments-service
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/org/gitops-config
    path: services/payments
  destination:
    namespace: payments-prod`,
          },
          {
            type: "figure",
            label: "diagrama de arquitectura IDP",
            caption: "Flujo: Backstage scaffolding → PR en repo gitops → ArgoCD sync → K8s",
          },
        ],
      },
      {
        id: "resultado",
        title: "Resultado",
        blocks: [
          {
            type: "p",
            text: "A los seis meses, el 80% de los deploys no requerían intervención del equipo de plataforma. El onboarding de un servicio nuevo pasó de tres días a cuatro horas. El tiempo de deploy medio bajó de 110 minutos a 18 minutos. El equipo de plataforma dejó de gestionar tickets y empezó a trabajar en producto.",
          },
          {
            type: "quote",
            text: "La IDP que construyó nos permitió pasar de 3 a 12 deploys al día sin añadir un solo ingeniero de infraestructura. ROI medible desde el primer sprint.",
            author: "Laura Sanz, VP of Engineering",
          },
        ],
      },
    ],
  },
};

// Plantilla genérica coherente para proyectos sin estudio curado (contenido seed).
function genericStudy(p: Project): CaseStudy {
  return {
    summary: p.desc,
    role: "Senior Engineer",
    duration: "—",
    client: "Confidencial",
    sections: [
      {
        id: "contexto",
        title: "Contexto",
        blocks: [
          { type: "p", text: p.desc },
          {
            type: "p",
            text: `Proyecto de la categoría ${p.category} (${p.year}). Esta es una ficha de caso de estudio con contenido marcador, lista para completar con el detalle real del proyecto.`,
          },
        ],
      },
      {
        id: "resultado",
        title: "Resultado",
        blocks: [
          {
            type: "p",
            text: `Métricas destacadas: ${p.metrics.map((m) => `${m.v} ${m.l}`).join(", ")}.`,
          },
        ],
      },
    ],
  };
}

export function getCaseStudy(p: Project): CaseStudy {
  return STUDIES[p.id] ?? genericStudy(p);
}
