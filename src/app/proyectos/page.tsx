import type { Metadata } from "next";
import { ProjectsView } from "@/components/sections/projects/ProjectsView";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Plataformas internas, infraestructura cloud-native, APIs de alta disponibilidad y proyectos open source.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
