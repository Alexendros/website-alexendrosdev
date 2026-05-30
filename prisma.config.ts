import { defineConfig, env } from "prisma/config";

// Configuración de Prisma 7. La URL de conexión vive aquí (ya no en schema.prisma)
// y se usa para los comandos de migración/introspección.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
