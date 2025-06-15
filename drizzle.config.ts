import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_julyMsIL38GY@ep-spring-pine-accyltmn-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
