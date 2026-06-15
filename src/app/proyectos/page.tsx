import type { Metadata } from "next";
import { ProjectsView } from "@/components/sections/projects/ProjectsView";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Webs y aplicaciones, plataformas y backend, herramientas a medida y proyectos open source.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
