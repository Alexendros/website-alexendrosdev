import { describe, it, expect } from "vitest";
import { isComingSoon } from "@/lib/flags";

describe("isComingSoon", () => {
  it("inactivo por defecto: el portfolio completo es público", () => {
    expect(isComingSoon({})).toBe(false);
  });

  it("se activa solo con el opt-in explícito COMING_SOON=1|true", () => {
    expect(isComingSoon({ COMING_SOON: "1" })).toBe(true);
    expect(isComingSoon({ COMING_SOON: "true" })).toBe(true);
  });

  it("cualquier otro valor deja el sitio completo abierto", () => {
    expect(isComingSoon({ COMING_SOON: "0" })).toBe(false);
    expect(isComingSoon({ COMING_SOON: "false" })).toBe(false);
    expect(isComingSoon({ COMING_SOON: "" })).toBe(false);
  });
});
