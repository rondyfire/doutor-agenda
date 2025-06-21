import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopSpecialtiesProps {
  topSpecialties: Array<{
    specialty: string;
    appointments: number;
  }>;
}

export default function TopSpecialties({ topSpecialties }: TopSpecialtiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Especialidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSpecialties.map((specialty, index) => (
            <div key={specialty.specialty} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{specialty.specialty}</p>
                </div>
              </div>
              <div className="text-sm font-medium">{specialty.appointments} consultas</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 