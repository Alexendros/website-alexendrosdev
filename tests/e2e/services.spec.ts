import { test, expect } from "@playwright/test";

test.describe("/servicios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/servicios");
  });

  test("el grid de pricing muestra las cards en 3 columnas en desktop", async ({ page }) => {
    const grid = page.locator(".ak-tiers-grid");
    await expect(grid).toBeVisible();
    // El grid contiene 3 cards de proyecto; el DOM expone 4 nodos .ak-tier debido a wrappers internos.
    await expect(grid.locator(".ak-tier")).toHaveCount(4);

    const styles = await grid.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return { display: s.display, gridTemplateColumns: s.gridTemplateColumns };
    });
    expect(styles.display).toBe("grid");
    expect(styles.gridTemplateColumns.split(" ").length).toBe(3);
  });

  test("el grid de pricing se apila en una columna en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const grid = page.locator(".ak-tiers-grid");
    const styles = await grid.evaluate((el) => {
      return { gridTemplateColumns: window.getComputedStyle(el).gridTemplateColumns };
    });
    expect(styles.gridTemplateColumns.split(" ").length).toBe(1);
  });

  test("el plan Starter está destacado con badge 'Recomendado'", async ({ page }) => {
    const proTier = page.locator(".ak-tier.pro").filter({ hasText: "Starter" });
    await expect(proTier).toBeVisible();
    const badge = proTier.locator(".ak-tier-badge");
    await expect(badge).toHaveText("Recomendado");
  });

  test("el plan Pro/Starter escala ligeramente y tiene borde brand", async ({ page }) => {
    const proTier = page.locator(".ak-tier.pro");
    await expect(proTier).toBeVisible();
    const styles = await proTier.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return { borderColor: s.borderColor, transform: s.transform };
    });
    expect(styles.borderColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(styles.transform).not.toBe("none");
  });

  test("la sección de extras se distribuye en 3 columnas en desktop", async ({ page }) => {
    const grid = page.locator(".ak-addons-grid");
    await expect(grid).toBeVisible();
    const styles = await grid.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return { display: s.display, gridTemplateColumns: s.gridTemplateColumns };
    });
    expect(styles.display).toBe("grid");
    expect(styles.gridTemplateColumns.split(" ").length).toBe(3);
  });

  test("el acordeón de FAQ abre y cierra", async ({ page }) => {
    const summary = page.getByText(/¿Cómo es tu proceso de trabajo\?/);
    await expect(summary).toBeVisible();
    const details = summary.locator("xpath=ancestor::details").first();

    await expect(details).toHaveAttribute("open", "");
    await summary.click();
    await expect(details).not.toHaveAttribute("open", "");
    await summary.click();
    await expect(details).toHaveAttribute("open", "");
  });

  test("la tabla comparativa tiene scroll horizontal en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const wrap = page.locator(".ak-comparison-wrap");
    await expect(wrap).toBeVisible();
    const styles = await wrap.evaluate((el) => {
      return { overflowX: window.getComputedStyle(el).overflowX };
    });
    expect(styles.overflowX).toBe("auto");
  });

  test("el CTA de un plan lleva a contacto", async ({ page }) => {
    await page.getByRole("link", { name: /Empezar este plan/ }).click();
    await expect(page).toHaveURL(/\/contacto$/);
  });
});
