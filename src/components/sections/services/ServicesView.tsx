"use client";

import { useState } from "react";
import { COMPARISON, FAQ, TIERS, PURCHASABLES, formatPrice } from "@/lib/content";
import type { Tier, PurchasableItem } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, SectionHead } from "@/components/ui/SectionHead";

type Mode = "proyecto" | "retainer";

function AddonCard({ item }: { item: PurchasableItem }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: item.id }),
      });
      const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (res.ok && body?.url) {
        window.location.href = body.url;
        return; // redirección en curso
      }
      setError(body?.error ?? "No se pudo iniciar el pago. Inténtalo de nuevo.");
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ak-tier">
      <div className="ak-tier-name">{item.name}</div>
      <div className="ak-tier-price">{formatPrice(item.amount, item.currency)}</div>
      <p className="ak-principle-body" style={{ margin: "0 0 16px", flex: 1 }}>
        {item.desc}
      </p>
      <Button
        variant="secondary"
        onClick={buy}
        disabled={loading}
        style={{ width: "100%", justifyContent: "center" }}
      >
        <Icon name="external-link" size={15} style={{ marginRight: 7 }} />
        {loading ? "Redirigiendo…" : "Pagar ahora"}
      </Button>
      {error && (
        <span className="ak-err-msg" style={{ marginTop: 10 }}>
          <Icon name="alert-circle" size={13} />
          {error}
        </span>
      )}
    </div>
  );
}

function AddonsSection() {
  return (
    <section className="ak-section" style={{ paddingTop: 8 }}>
      <SectionHead eyebrow="extras" title="Servicios puntuales" />
      <div className="ak-pricing">
        {PURCHASABLES.map((item) => (
          <AddonCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function PricingToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="ak-toggle" role="tablist">
      <button className={mode === "proyecto" ? "on" : ""} onClick={() => setMode("proyecto")}>
        Por proyecto
      </button>
      <button className={mode === "retainer" ? "on" : ""} onClick={() => setMode("retainer")}>
        Retainer mensual
      </button>
    </div>
  );
}

function TierCard({ t }: { t: Tier }) {
  return (
    <div className={`ak-tier ${t.pro ? "ak-tier-pro" : ""}`.trim()}>
      {t.pro && (
        <span className="ak-tier-badge">
          <Icon name="star" size={12} />
          Más elegido
        </span>
      )}
      <div className="ak-tier-name">{t.name}</div>
      <div className="ak-tier-price">
        {t.price}
        <small>{t.unit}</small>
      </div>
      <ul className="ak-tier-feats">
        {t.feats.map(([f, on]) => (
          <li key={f} className={on ? "" : "off"}>
            <Icon name={on ? "check" : "minus"} size={15} />
            {f}
          </li>
        ))}
      </ul>
      <Button
        variant={t.pro ? "primary" : "secondary"}
        href="/contacto"
        style={{ width: "100%", justifyContent: "center" }}
      >
        Empezar
      </Button>
    </div>
  );
}

function Comparison() {
  return (
    <section className="ak-section" style={{ paddingTop: 8 }}>
      <SectionHead eyebrow="comparativa" title="Qué incluye cada plan" />
      <div className="ak-cmp">
        <div className="ak-cmp-row ak-cmp-head">
          <span>Característica</span>
          <span>Starter</span>
          <span>Pro</span>
          <span>Scale</span>
        </div>
        {COMPARISON.map(([feat, cells]) => (
          <div key={feat} className="ak-cmp-row ak-cmp-body">
            <span className="ak-cmp-feat">{feat}</span>
            {cells.map((on, i) => (
              <span key={i} className="ak-cmp-cell">
                {on ? (
                  <Icon name="check" size={16} className="yes" />
                ) : (
                  <span className="no">—</span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="ak-section">
      <SectionHead center eyebrow="dudas" title="Preguntas frecuentes" />
      <div className="ak-faq">
        {FAQ.map((f, i) => (
          <div key={i} className={`ak-faq-item ${open === i ? "open" : ""}`.trim()}>
            <button
              className="ak-faq-q"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              {f.q}
              <span className="ic">
                <Icon name="plus" size={18} />
              </span>
            </button>
            <div className="ak-faq-a">
              <div className="ak-faq-a-in">{f.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServicesView() {
  const [mode, setMode] = useState<Mode>("proyecto");
  return (
    <div className="ak-container">
      <section className="ak-services-hero" data-screen-label="header">
        <Eyebrow>servicios</Eyebrow>
        <h1 className="ak-page-title">Planes claros, sin sorpresas</h1>
        <p className="ak-page-lead">
          Servicios de consultoría en platform engineering, cloud-native y desarrollo fullstack.
          Precios fijos, sin sorpresas.
        </p>
        <div style={{ marginTop: 8 }}>
          <PricingToggle mode={mode} setMode={setMode} />
        </div>
      </section>
      <section className="ak-section" style={{ paddingTop: 28 }}>
        <div className="ak-pricing">
          {TIERS[mode].map((t) => (
            <TierCard key={t.name} t={t} />
          ))}
        </div>
      </section>
      <Comparison />
      <AddonsSection />
      <FaqSection />
    </div>
  );
}
