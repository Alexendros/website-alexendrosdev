import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Fijamos colorScheme=light (predeterminado del sitio) SOLO para
// este spec, para que la comprobación de contraste sea determinista y no
// dependa del prefiers-color-scheme del navegador headless (suele ser dark).
test.use({ colorScheme: "light" });
const ROUTES = [
  "/",
  "/sobre-mi",
  "/servicios",
  "/proyectos",
  "/contacto",
  "/stack",
  "/blog",
  "/legal/privacidad",
];

for (const route of ROUTES) {
  test(`sin violaciones críticas ni serias de accesibilidad en ${route}`, async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("ao-theme", "light");
      } catch {}
    });
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(blocking).toEqual([]);
  });
}

/**
 * TE-3.3 — Computed Style Locks (lock-in de tokens aplicados en runtime).
 *
 * Asegura que el CSS scale de design tokens se aplica correctamente en el DOM
 * renderizado. Esto detecta regresiones invisibles: si un día se cambia
 * `min-height: 140px → 100px` en _contact.css sin actualizar el lock, el test
 * rompe antes de que un dev/PM note la regresión visual.
 */
test.describe("TE-3.3 · Computed style locks (token application)", () => {
  test("/contacto .ak-container respeta --container-px === 32px en padding-inline (RF8 HC-2 lock)", async ({
    page,
  }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");
    // El lock correcto es sobre .ak-container (que usa var(--container-px)),
    // NO sobre input.ak-input (cuyo padding 11px 14px es shorthand intencional
    // en _contact.css · decisión de diseño, no lock de token).
    const container = page.locator(".ak-container").first();
    await expect(container, ".ak-container debe existir en /contacto").toHaveCount(1);
    const padding = await container.evaluate((el) => getComputedStyle(el).paddingInlineStart);
    expect(padding, "padding-inline-start debe resolver a var(--container-px) = 32px").toBe("32px");
  });

  test("/contacto textarea.ak-textarea respeta min-height === 140px", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");
    const textarea = page.locator("textarea").first();
    await expect(textarea, "textarea debe existir en /contacto").toHaveCount(1);
    const minHeight = await textarea.evaluate((el) => getComputedStyle(el).minHeight);
    expect(minHeight, "min-height debe ser literal 140px (cierre DUP ak-textarea Opción A)").toBe(
      "140px",
    );
  });

  test("/proyectos tile.stat NO usa color #fff hardcoded, usa token hsl(...) (HC-1 lock)", async ({
    page,
  }) => {
    await page.goto("/proyectos");
    await page.waitForLoadState("networkidle");
    // Strict: NO skip condicional. /proyectos debe tener tiles renderizados;
    // si no los tiene, el test debe ROMPER (no enmascarar la regresión).
    const stats = page.locator(".ak-tile-stat");
    const count = await stats.count();
    expect(count, "/proyectos debe tener al menos 1 .ak-tile-stat visible").toBeGreaterThan(0);
    const color = await stats.first().evaluate((el) => getComputedStyle(el).color);
    // El color debe resolver a un hsl(...) — #fff hex es PROHIBIDO post-HC-1.
    expect(color, "ak-tile-stat debe usar token var(--text-on-primary), no #fff").not.toBe(
      "rgb(255, 255, 255)",
    );
    expect(color, "ak-tile-stat debe usar HSL function (token system)").toMatch(/^hsl\(/);
  });
});
