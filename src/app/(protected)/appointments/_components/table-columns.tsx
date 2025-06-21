import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";

export const appointmentsTableColumns: ColumnDef<any>[] = [
  {
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    accessorKey: "doctor.name",
    header: "Médico",
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return format(new Date(date), "PPP 'às' HH:mm", { locale: ptBR });
    },
  },
  {
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: ({ row }) => {
      const price = row.getValue("appointmentPriceInCents") as number;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price / 100);
    },
  },
  {
    id: "status",
    header: "Status",
    cell: () => {
      return <Badge variant="default">Agendado</Badge>;
    },
  },
]; 