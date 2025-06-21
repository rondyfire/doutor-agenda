import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopDoctorsProps {
  doctors: Array<{
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string;
    appointments: number;
  }>;
}

export default function TopDoctors({ doctors }: TopDoctorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Médicos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={doctor.avatarImageUrl || ""} />
                <AvatarFallback>
                  {doctor.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
              </div>
              <div className="text-sm font-medium">{doctor.appointments} consultas</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 