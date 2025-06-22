const { Pool } = require("pg");
require("dotenv/config");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedData() {
  try {
    console.log("🌱 Inserindo dados de teste...");

    const client = await pool.connect();

    // Verificar se já existem dados
    const existingClinics = await client.query("SELECT COUNT(*) FROM clinics");
    if (existingClinics.rows[0].count > 0) {
      console.log("⚠️ Já existem dados no banco. Pulando inserção...");
      client.release();
      return;
    }

    // 1. Criar uma clínica
    console.log("🏥 Criando clínica...");
    const clinicResult = await client.query(
      `
      INSERT INTO clinics (name) 
      VALUES ($1) 
      RETURNING id
    `,
      ["Clínica Teste"],
    );

    const clinicId = clinicResult.rows[0].id;
    console.log(`✅ Clínica criada com ID: ${clinicId}`);

    // 2. Associar o usuário existente à clínica
    console.log("👤 Associando usuário à clínica...");
    const users = await client.query("SELECT id FROM users LIMIT 1");
    if (users.rows.length > 0) {
      const userId = users.rows[0].id;
      await client.query(
        `
        INSERT INTO users_to_clinics (user_id, clinic_id) 
        VALUES ($1, $2)
      `,
        [userId, clinicId],
      );
      console.log(`✅ Usuário ${userId} associado à clínica ${clinicId}`);
    }

    // 3. Criar médicos
    console.log("👨‍⚕️ Criando médicos...");
    const doctors = [
      {
        name: "Dr. João Silva",
        specialty: "Cardiologia",
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: "08:00",
        availableToTime: "18:00",
        appointmentPriceInCents: 15000,
      },
      {
        name: "Dra. Maria Santos",
        specialty: "Dermatologia",
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: "09:00",
        availableToTime: "17:00",
        appointmentPriceInCents: 12000,
      },
      {
        name: "Dr. Pedro Costa",
        specialty: "Ortopedia",
        availableFromWeekDay: 1,
        availableToWeekDay: 6,
        availableFromTime: "07:00",
        availableToTime: "19:00",
        appointmentPriceInCents: 18000,
      },
    ];

    for (const doctor of doctors) {
      await client.query(
        `
        INSERT INTO doctors (
          clinic_id, name, specialty, available_from_week_day, 
          available_to_week_day, available_from_time, available_to_time, 
          appointment_price_in_cents
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          clinicId,
          doctor.name,
          doctor.specialty,
          doctor.availableFromWeekDay,
          doctor.availableToWeekDay,
          doctor.availableFromTime,
          doctor.availableToTime,
          doctor.appointmentPriceInCents,
        ],
      );
    }
    console.log(`✅ ${doctors.length} médicos criados`);

    // 4. Criar pacientes
    console.log("👥 Criando pacientes...");
    const patients = [
      {
        name: "Ana Oliveira",
        email: "ana@email.com",
        phoneNumber: "(11) 99999-1111",
        sex: "female",
      },
      {
        name: "Carlos Ferreira",
        email: "carlos@email.com",
        phoneNumber: "(11) 99999-2222",
        sex: "male",
      },
      {
        name: "Lucia Mendes",
        email: "lucia@email.com",
        phoneNumber: "(11) 99999-3333",
        sex: "female",
      },
      {
        name: "Roberto Alves",
        email: "roberto@email.com",
        phoneNumber: "(11) 99999-4444",
        sex: "male",
      },
    ];

    for (const patient of patients) {
      await client.query(
        `
        INSERT INTO patients (clinic_id, name, email, phone_number, sex) 
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          clinicId,
          patient.name,
          patient.email,
          patient.phoneNumber,
          patient.sex,
        ],
      );
    }
    console.log(`✅ ${patients.length} pacientes criados`);

    // 5. Criar alguns agendamentos
    console.log("📅 Criando agendamentos...");
    const doctorIds = await client.query(
      "SELECT id FROM doctors WHERE clinic_id = $1",
      [clinicId],
    );
    const patientIds = await client.query(
      "SELECT id FROM patients WHERE clinic_id = $1",
      [clinicId],
    );

    if (doctorIds.rows.length > 0 && patientIds.rows.length > 0) {
      const appointments = [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
          doctorId: doctorIds.rows[0].id,
          patientId: patientIds.rows[0].id,
          appointmentPriceInCents: 15000,
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Depois de amanhã
          doctorId: doctorIds.rows[1].id,
          patientId: patientIds.rows[1].id,
          appointmentPriceInCents: 12000,
        },
      ];

      for (const appointment of appointments) {
        await client.query(
          `
          INSERT INTO appointments (
            clinic_id, doctor_id, patient_id, date, appointment_price_in_cents
          ) VALUES ($1, $2, $3, $4, $5)
        `,
          [
            clinicId,
            appointment.doctorId,
            appointment.patientId,
            appointment.date,
            appointment.appointmentPriceInCents,
          ],
        );
      }
      console.log(`✅ ${appointments.length} agendamentos criados`);
    }

    console.log("\n🎉 Dados de teste inseridos com sucesso!");
    console.log("Agora você pode acessar o dashboard e ver os dados reais.");

    client.release();
  } catch (error) {
    console.error("❌ Erro ao inserir dados:", error.message);
  } finally {
    await pool.end();
  }
}

seedData();
