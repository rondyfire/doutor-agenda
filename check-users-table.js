const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUsersTable() {
  try {
    console.log("🔍 Verificando estrutura da tabela users...");

    const client = await pool.connect();

    // Verificar estrutura da tabela
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

    console.log("\n📋 Estrutura da tabela users:");
    columnsResult.rows.forEach((row) => {
      console.log(
        `  - ${row.column_name} (${row.data_type}) - NULL: ${row.is_nullable}`,
      );
    });

    // Verificar dados
    const usersResult = await client.query(
      "SELECT COUNT(*) as count FROM users",
    );
    console.log(`\n👥 Total de usuários: ${usersResult.rows[0].count}`);

    if (usersResult.rows[0].count > 0) {
      const sampleUsers = await client.query(
        "SELECT id, name, email, password IS NOT NULL as has_password FROM users LIMIT 3",
      );
      console.log("\n📝 Amostra de usuários:");
      sampleUsers.rows.forEach((user) => {
        console.log(
          `  - ${user.name} (${user.email}) - Tem senha: ${user.has_password}`,
        );
      });
    }

    client.release();
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await pool.end();
  }
}

checkUsersTable();
