"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page-container";

export default function ClinicFormPage() {
  const [clinicName, setClinicName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar criação da clínica
      console.log("Criando clínica:", clinicName);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/subscription");
    } catch (error) {
      console.error("Erro ao criar clínica:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Configurar Clínica</PageTitle>
        <PageDescription>
          Configure sua clínica para começar a usar o sistema.
        </PageDescription>
      </PageHeader>
      <PageContent>
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Clínica</CardTitle>
              <CardDescription>
                Digite o nome da sua clínica para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Nome da Clínica</Label>
                  <Input
                    id="clinicName"
                    type="text"
                    placeholder="Ex: Clínica Médica São João"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Clínica"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  );
}