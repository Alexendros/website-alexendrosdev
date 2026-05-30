import "server-only";
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

const DIR = path.join(process.cwd(), "content/blog");

/** Devuelve el cuerpo MDX de un post, o null si no existe archivo (contenido seed). */
export function getPostSource(slug: string): string | null {
  try {
    return fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
}

export interface TocItem {
  id: string;
  label: string;
}

/** Extrae los encabezados `##` del MDX y genera sus slugs (compatibles con rehype-slug). */
export function extractToc(src: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of src.split("\n")) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^##\s+(.+)$/.exec(line.trim());
    if (m) {
      const label = m[1].trim();
      items.push({ id: slugger.slug(label), label });
    }
  }
  return items;
}
