import { defineConfig } from "prisma/config";

// Configuración de Prisma 7. La URL de conexión vive aquí (ya no en schema.prisma).
// Se lee de process.env directamente (no del helper env(), que lanza si falta):
// así `prisma generate` funciona en CI sin DATABASE_URL; las migraciones la exigen.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    // directUrl no está en los tipos de Prisma 7.8 pero sí es aceptado en runtime.
    // Necesario para migraciones DDL (CREATE TYPE, etc.) sin pooler PgBouncer.
    ...(process.env.DIRECT_URL ? { directUrl: process.env.DIRECT_URL } : {}),
  },
});
