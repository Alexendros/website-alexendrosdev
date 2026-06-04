import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Pago confirmado",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <div className="ak-container">
      <section className="ak-section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="ak-form-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="ak-success">
            <span className="ak-success-ic">
              <Icon name="check" size={28} />
            </span>
            <h1 style={{ margin: 0 }}>¡Pago confirmado!</h1>
            <p className="ak-principle-body" style={{ margin: 0, maxWidth: "44ch" }}>
              Gracias por tu compra. Recibirás un email con el recibo y me pondré en contacto en
              menos de 24 h para arrancar.
            </p>
            {session_id && (
              <p className="ak-byline-sub mono" style={{ margin: 0, wordBreak: "break-all" }}>
                Referencia: {session_id}
              </p>
            )}
            <Button variant="secondary" href="/">
              Volver al inicio
            </Button>
          </div>
        </div>
        <p className="ak-byline-sub" style={{ textAlign: "center", marginTop: 16 }}>
          ¿Algún problema? <Link href="/contacto">Escríbeme</Link>.
        </p>
      </section>
    </div>
  );
}
