import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

export const doctorsTableColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Médico",
    cell: ({ row }) => {
      const doctor = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={doctor.avatarImageUrl || ""} />
            <AvatarFallback>
              {doctor.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{doctor.name}</div>
            <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "specialty",
    header: "Especialidade",
  },
  {
    accessorKey: "appointmentPriceInCents",
    header: "Valor da Consulta",
    cell: ({ row }) => {
      const price = row.getValue("appointmentPriceInCents") as number;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price / 100);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data de Cadastro",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const doctor = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 