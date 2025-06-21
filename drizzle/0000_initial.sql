CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"hashedPassword" text,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "clinics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"priceInCents" integer NOT NULL,
	"maxPatients" integer NOT NULL,
	"maxDoctors" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"sex" text NOT NULL,
	"clinicId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "doctors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"specialty" text NOT NULL,
	"appointmentPriceInCents" integer NOT NULL,
	"availableFromWeekDay" integer NOT NULL,
	"availableToWeekDay" integer NOT NULL,
	"availableFromTime" text NOT NULL,
	"availableToTime" text NOT NULL,
	"avatarImageUrl" text,
	"clinicId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"patientId" text NOT NULL,
	"doctorId" text NOT NULL,
	"appointmentPriceInCents" integer NOT NULL,
	"clinicId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "patients_clinicId_idx" ON "patients" ("clinicId");
CREATE INDEX IF NOT EXISTS "doctors_clinicId_idx" ON "doctors" ("clinicId");
CREATE INDEX IF NOT EXISTS "appointments_clinicId_idx" ON "appointments" ("clinicId");
CREATE INDEX IF NOT EXISTS "appointments_patientId_idx" ON "appointments" ("patientId");
CREATE INDEX IF NOT EXISTS "appointments_doctorId_idx" ON "appointments" ("doctorId"); 