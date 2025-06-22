const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addPasswordColumn() {
  try {
    console.log("🔧 Adicionando campo password na tabela users...");

    const client = await pool.connect();

    // Verificar se o campo já existe
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password';
    `);

    if (checkResult.rows.length > 0) {
      console.log("✅ Campo password já existe!");
    } else {
      // Adicionar o campo password
      await client.query(`
        ALTER TABLE users ADD COLUMN password TEXT;
      `);
      console.log("✅ Campo password adicionado com sucesso!");
    }

    client.release();
  } catch (error) {
    console.error("❌ Erro ao adicionar campo password:", error.message);
  } finally {
    await pool.end();
  }
}

addPasswordColumn();
