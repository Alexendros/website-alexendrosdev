import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCrmAuth } from "@/lib/crm-auth";

export async function GET(req: Request) {
  const authErr = requireCrmAuth(req);
  if (authErr) return authErr;

  if (!prisma) {
    return NextResponse.json({ error: "CRM no disponible." }, { status: 503 });
  }

  const url = new URL(req.url);
  const dealId = url.searchParams.get("dealId");

  const where: Record<string, unknown> = {};
  if (dealId) where.dealId = dealId;

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: activities });
}
