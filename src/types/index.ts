export interface User {
  id: string;
  name: string;
  email: string;
  clinic?: Clinic;
  plan?: Plan;
}

export interface Clinic {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  priceInCents: number;
  maxPatients: number;
  maxDoctors: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  sex: "male" | "female";
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  appointmentPriceInCents: number;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
  avatarImageUrl?: string;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  date: Date;
  patientId: string;
  doctorId: string;
  appointmentPriceInCents: number;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: Patient;
  doctor?: Doctor;
} 