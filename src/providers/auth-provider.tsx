"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  session: any; // Using any for now to avoid type conflicts
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <AuthContext.Provider value={{ session, isLoading: isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
