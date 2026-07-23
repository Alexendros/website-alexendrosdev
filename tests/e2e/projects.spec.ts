import { test, expect } from "@playwright/test";

test.describe("/proyectos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/proyectos");
  });

  test("filtra y busca en la página de proyectos", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Proyectos", level: 1 })).toBeVisible();

    await page.getByLabel("Buscar", { exact: true }).fill("imprenta");
    await expect(page.getByText("1 proyecto", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Nasve/ })).toBeVisible();

    await page.getByLabel("Buscar", { exact: true }).fill("zzzz-no-existe");
    await expect(page.getByText(/Sin resultados/)).toBeVisible();
  });

  test("filtra proyectos por categoría (select)", async ({ page }) => {
    await page.getByLabel("Categoría").selectOption("Web");
    await expect(page.getByText(/\d+ proyectos/, { exact: true })).toBeVisible();
  });

  test("ordena y navega al detalle de un proyecto", async ({ page }) => {
    await page.locator("[class*='ak-masonry-tile']").first().click();
    await expect(page).toHaveURL(/\/proyectos\/[\w-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("muestra sidebar y masonry grid lado a lado en desktop", async ({ page }) => {
    const layout = page.locator(".ak-projects-page");
    await expect(layout).toBeVisible();

    const layoutStyles = await layout.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return { display: s.display, gridTemplateColumns: s.gridTemplateColumns };
    });
    expect(layoutStyles.display).toBe("grid");
    expect(layoutStyles.gridTemplateColumns.split(" ").length).toBe(2);

    const sidebar = page.locator(".ak-projects-sidebar");
    await expect(sidebar).toBeVisible();
    const sidebarStyles = await sidebar.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return { position: s.position, top: s.top };
    });
    expect(sidebarStyles.position).toBe("sticky");

    const masonry = page.locator(".ak-masonry");
    await expect(masonry).toBeVisible();
    const masonryStyles = await masonry.evaluate((el) => {
      return { columns: window.getComputedStyle(el).columns };
    });
    expect(masonryStyles.columns).toMatch(/3/);
  });

  test("los tags de stack son visibles y clicables", async ({ page }) => {
    const firstTag = page.locator(".ak-tag-cloud .ak-tag").first();
    await expect(firstTag).toBeVisible();
    await firstTag.click();
    await expect(firstTag).toHaveClass(/on/);

    const clearBtn = page.locator(".ak-btn-reset");
    await expect(clearBtn).toBeEnabled();
    await clearBtn.click();
    await expect(firstTag).not.toHaveClass(/on/);
  });

  test("el sidebar se oculta por defecto y aparece al pulsar Filtros en móvil", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const sidebar = page.locator(".ak-projects-sidebar");
    const toggle = page.locator(".ak-sidebar-toggle");
    await expect(toggle).toBeVisible();
    await expect(sidebar).not.toHaveClass(/open/);

    await toggle.click();
    await expect(sidebar).toHaveClass(/open/);

    await page.locator(".ak-sidebar-close").click();
    await expect(sidebar).not.toHaveClass(/open/);
  });
});
