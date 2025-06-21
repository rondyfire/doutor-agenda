import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";
import { Check } from "lucide-react";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.clinic?.id) {
    redirect("/clinic-form");
  }

  const plans = [
    {
      name: "Básico",
      price: "R$ 29,90",
      period: "por mês",
      features: [
        "Até 100 pacientes",
        "Até 5 médicos",
        "Agendamento básico",
        "Suporte por email",
      ],
    },
    {
      name: "Profissional",
      price: "R$ 59,90",
      period: "por mês",
      features: [
        "Pacientes ilimitados",
        "Médicos ilimitados",
        "Agendamento avançado",
        "Relatórios detalhados",
        "Suporte prioritário",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "R$ 99,90",
      period: "por mês",
      features: [
        "Tudo do Profissional",
        "Múltiplas clínicas",
        "API personalizada",
        "Suporte 24/7",
        "Treinamento incluído",
      ],
    },
  ];

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>
            Escolha o plano ideal para sua clínica.
          </PageDescription>
        </PageHeader>
        <PageContent>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.popular && (
                      <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                        Popular
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> {plan.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"}>
                    Escolher Plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SubscriptionPage; 