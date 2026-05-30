import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/SectionHead";
import { StackGraph } from "@/components/sections/stack/StackGraph";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "Mapa interactivo de tecnologías: frontend, backend, DevOps y observabilidad. Explora el grafo radial.",
};

export default function StackPage() {
  return (
    <div className="ak-container">
      <section className="ak-page-head" data-screen-label="header" style={{ paddingBottom: 28 }}>
        <Eyebrow>arquitectura</Eyebrow>
        <h1 className="ak-page-title">Mapa de tecnologías</h1>
        <p className="ak-page-lead">
          Mi stack agrupado por capas. Explora el grafo: arrastra, haz zoom y pulsa cualquier
          nodo para ver el detalle.
        </p>
      </section>
      <section className="ak-section" style={{ paddingTop: 0 }}>
        <StackGraph />
      </section>
    </div>
  );
}
