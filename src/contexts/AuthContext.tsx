import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  useEffect(() => {
    // Check for stored user data on app initialization
    const storedUser = localStorage.getItem("bizzleap_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("bizzleap_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - in real app, this would come from your backend
      const mockUser: User = {
        id: "1",
        email,
        name: "John Farmer",
        role: "farmer",
        location: "Nairobi, Kenya",
        businessType: "Organic Vegetables",
        bio: "Passionate farmer growing organic vegetables for the local community.",
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("bizzleap_user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, "id" | "createdAt">,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem("bizzleap_user", JSON.stringify(newUser));
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bizzleap_user");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
