const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkDatabase() {
  try {
    console.log("🔍 Verificando conexão com o banco de dados...");

    // Testar conexão
    const client = await pool.connect();
    console.log("✅ Conexão com o banco estabelecida com sucesso!");

    // Listar tabelas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("\n📋 Tabelas encontradas no banco:");
    if (tablesResult.rows.length === 0) {
      console.log("❌ Nenhuma tabela encontrada!");
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // Verificar se as tabelas principais existem
    const expectedTables = [
      "users",
      "sessions",
      "accounts",
      "verifications",
      "clinics",
      "users_to_clinics",
      "doctors",
      "patients",
      "appointments",
    ];
    const existingTables = tablesResult.rows.map((row) => row.table_name);

    console.log("\n🔍 Verificando tabelas esperadas:");
    expectedTables.forEach((table) => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - NÃO ENCONTRADA`);
      }
    });

    // Verificar dados nas tabelas
    if (existingTables.includes("users")) {
      const usersCount = await client.query("SELECT COUNT(*) FROM users");
      console.log(`\n👥 Usuários cadastrados: ${usersCount.rows[0].count}`);
    }

    if (existingTables.includes("clinics")) {
      const clinicsCount = await client.query("SELECT COUNT(*) FROM clinics");
      console.log(`🏥 Clínicas cadastradas: ${clinicsCount.rows[0].count}`);
    }

    client.release();
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco:", error.message);
    console.error("Verifique se:");
    console.error("1. A variável DATABASE_URL está configurada no .env");
    console.error("2. O banco PostgreSQL está rodando");
    console.error("3. As credenciais estão corretas");
  } finally {
    await pool.end();
  }
}

checkDatabase();
