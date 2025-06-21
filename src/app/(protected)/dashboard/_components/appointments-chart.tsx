import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AppointmentsChartProps {
  dailyAppointmentsData: Array<{
    date: string;
    appointments: number;
    revenue: number;
  }>;
}

export default function AppointmentsChart({ dailyAppointmentsData }: AppointmentsChartProps) {
  const chartData = dailyAppointmentsData.map((item) => ({
    date: format(new Date(item.date), "dd/MM", { locale: ptBR }),
    appointments: item.appointments,
    revenue: item.revenue / 100, // Convert from cents to reais
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Consultas por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar
              dataKey="appointments"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 