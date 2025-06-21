import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

interface WithAuthenticationProps {
  children: React.ReactNode;
  mustHaveClinic?: boolean;
  mustHavePlan?: boolean;
}

export default async function WithAuthentication({
  children,
  mustHaveClinic = false,
  mustHavePlan = false,
}: WithAuthenticationProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (mustHaveClinic && !session.user.clinic) {
    redirect("/clinic-form");
  }

  if (mustHavePlan && !session.user.plan) {
    redirect("/subscription");
  }

  return <>{children}</>;
} 