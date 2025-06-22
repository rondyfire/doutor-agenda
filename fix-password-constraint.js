const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixPasswordConstraint() {
  try {
    console.log("🔧 Verificando e corrigindo constraint do campo password...");

    const client = await pool.connect();

    // Verificar se o campo password tem constraint NOT NULL
    const checkResult = await client.query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password';
    `);

    console.log("Estrutura atual do campo password:", checkResult.rows[0]);

    if (checkResult.rows[0] && checkResult.rows[0].is_nullable === "NO") {
      console.log("⚠️ Campo password tem constraint NOT NULL. Removendo...");

      // Remover constraint NOT NULL
      await client.query(`
        ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
      `);

      console.log("✅ Constraint NOT NULL removida do campo password");
    } else {
      console.log("✅ Campo password já permite NULL");
    }

    client.release();
  } catch (error) {
    console.error("❌ Erro ao corrigir constraint:", error.message);
  } finally {
    await pool.end();
  }
}

fixPasswordConstraint();
