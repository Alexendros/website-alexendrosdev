import { beforeEach, describe, expect, it, vi } from "vitest";

// IDs fijos para tests (UUIDs v4 válidos)
const CONTACT_ID = "bb116d1d-6d86-4bdb-b163-2f738e058399";
const DEAL_ID = "9b856f74-a796-435a-94fc-7ac2c2d76a64";
const STAGE_NUEVO_ID = "fa3905c2-78c1-49dc-a6c5-3f4cc86858fe";
const STAGE_CONTACTADO_ID = "34b60493-6e56-4910-af5f-456c35a98178";
const INVOICE_ID = "7578caee-e40c-4d33-8eef-068bad2f168b";

// Mock de prisma con todos los modelos CRM
const mocks = vi.hoisted(() => ({
  state: {
    crmApiKey: "test-crm-key",
    prisma: null as null | Record<string, Record<string, ReturnType<typeof vi.fn>>>,
  },
  mocks: {
    contactFindMany: vi.fn(),
    contactCreate: vi.fn(),
    dealFindMany: vi.fn(),
    dealCreate: vi.fn(),
    dealUpdate: vi.fn(),
    dealFindFirst: vi.fn(),
    pipelineStageFindMany: vi.fn(),
    pipelineStageFindFirst: vi.fn(),
    productFindMany: vi.fn(),
    productCreate: vi.fn(),
    invoiceFindMany: vi.fn(),
    invoiceCreate: vi.fn(),
    invoiceUpdate: vi.fn(),
    invoiceFindUnique: vi.fn(),
    activityFindMany: vi.fn(),
    activityCreate: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  get prisma() {
    return mocks.state.prisma;
  },
}));

vi.mock("@/lib/crm/invoice-number", () => ({
  generateInvoiceNumberAsync: vi.fn(async () => "INV-2026-001"),
}));

vi.mock("@/lib/crm-auth", () => ({
  requireCrmAuth: vi.fn(() => undefined),
}));

const { POST: contactsPOST, GET: contactsGET } = await import("@/app/api/crm/contacts/route");
const { POST: dealsPOST, GET: dealsGET } = await import("@/app/api/crm/deals/route");
const { PATCH: dealsPATCH } = await import("@/app/api/crm/deals/[id]/route");
const { GET: pipelineGET } = await import("@/app/api/crm/pipeline-stages/route");
const { POST: productsPOST, GET: productsGET } = await import("@/app/api/crm/products/route");
const { POST: invoicesPOST, GET: invoicesGET } = await import("@/app/api/crm/invoices/route");
const { PATCH: invoicesPATCH } = await import("@/app/api/crm/invoices/[id]/route");
const { GET: activitiesGET } = await import("@/app/api/crm/activities/route");

function buildPrisma() {
  return {
    contact: {
      findMany: mocks.mocks.contactFindMany,
      create: mocks.mocks.contactCreate,
    },
    deal: {
      findMany: mocks.mocks.dealFindMany,
      create: mocks.mocks.dealCreate,
      update: mocks.mocks.dealUpdate,
      findFirst: mocks.mocks.dealFindFirst,
    },
    pipelineStage: {
      findMany: mocks.mocks.pipelineStageFindMany,
      findFirst: mocks.mocks.pipelineStageFindFirst,
    },
    product: {
      findMany: mocks.mocks.productFindMany,
      create: mocks.mocks.productCreate,
    },
    invoice: {
      findMany: mocks.mocks.invoiceFindMany,
      create: mocks.mocks.invoiceCreate,
      update: mocks.mocks.invoiceUpdate,
      findUnique: mocks.mocks.invoiceFindUnique,
    },
    activity: {
      findMany: mocks.mocks.activityFindMany,
      create: mocks.mocks.activityCreate,
    },
  };
}

function jsonReq(body: unknown, method = "POST") {
  return new Request("http://localhost/api/crm/test", {
    method,
    headers: { "content-type": "application/json", "x-api-key": "test-crm-key" },
    body: JSON.stringify(body),
  });
}

function getReq(url: string) {
  return new Request(url, {
    method: "GET",
    headers: { "x-api-key": "test-crm-key" },
  });
}

function getReqNoAuth(url: string) {
  return new Request(url, { method: "GET" });
}

beforeEach(() => {
  mocks.state.crmApiKey = "test-crm-key";
  mocks.state.prisma = buildPrisma();
  Object.values(mocks.mocks).forEach((m) => m.mockReset());
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

// ─── Contacts ───────────────────────────────────────────────────────────────

describe("CRM: Contacts", () => {
  it("T4.7: GET contacts → 200 array", async () => {
    mocks.mocks.contactFindMany.mockResolvedValue([{ id: CONTACT_ID, firstName: "Test" }]);
    const res = await contactsGET(getReq("http://localhost/api/crm/contacts"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toHaveLength(1);
  });

  it("T4.8: POST contact → 201", async () => {
    mocks.mocks.contactCreate.mockResolvedValue({
      id: CONTACT_ID,
      firstName: "Nuevo",
    });
    const res = await contactsPOST(jsonReq({ firstName: "Nuevo", email: "test@example.com" }));
    expect(res.status).toBe(201);
  });

  it("T4.9: POST email duplicado → 201 (Contact no unique email)", async () => {
    mocks.mocks.contactCreate.mockResolvedValue({
      id: CONTACT_ID,
      firstName: "Dup",
    });
    const res = await contactsPOST(jsonReq({ firstName: "Dup", email: "dup@example.com" }));
    expect(res.status).toBe(201);
  });

  it("T4.10: POST sin firstName → 422", async () => {
    const res = await contactsPOST(jsonReq({ lastName: "Solo" }));
    expect(res.status).toBe(422);
  });
});

// ─── Deals ──────────────────────────────────────────────────────────────────

describe("CRM: Deals", () => {
  it("T4.11: GET deals → 200 array", async () => {
    mocks.mocks.dealFindMany.mockResolvedValue([{ id: DEAL_ID, title: "Test" }]);
    const res = await dealsGET(getReq("http://localhost/api/crm/deals"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("T4.12: POST deal → 201 con stage Nuevo automático", async () => {
    mocks.mocks.pipelineStageFindFirst.mockResolvedValue({
      id: STAGE_NUEVO_ID,
      order: 0,
      name: "Nuevo",
    });
    mocks.mocks.dealCreate.mockResolvedValue({
      id: DEAL_ID,
      title: "Nuevo deal",
      stageId: STAGE_NUEVO_ID,
    });
    const res = await dealsPOST(jsonReq({ title: "Nuevo deal", contactId: CONTACT_ID }));
    expect(res.status).toBe(201);
    expect(mocks.mocks.dealCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stageId: STAGE_NUEVO_ID }),
      }),
    );
  });

  it("T4.13: POST sin contactId → 422", async () => {
    const res = await dealsPOST(jsonReq({ title: "Sin contacto" }));
    expect(res.status).toBe(422);
  });

  it("T4.14: POST contactId inexistente → 422", async () => {
    mocks.mocks.dealCreate.mockRejectedValue(new Error("Foreign key constraint"));
    const res = await dealsPOST(
      jsonReq({ title: "Deal", contactId: "00000000-0000-0000-0000-000000000000" }),
    );
    expect(res.status).toBe(422);
  });
});

// ─── Deals PATCH ────────────────────────────────────────────────────────────

describe("CRM: Deals PATCH", () => {
  it("T4.15: PATCH deal stage → 200", async () => {
    mocks.mocks.dealFindFirst.mockResolvedValue({
      id: DEAL_ID,
      stageId: STAGE_NUEVO_ID,
    });
    // Primera llamada: target stage (Contactado). Segunda: current stage (Nuevo).
    mocks.mocks.pipelineStageFindFirst
      .mockResolvedValueOnce({ id: STAGE_CONTACTADO_ID, order: 1, name: "Contactado" })
      .mockResolvedValueOnce({ id: STAGE_NUEVO_ID, order: 0, name: "Nuevo" });
    mocks.mocks.dealUpdate.mockResolvedValue({
      id: DEAL_ID,
      stageId: STAGE_CONTACTADO_ID,
    });
    mocks.mocks.activityCreate.mockResolvedValue({ id: "a1" });
    const res = await dealsPATCH(jsonReq({ stageId: STAGE_CONTACTADO_ID }, "PATCH"), {
      params: Promise.resolve({ id: DEAL_ID }),
    });
    expect(res.status).toBe(200);
  });

  it("T4.16: PATCH stageId inexistente → 422", async () => {
    mocks.mocks.dealFindFirst.mockResolvedValue({
      id: DEAL_ID,
      stageId: STAGE_NUEVO_ID,
    });
    mocks.mocks.pipelineStageFindFirst.mockResolvedValue(null);
    const res = await dealsPATCH(
      jsonReq({ stageId: "00000000-0000-0000-0000-000000000000" }, "PATCH"),
      { params: Promise.resolve({ id: DEAL_ID }) },
    );
    expect(res.status).toBe(422);
  });

  it("T4.17: PATCH deal crea Activity transición", async () => {
    mocks.mocks.dealFindFirst.mockResolvedValue({
      id: DEAL_ID,
      stageId: STAGE_NUEVO_ID,
    });
    // Primera llamada: target stage (Contactado). Segunda: current stage (Nuevo).
    mocks.mocks.pipelineStageFindFirst
      .mockResolvedValueOnce({ id: STAGE_CONTACTADO_ID, order: 1, name: "Contactado" })
      .mockResolvedValueOnce({ id: STAGE_NUEVO_ID, order: 0, name: "Nuevo" });
    mocks.mocks.dealUpdate.mockResolvedValue({
      id: DEAL_ID,
      stageId: STAGE_CONTACTADO_ID,
    });
    mocks.mocks.activityCreate.mockResolvedValue({ id: "a2" });
    await dealsPATCH(jsonReq({ stageId: STAGE_CONTACTADO_ID }, "PATCH"), {
      params: Promise.resolve({ id: DEAL_ID }),
    });
    expect(mocks.mocks.activityCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "NOTE",
          dealId: DEAL_ID,
        }),
      }),
    );
  });
});

// ─── Pipeline Stages ────────────────────────────────────────────────────────

describe("CRM: Pipeline Stages", () => {
  it("T4.18: GET pipeline-stages → 200, ordenados por order", async () => {
    mocks.mocks.pipelineStageFindMany.mockResolvedValue([
      { id: STAGE_NUEVO_ID, name: "Nuevo", order: 0 },
      { id: STAGE_CONTACTADO_ID, name: "Contactado", order: 1 },
      { id: "55555555-5555-5555-5555-555555555556", name: "Discovery call", order: 2 },
    ]);
    const res = await pipelineGET(getReq("http://localhost/api/crm/pipeline-stages"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(3);
    expect(mocks.mocks.pipelineStageFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { order: "asc" },
      }),
    );
  });
});

// ─── Products ───────────────────────────────────────────────────────────────

describe("CRM: Products", () => {
  it("T4.19: GET products → 200", async () => {
    mocks.mocks.productFindMany.mockResolvedValue([{ id: "p1", name: "Retainer" }]);
    const res = await productsGET(getReq("http://localhost/api/crm/products"));
    expect(res.status).toBe(200);
  });

  it("T4.20: POST product → 201", async () => {
    mocks.mocks.productCreate.mockResolvedValue({
      id: "p2",
      name: "Nuevo producto",
    });
    const res = await productsPOST(jsonReq({ name: "Nuevo producto", unitPrice: 5000 }));
    expect(res.status).toBe(201);
  });
});

// ─── Invoices ───────────────────────────────────────────────────────────────

describe("CRM: Invoices", () => {
  it("T4.21: GET invoices → 200", async () => {
    mocks.mocks.invoiceFindMany.mockResolvedValue([{ id: INVOICE_ID, number: "INV-2026-001" }]);
    const res = await invoicesGET(getReq("http://localhost/api/crm/invoices"));
    expect(res.status).toBe(200);
  });

  it("T4.22: POST invoice → 201 con number INV-YYYY-NNN", async () => {
    mocks.mocks.invoiceCreate.mockResolvedValue({
      id: INVOICE_ID,
      number: "INV-2026-001",
    });
    const res = await invoicesPOST(
      jsonReq({
        contactId: CONTACT_ID,
        items: [{ description: "Consultoría", quantity: 1, unitPrice: 6000 }],
      }),
    );
    expect(res.status).toBe(201);
  });

  it("T4.23: POST sin items → 422", async () => {
    const res = await invoicesPOST(jsonReq({ contactId: CONTACT_ID, items: [] }));
    expect(res.status).toBe(422);
  });

  it("T4.24: POST taxRate 0.21 → total correcto", async () => {
    mocks.mocks.invoiceCreate.mockResolvedValue({
      id: INVOICE_ID,
      number: "INV-2026-001",
    });
    await invoicesPOST(
      jsonReq({
        contactId: CONTACT_ID,
        taxRate: 0.21,
        items: [{ description: "Consultoría", quantity: 1, unitPrice: 10000 }],
      }),
    );
    expect(mocks.mocks.invoiceCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          taxRate: "0.21",
          subtotal: "10000",
          taxAmount: "2100",
          total: "12100",
        }),
      }),
    );
  });
});

// ─── Invoice PATCH ──────────────────────────────────────────────────────────

describe("CRM: Invoice PATCH", () => {
  it("T4.25: PATCH invoice status paid → 200", async () => {
    mocks.mocks.invoiceFindUnique.mockResolvedValue({
      id: INVOICE_ID,
      status: "sent",
    });
    mocks.mocks.invoiceUpdate.mockResolvedValue({
      id: INVOICE_ID,
      status: "paid",
    });
    const res = await invoicesPATCH(jsonReq({ status: "paid" }, "PATCH"), {
      params: Promise.resolve({ id: INVOICE_ID }),
    });
    expect(res.status).toBe(200);
  });

  it("T4.26: PATCH transición inválida → 422 (draft→paid sin pasar por sent)", async () => {
    mocks.mocks.invoiceFindUnique.mockResolvedValue({
      id: INVOICE_ID,
      status: "draft",
    });
    const res = await invoicesPATCH(jsonReq({ status: "paid" }, "PATCH"), {
      params: Promise.resolve({ id: INVOICE_ID }),
    });
    expect(res.status).toBe(422);
  });
});

// ─── Activities ─────────────────────────────────────────────────────────────

describe("CRM: Activities", () => {
  it("GET activities con ?dealId → 200 array", async () => {
    mocks.mocks.activityFindMany.mockResolvedValue([{ id: "a1", dealId: DEAL_ID, title: "Nota" }]);
    const res = await activitiesGET(
      getReq(`http://localhost/api/crm/activities?dealId=${DEAL_ID}`),
    );
    expect(res.status).toBe(200);
  });
});

// ─── Auth ───────────────────────────────────────────────────────────────────

describe("CRM: Auth", () => {
  it("T4.27: endpoints sin X-API-Key → 401", async () => {
    const { requireCrmAuth } = await import("@/lib/crm-auth");
    const { NextResponse } = await import("next/server");
    vi.mocked(requireCrmAuth).mockReturnValueOnce(
      NextResponse.json({ error: "No autorizado." }, { status: 401 }),
    );
    const res = await contactsGET(getReqNoAuth("http://localhost/api/crm/contacts"));
    expect(res.status).toBe(401);
  });
});
