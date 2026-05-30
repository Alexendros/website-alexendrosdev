import { NextResponse } from "next/server";
import { newsletterSchema, flattenErrors } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/email";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo en un minuto." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de petición inválido." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email no válido.", fields: flattenErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { email } = parsed.data;

  if (prisma) {
    try {
      await prisma.subscriber.upsert({
        where: { email },
        update: {},
        create: { email },
      });
    } catch (err) {
      console.error("[newsletter] error al persistir suscriptor:", err);
    }
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Gracias por suscribirte",
        react: WelcomeEmail(),
      });
    } catch (err) {
      console.error("[newsletter] error al enviar email de bienvenida:", err);
    }
  }

  if (!prisma && !resend) {
    console.warn("[newsletter] sin DATABASE_URL ni RESEND_API_KEY: suscripción recibida pero no persistida.");
  }

  return NextResponse.json({ ok: true });
}
