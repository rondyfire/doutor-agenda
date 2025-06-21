import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: string | Date, formatString = "dd/MM/yyyy") {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: ptBR });
}

export function formatDateTime(date: string | Date) {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatTime(date: string | Date) {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "HH:mm", { locale: ptBR });
}

export function getWeekDayName(weekDay: number) {
  const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  return weekDays[weekDay];
} 