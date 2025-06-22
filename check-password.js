const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkPassword() {
  try {
    const client = await pool.connect();

    // Verificar se o campo password existe
    const passwordResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'
    `);

    console.log("Campo password existe:", passwordResult.rows.length > 0);

    if (passwordResult.rows.length > 0) {
      console.log("Detalhes do campo password:", passwordResult.rows[0]);
    }

    // Verificar usuários sem senha
    const usersWithoutPassword = await client.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE password IS NULL
    `);

    console.log("Usuários sem senha:", usersWithoutPassword.rows[0].count);

    client.release();
  } catch (error) {
    console.error("Erro:", error.message);
  } finally {
    await pool.end();
  }
}

checkPassword();
