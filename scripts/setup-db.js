const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const { migrate } = require("drizzle-orm/postgres-js/migrator");

require("dotenv").config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

async function main() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main(); 