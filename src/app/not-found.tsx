import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description:
    "La página que buscas no existe. Puedes volver al inicio, ver proyectos o contactar conmigo.",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <section
      className="ak-container ak-hero-c"
      data-screen-label="404"
      style={{ minHeight: "60vh" }}
    >
      <span className="ak-note" data-reveal>
        <Icon name="alert-circle" size={14} />
        Error 404
      </span>
      <h1 className="ak-display" data-reveal data-reveal-delay="1">
        Página no encontrada
      </h1>
      <p className="ak-hero-c-lead" data-reveal data-reveal-delay="2">
        La página que buscas no existe o ha cambiado de dirección. Si crees que debería estar aquí,
        escríbeme y lo reviso.
      </p>
      <div className="ak-hero-c-cta" data-reveal data-reveal-delay="2">
        <Button variant="primary" href="/">
          Volver al inicio
        </Button>
        <Button variant="secondary" href="/contacto">
          <Icon name="mail" size={16} style={{ marginRight: 8 }} />
          Contactar
        </Button>
      </div>
    </section>
  );
}
