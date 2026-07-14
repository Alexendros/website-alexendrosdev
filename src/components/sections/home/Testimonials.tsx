"use client";

import { useState, useSyncExternalStore } from "react";
import { TESTIMONIALS as CONTENT_TESTIMONIALS } from "@/lib/content";
import { Icon } from "@/components/ui";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarSeed: string;
}

const TESTIMONIALS: Testimonial[] = CONTENT_TESTIMONIALS.filter(
  (t) => !t.quote.startsWith("__PENDIENTE__"),
).map((t) => ({
  quote: t.quote,
  author: t.name,
  role: t.role || "",
  company: "",
  avatarSeed: "avatar-default",
}));

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeWidth(cb: () => void) {
  const mq = window.matchMedia("(min-width: 880px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getPerView() {
  return window.innerWidth < 880 ? 1 : 3;
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="ak-tcard" role="listitem">
      <span className="ak-tcard-mark">&ldquo;</span>
      <p className="ak-tcard-quote">{t.quote}</p>
      <div className="ak-tcard-author">
        <span
          className="ak-avatar"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/${t.avatarSeed}/100/100)`,
          }}
          aria-hidden="true"
        />
        <div>
          <span className="ak-tcard-name">{t.author}</span>
          <span className="ak-tcard-role">
            {t.role} &middot; {t.company}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isReduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const perView = useSyncExternalStore(subscribeWidth, getPerView, () => 3);

  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, TESTIMONIALS.length - perView);
  const safeIndex = Math.min(index, maxIndex);

  const goNext = () => setIndex((i) => (i >= maxIndex ? maxIndex : i + 1));
  const goPrev = () => setIndex((i) => (i <= 0 ? 0 : i - 1));
  const goTo = (i: number) => setIndex(Math.min(Math.max(0, i), maxIndex));

  if (!isClient || isReduced) {
    return (
      <section className="ak-section" aria-labelledby="testimonials-heading">
        <div className="ak-container">
          <header className="ak-section-head ak-center">
            <h2 id="testimonials-heading" className="ak-h2">
              Testimonios
            </h2>
            <p className="ak-section-sub">Qu&eacute; dicen quienes ya han trabajado conmigo.</p>
          </header>
          <div className="ak-tcar-static" role="list">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ak-section" aria-labelledby="testimonials-heading">
      <div className="ak-container">
        <header className="ak-section-head ak-center">
          <h2 id="testimonials-heading" className="ak-h2">
            Testimonios
          </h2>
          <p className="ak-section-sub">Qu&eacute; dicen quienes ya han trabajado conmigo.</p>
        </header>

        <div className="ak-tcar" role="region" aria-label="Carrusel de testimonios">
          <div className="ak-tcar-viewport">
            <div
              className="ak-tcar-track"
              style={{
                transform: `translateX(calc(-${safeIndex} * (100% + 20px) / ${perView}))`,
              }}
            >
              {TESTIMONIALS.map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>

          <div className="ak-tcar-nav" aria-label="Navegaci&oacute;n carrusel">
            <button
              className="ak-tcar-btn"
              onClick={goPrev}
              aria-label="Testimonio anterior"
              disabled={safeIndex <= 0}
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              className="ak-tcar-btn"
              onClick={goNext}
              aria-label="Siguiente testimonio"
              disabled={safeIndex >= maxIndex}
            >
              <Icon name="chevron-right" size={18} />
            </button>
          </div>

          <div className="ak-tcar-dots" aria-label="Indicadores">
            {TESTIMONIALS.slice(0, maxIndex + 1).map((_, i) => (
              <button
                key={i}
                className={`ak-tcar-dot ${i === safeIndex ? "on" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                aria-current={i === safeIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
