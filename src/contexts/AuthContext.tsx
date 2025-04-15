
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: number;
  email: string;
  name: string;
  auth_type: 'operator' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      console.log("Attempting login with:", email);
      
      // For demo purposes, we'll add some hardcoded credentials
      if (email === "admin@example.com" && password === "password") {
        const adminUser: User = {
          id: 1,
          email: "admin@example.com",
          name: "Admin User",
          auth_type: "admin"
        };
        
        setUser(adminUser);
        if (remember) {
          localStorage.setItem("user", JSON.stringify(adminUser));
        }
        
        toast.success("Login effettuato con successo");
        navigate("/dashboard");
        return;
      }
      
      if (email === "operator@example.com" && password === "password") {
        const operatorUser: User = {
          id: 2,
          email: "operator@example.com",
          name: "Operator User",
          auth_type: "operator"
        };
        
        setUser(operatorUser);
        if (remember) {
          localStorage.setItem("user", JSON.stringify(operatorUser));
        }
        
        toast.success("Login effettuato con successo");
        navigate("/tasks");
        return;
      }

      // Try to find operator with given email
      const { data: operators, error: operatorError } = await supabase
        .from('operators')
        .select('*')
        .eq('email', email)
        .single();

      console.log("Supabase response:", operators, operatorError);

      if (operatorError) {
        console.error("Error fetching operator:", operatorError);
        throw new Error("Credenziali non valide");
      }
      
      // For demo purposes, we're using a simple password check
      // In production, you should use proper password hashing
      if (password === "password") {
        // Ensure that auth_type is either 'operator' or 'admin'
        const auth_type = operators.auth_type === 'admin' ? 'admin' : 'operator';
        
        const userData: User = {
          id: operators.id,
          email: operators.email,
          name: operators.name,
          auth_type: auth_type
        };
        
        setUser(userData);
        if (remember) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        toast.success("Login effettuato con successo");
        // Redirect operators to their task page
        if (auth_type === 'operator') {
          navigate("/tasks");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error("Credenziali non valide");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Errore durante il login");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logout effettuato con successo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
