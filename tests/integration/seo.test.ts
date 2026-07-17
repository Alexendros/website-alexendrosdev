import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { GET as feedGET } from "@/app/feed.xml/route";

describe("SEO — superficie de indexación (blog eliminado #80)", () => {
  it("sitemap incluye rutas estáticas y proyectos, sin blog", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain("https://alexendros.dev");
    expect(urls).toContain("https://alexendros.dev/servicios");
    expect(urls).toContain("https://alexendros.dev/proyectos/alexendros-me");
    // Blog eliminado: no debe incluir rutas /blog/
    expect(urls.some((u) => u.includes("/blog/"))).toBe(false);
  });

  it("feed.xml emite RSS válido sin items (blog eliminado)", async () => {
    const res = await feedGET();
    expect(res.headers.get("Content-Type")).toContain("application/rss+xml");
    const xml = await res.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<title>Alejandro Domingo Agustí</title>");
    // Blog eliminado: no debe contener rutas /blog/ ni items
    expect(xml).not.toContain("/blog/");
  });
});
