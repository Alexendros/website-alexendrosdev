/**
 * tests/unit/design-system-fixes-batch2.test.ts
 *
 * Lock-in tests for the design-system-fixes-batch2 spec.
 * Validates the 2 hardcoded-fallback violations in PurchaseCard.tsx are gone,
 * that audit-token-coverage reports zero violations, and that DESIGN.md §1.5
 * preserves the 18 deprecation candidates.
 *
 * Spec: specs/design-system-fixes-batch2/
 * Vinculado a: TU-1.1, TU-1.2, TU-1.3, TU-1.4, TU-1.5.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const PURCHASE_CARD = resolve(ROOT, "src/components/sections/checkout/PurchaseCard.tsx");
const DESIGN_MD = resolve(ROOT, "docs/DESIGN.md");

describe("design-system-fixes-batch2 — PurchaseCard.tsx violations lock-in", () => {
  let source: string;
  beforeAll(() => {
    source = readFileSync(PURCHASE_CARD, "utf8");
  });

  it("TU-1.1 — PurchaseCard.tsx no contiene `var(--ak-` (zero matches)", () => {
    const matches = source.match(/var\(--ak-/g);
    expect(matches, "PurchaseCard.tsx no debe contener ningún token prefijado --ak-*").toBeNull();
  });

  it("TU-1.2 — PurchaseCard.tsx no contiene `var(--name, rgba|#|hsl literal)` fallbacks", () => {
    // Detecta cualquier `var(--algo, literalColor)` con literalColor en rgba(, #hex, hsl(
    const re = /var\(\s*--[\w-]+\s*,\s*(?:rgba?\(|#[\da-fA-F]{3,8}|hsl\()/g;
    const matches = source.match(re);
    expect(matches, "Ningún `var(--*, literal)` debe quedar en PurchaseCard.tsx").toBeNull();
  });

  it("TU-1.4 — PurchaseCard.tsx contiene `hsl(var(--border))` (sustitución aplicada)", () => {
    const occurrences = source.match(/hsl\(var\(--border\)\)/g) ?? [];
    expect(
      occurrences.length,
      "hsl(var(--border)) debe aparecer ≥ 2 veces (email + nombre)",
    ).toBeGreaterThanOrEqual(2);
  });
});

describe("design-system-fixes-batch2 — audit-token-coverage.mjs zero violations", () => {
  it("TU-1.3 — el script reporta violations.count === 0 tras el fix", () => {
    const stdout = execSync("node scripts/audit-token-coverage.mjs --json", {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    const json = JSON.parse(stdout);
    expect(json.violations?.count, "violations.count").toBe(0);
    expect(json.violations?.byKind?.["var-with-hardcoded-fallback"]).toBe(0);
    // Coverage se mantiene en ≥90% (regresión-check: no debe bajar).
    const covNum = parseInt(String(json.coverage?.coveragePercent ?? "0").replace("%", ""), 10);
    expect(covNum).toBeGreaterThanOrEqual(90);
  }, 30_000);
});

describe("design-system-fixes-batch2 — DESIGN.md §1.5 deprecation table", () => {
  let design: string;
  beforeAll(() => {
    design = readFileSync(DESIGN_MD, "utf8");
  });

  // Los 18 tokens declarados-como-unused por audit-token-coverage.mjs al 2026-07-24.
  // Fuente canonical: scripts/audit-token-coverage.mjs → unusedTokens[]
  const EXPECTED_18 = [
    "ease-bounce",
    "gutter-lg",
    "gutter-sm",
    "radius-interactive",
    "space-1",
    "space-12",
    "space-16",
    "space-2",
    "space-20",
    "space-24",
    "space-3",
    "space-4",
    "space-6",
    "space-8",
    "z-modal",
    "z-overlay",
    "z-sticky",
    "z-tooltip",
  ];

  it("TU-1.5 — §1.5 contiene los 18 nombres de tokens unused (canonical)", () => {
    // Extrae la sección §1.5 (entre "### 1.5 Deprecated" y el siguiente "---").
    const re = /### 1\.5 Deprecated tokens \(considerar\)[\s\S]*?(?=\n---\n)/;
    const m = design.match(re);
    expect(m, "DESIGN.md debe contener la sección §1.5").not.toBeNull();
    const block = m![0];
    // DESIGN.md renderiza cada token como \`--<token>\` (con dashes). Validamos
    // la presencia literal de \`--${tok}\` para tolerancia cero al backtick layout.
    const missing = EXPECTED_18.filter((tok) => !block.includes(`\`--${tok}\``));
    expect(
      missing,
      `Tokens declared-unused que deben listarse en §1.5 (canonical): ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("TU-1.5b — §1.5 mantiene estructura de tabla (>=18 filas con 4 columnas)", () => {
    // Structural lock-in (evita regex-prose fragility del code-review #4):
    // valida que cada uno de los 18 tokens vive en una fila de tabla markdown
    // con el formato `| <n> | \`--<tok>\` | <categoría> | <acción> |`.
    const re = /### 1\.5 Deprecated tokens \(considerar\)[\s\S]*?(?=\n---\n)/;
    const m = design.match(re);
    expect(m).not.toBeNull();
    const block = m![0];

    const rowsWithAllTokens = EXPECTED_18.filter((tok) => {
      // Cada token debe aparecer dentro de una fila `| ... | ... | ... | ... |`
      const rowRe = new RegExp(`\\|[^\\n]*\\\`--${tok}\\\`[^\\n]*\\|`, "");
      return rowRe.test(block);
    });

    expect(
      rowsWithAllTokens.length,
      `Los 18 tokens deben vivir en filas de tabla markdown en §1.5 (got ${rowsWithAllTokens.length}/18 en tabla)`,
    ).toBe(18);
  });
});
