import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient, User } from "@supabase/supabase-js";

// Retrieve environment variables with fallback values for illustration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Only initialize if we have the config, otherwise we'll handle gracefully so the app doesn't crash
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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

  const isSupabaseConfigured = !!supabase;

  useEffect(() => {
    if (!supabase) {
      // Gracefully set isCheckingAuth to false if not configured
      setIsCheckingAuth(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsCheckingAuth(false);
    });

    // Listen for auth state changes (sign-in, sign-out, etc.)
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
  }, []);

  const mapSupabaseUser = (sbUser: User): UserProfile => {
    const name = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User";
    const image = sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const provider = sbUser.app_metadata?.provider || "email";
    
    return {
      id: sbUser.id,
      email: sbUser.email || "",
      name,
      image,
      provider,
    };
  };

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    if (!supabase) {
      const errMsg = "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env variables.";
      setError(errMsg);
      throw new Error(errMsg);
    }

    const { error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sbError) {
      setError(sbError.message);
      throw sbError;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setError(null);
    if (!supabase) {
      const errMsg = "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env variables.";
      setError(errMsg);
      throw new Error(errMsg);
    }

    const { error: sbError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (sbError) {
      setError(sbError.message);
      throw sbError;
    }
  };

  const signOut = async () => {
    setError(null);
    if (supabase) {
      const { error: sbError } = await supabase.auth.signOut();
      if (sbError) {
        setError(sbError.message);
        return;
      }
    }
    setUser(null);
    window.location.reload();
  };

  const signInWithSocial = async (providerName: "google" | "github") => {
    setError(null);
    if (!supabase) {
      const errMsg = "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env variables.";
      setError(errMsg);
      throw new Error(errMsg);
    }

    // Determine Redirect URL (Dynamic based on host, preferring impersio.me in prod/redirect scenarios)
    const origin = window.location.origin;
    let redirectTo = `${origin}/auth/callback`;
    if (origin.includes("impersio.me")) {
      redirectTo = "https://impersio.me/auth/callback";
    }

    const { error: sbError } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: {
        redirectTo,
      },
    });

    if (sbError) {
      setError(sbError.message);
      throw sbError;
    }
  };

  const updateProfileName = async (newName: string) => {
    setError(null);
    if (!supabase) {
      setUser(prev => prev ? { 
        ...prev, 
        name: newName,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newName)}`
      } : null);
      return;
    }

    const { data, error: sbError } = await supabase.auth.updateUser({
      data: { full_name: newName }
    });

    if (sbError) {
      setError(sbError.message);
      throw sbError;
    }

    if (data?.user) {
      setUser(mapSupabaseUser(data.user));
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
