import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface WithAuthenticationProps {
  children: ReactNode;
}

async function WithAuthentication({ children }: WithAuthenticationProps) {
  const session = await auth();

  if (!session) {
    redirect("/authentication");
  }

  return <>{children}</>;
}

export default WithAuthentication; 