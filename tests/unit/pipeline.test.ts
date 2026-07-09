import { describe, expect, it } from "vitest";
import {
  getInitialStage,
  isValidTransition,
  isTerminalStage,
  computeInvoiceTotals,
} from "@/lib/crm/pipeline";

// Pipeline stages (orden):
// 0: Nuevo, 1: Contactado, 2: Discovery call, 3: Propuesta,
// 4: Negociación, 5: Cerrado ganado, 6: Onboarding,
// 7: En progreso, 8: Entregado, 9: Cerrado perdido

describe("pipeline: getInitialStage", () => {
  it("T4.32: devuelve stage con order 0 (Nuevo)", () => {
    const stage = getInitialStage();
    expect(stage.order).toBe(0);
    expect(stage.name).toBe("Nuevo");
  });
});

describe("pipeline: isValidTransition", () => {
  it("T4.33: 0→1 (Nuevo → Contactado) es válida", () => {
    expect(isValidTransition(0, 1)).toBe(true);
  });

  it("T4.34: 0→7 (Nuevo → En progreso) NO es válida (salto ilegal)", () => {
    expect(isValidTransition(0, 7)).toBe(false);
  });

  it("T4.35: 3→9 (Propuesta → Cerrado perdido) es válida", () => {
    expect(isValidTransition(3, 9)).toBe(true);
  });

  it("T4.36: 5→6 (Cerrado ganado → Onboarding) es válida", () => {
    expect(isValidTransition(5, 6)).toBe(true);
  });

  it("T4.37: no permite retroceso (5→3)", () => {
    expect(isValidTransition(5, 3)).toBe(false);
  });
});

describe("pipeline: isTerminalStage", () => {
  it("T4.38: stage 5 (Cerrado ganado) es terminal", () => {
    expect(isTerminalStage(5)).toBe(true);
  });

  it("T4.39: stage 8 (Entregado) es terminal", () => {
    expect(isTerminalStage(8)).toBe(true);
  });

  it("T4.40: stage 9 (Cerrado perdido) es terminal", () => {
    expect(isTerminalStage(9)).toBe(true);
  });
});

describe("pipeline: computeInvoiceTotals", () => {
  it("T4.41: calcula subtotal, impuesto y total", () => {
    const items = [
      { quantity: 2, unitPrice: 5000 },
      { quantity: 1, unitPrice: 3000 },
    ];
    const totals = computeInvoiceTotals(items, 0.21);
    expect(totals.subtotal).toBe(13000);
    expect(totals.taxAmount).toBe(2730);
    expect(totals.total).toBe(15730);
  });
});
