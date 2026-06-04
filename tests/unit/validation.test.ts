import { describe, expect, it } from "vitest";
import { contactSchema, newsletterSchema, checkoutSchema, flattenErrors } from "@/lib/validation";

describe("contactSchema", () => {
  const base = {
    name: "Ana",
    email: "ana@example.com",
    type: "Web App",
    message: "Hola, quiero una web",
    consent: true as const,
    website: "",
  };

  it("acepta datos válidos", () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza email no válido", () => {
    const r = contactSchema.safeParse({ ...base, email: "no-es-email" });
    expect(r.success).toBe(false);
    if (!r.success) expect(flattenErrors(r.error).email).toBeTruthy();
  });

  it("rechaza nombre vacío", () => {
    expect(contactSchema.safeParse({ ...base, name: "" }).success).toBe(false);
  });

  it("rechaza consentimiento no aceptado", () => {
    expect(contactSchema.safeParse({ ...base, consent: false }).success).toBe(false);
  });

  it("rechaza honeypot relleno (website)", () => {
    expect(contactSchema.safeParse({ ...base, website: "http://spam" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("acepta email válido", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });
  it("rechaza email inválido", () => {
    expect(newsletterSchema.safeParse({ email: "x" }).success).toBe(false);
  });
  it("rechaza honeypot relleno", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com", website: "bot" }).success).toBe(false);
  });
});

describe("checkoutSchema", () => {
  it("acepta un id de item", () => {
    expect(checkoutSchema.safeParse({ item: "auditoria-tecnica" }).success).toBe(true);
  });
  it("rechaza item vacío", () => {
    expect(checkoutSchema.safeParse({ item: "" }).success).toBe(false);
  });
  it("ignora cualquier precio enviado por el cliente", () => {
    const r = checkoutSchema.safeParse({ item: "auditoria-tecnica", amount: 1 });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).not.toHaveProperty("amount");
  });
});
