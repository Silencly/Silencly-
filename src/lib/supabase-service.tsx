import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./supabase-client";
import { safeStorage } from "./safe-storage";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isCheckingAuth: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  isSupabaseConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithSocial: (provider: "google" | "github") => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to map Supabase user metadata to UserProfile
  const mapSupabaseUser = (sbUser: any): UserProfile => {
    const name = sbUser.user_metadata?.display_name || sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "User";
    const image = sbUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const provider = sbUser.app_metadata?.provider || "email";
    
    return {
      id: sbUser.id,
      email: sbUser.email || "",
      name,
      image,
      provider,
    };
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. REAL SUPABASE LISTENERS
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsCheckingAuth(false);
      }).catch(err => {
        console.error("Supabase getSession error:", err);
        setIsCheckingAuth(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsCheckingAuth(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. MOCK LOCAL AUTH LISTENERS (when Supabase is not configured yet)
      const cached = safeStorage.getItem("mock_current_user");
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      }
      setIsCheckingAuth(false);
    }
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    if (isSupabaseConfigured) {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (sbError) {
        setError(sbError.message);
        throw sbError;
      }
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } else {
      // Mock flow
      const mockUsers = JSON.parse(safeStorage.getItem("mock_users") || "[]");
      const matched = mockUsers.find((u: any) => u.email === email && u.password === password);
      if (!matched) {
        const err = new Error("Invalid email or password");
        setError(err.message);
        throw err;
      }
      const profile: UserProfile = {
        id: matched.id,
        email: matched.email,
        name: matched.name,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matched.name)}`,
        provider: "email",
      };
      safeStorage.setItem("mock_current_user", JSON.stringify(profile));
      setUser(profile);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setError(null);
    if (isSupabaseConfigured) {
      const { data, error: sbError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          }
        }
      });
      if (sbError) {
        setError(sbError.message);
        throw sbError;
      }
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } else {
      // Mock flow
      const mockUsers = JSON.parse(safeStorage.getItem("mock_users") || "[]");
      if (mockUsers.some((u: any) => u.email === email)) {
        const err = new Error("User with this email already exists");
        setError(err.message);
        throw err;
      }
      const newId = Math.random().toString(36).substr(2, 9);
      const newUser = { id: newId, email, password, name };
      mockUsers.push(newUser);
      safeStorage.setItem("mock_users", JSON.stringify(mockUsers));

      const profile: UserProfile = {
        id: newId,
        email,
        name,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        provider: "email",
      };
      safeStorage.setItem("mock_current_user", JSON.stringify(profile));
      setUser(profile);
    }
  };

  const signOut = async () => {
    setError(null);
    if (isSupabaseConfigured) {
      const { error: sbError } = await supabase.auth.signOut();
      if (sbError) {
        setError(sbError.message);
      }
    } else {
      safeStorage.removeItem("mock_current_user");
    }
    setUser(null);
    window.location.reload();
  };

  const signInWithSocial = async (providerName: "google" | "github") => {
    setError(null);
    if (isSupabaseConfigured) {
      const { error: sbError } = await supabase.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (sbError) {
        setError(sbError.message);
        throw sbError;
      }
    } else {
      // Mock Social login
      const name = providerName === "google" ? "Google User" : "GitHub User";
      const profile: UserProfile = {
        id: `social_${providerName}_${Math.random().toString(36).substr(2, 9)}`,
        email: `${providerName}_user@example.com`,
        name,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        provider: providerName,
      };
      safeStorage.setItem("mock_current_user", JSON.stringify(profile));
      setUser(profile);
    }
  };

  const updateProfileName = async (newName: string) => {
    setError(null);
    if (isSupabaseConfigured) {
      const { data, error: sbError } = await supabase.auth.updateUser({
        data: { display_name: newName }
      });
      if (sbError) {
        setError(sbError.message);
        throw sbError;
      }
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } else {
      if (!user) return;
      const updated = { ...user, name: newName, image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newName)}` };
      safeStorage.setItem("mock_current_user", JSON.stringify(updated));
      setUser(updated);

      // Update in registered mock users as well
      const mockUsers = JSON.parse(safeStorage.getItem("mock_users") || "[]");
      const idx = mockUsers.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        mockUsers[idx].name = newName;
        safeStorage.setItem("mock_users", JSON.stringify(mockUsers));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isCheckingAuth,
        error,
        setError,
        isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        signInWithSocial,
        updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
