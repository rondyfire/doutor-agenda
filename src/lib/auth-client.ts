import { auth } from "./auth";

export const authClient = {
  signIn: async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign in");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign up");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  signOut: async () => {
    try {
      // Clear any stored tokens or session data
      localStorage.removeItem("token");
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
}; 