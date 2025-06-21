"use client";

import {
  Home,
  Users,
  Calendar,
  Stethoscope,
  Building,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Doutor Agenda</h2>
      </div>
      
      <div className="flex-1 space-y-1 p-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Home size={16} />
          Dashboard
        </Link>
        
        <Link
          href="/dashboard/patients"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Users size={16} />
          Pacientes
        </Link>
        
        <Link
          href="/dashboard/appointments"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Calendar size={16} />
          Consultas
        </Link>
        
        <Link
          href="/dashboard/doctors"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Stethoscope size={16} />
          Médicos
        </Link>
        
        <Link
          href="/dashboard/clinics"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Building size={16} />
          Clínicas
        </Link>
      </div>
      
      <div className="border-t p-2">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut size={16} />
          Sair
        </Link>
      </div>
    </div>
  );
}