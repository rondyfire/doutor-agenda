import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";

import { doctorsTableColumns } from "./_components/table-columns";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.clinic?.id) {
    redirect("/clinic-form");
  }

  // TODO: Implementar busca de médicos
  const doctors: any[] = [];

  return (
    <WithAuthentication mustHaveClinic mustHavePlan>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Médicos</PageTitle>
            <PageDescription>
              Gerencie os médicos da sua clínica.
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Médico
            </Button>
          </PageActions>
        </PageHeader>
        <PageContent>
          <DataTable columns={doctorsTableColumns} data={doctors} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default DoctorsPage;
