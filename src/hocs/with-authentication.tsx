// Higher ORder Component
// É um componente que recebe um componente e o renderiza
// mas antes de renderizá-lo, executa alguma ação
// ou, passa alguma prop extra pra esse componente

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const WithAuthentication = async ({
  children,
  mustHavePlan = false,
  mustHaveClinic = false,
}: {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("WithAuthentication - Session:", {
    hasUser: !!session?.user,
    userId: session?.user?.id,
    plan: session?.user?.plan,
    hasClinic: !!session?.user?.clinic,
    mustHavePlan,
    mustHaveClinic,
  });

  if (!session?.user) {
    console.log("WithAuthentication - Redirecting to /authentication");
    redirect("/authentication");
  }
  if (mustHavePlan && !session.user.plan) {
    console.log(
      "WithAuthentication - Redirecting to /new-subscription (no plan)",
    );
    redirect("/new-subscription");
  }
  if (mustHaveClinic && !session.user.clinic) {
    console.log("WithAuthentication - Redirecting to /clinic-form (no clinic)");
    redirect("/clinic-form");
  }
  return children;
};

export default WithAuthentication;
