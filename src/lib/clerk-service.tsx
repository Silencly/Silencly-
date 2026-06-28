import React, { createContext, useContext, useState, useEffect } from "react";
import { ClerkProvider, useUser, useSignIn, useSignUp, useAuth } from "@clerk/clerk-react";

// Types for our unified Auth Context
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
  isClerkActive: boolean;
  clerkPublishableKey: string;
  pendingVerification: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  saveClerkPublishableKey: (key: string) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  verifyEmailCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithSocial: (provider: "google" | "github" | "twitter") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check for active Clerk Publishable Key
export function getClerkKey(): string {
  const meta = import.meta as any;
  return (
    meta.env?.VITE_CLERK_PUBLISHABLE_KEY ||
    meta.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    localStorage.getItem("clerk_publishable_key") ||
    "pk_test_cmVuZXdlZC1nbmF0LTEwLmNsZXJrLmFjY291bnRzLmRldiQ"
  );
}

// Inner provider for Real Clerk
function RealClerkInner({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { signOut: clerkSignOut } = useAuth();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map Clerk user to our custom UserProfile format
  const mappedUser: UserProfile | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        name: clerkUser.fullName || clerkUser.username || "User",
        image: clerkUser.imageUrl,
        provider: clerkUser.externalAccounts?.[0]?.provider || "credentials",
      }
    : null;

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSignInLoaded || !signIn) return;
    try {
      setError(null);
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
      } else {
        setError(`Sign in status: ${result.status}`);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || "Sign in failed.");
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!isSignUpLoaded || !signUp) return;
    try {
      setError(null);
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: name,
      });

      // Prepare email verification strategy
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || "Registration failed.");
      throw err;
    }
  };

  const verifyEmailCode = async (code: string) => {
    if (!isSignUpLoaded || !signUp) return;
    try {
      setError(null);
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        setPendingVerification(false);
      } else {
        setError(`Verification status: ${result.status}`);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || "Verification failed.");
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Sign out failed.");
    }
  };

  const signInWithSocial = async (provider: "google" | "github" | "twitter") => {
    if (!isSignInLoaded || !signIn) return;
    try {
      setError(null);
      const strategy = `oauth_${provider}` as any;
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: window.location.origin + "/sso-callback",
        redirectUrlComplete: window.location.origin,
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || `Failed with ${provider}`);
    }
  };

  const saveClerkPublishableKey = (key: string) => {
    localStorage.setItem("clerk_publishable_key", key);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
        isCheckingAuth: !isUserLoaded,
        isClerkActive: true,
        clerkPublishableKey: getClerkKey(),
        pendingVerification,
        error,
        setError,
        saveClerkPublishableKey,
        signInWithEmail,
        signUpWithEmail,
        verifyEmailCode,
        signOut,
        signInWithSocial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Mock Provider for fallback simulation
function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("clerk_mock_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setIsCheckingAuth(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setIsCheckingAuth(true);
    try {
      setError(null);
      // Simulate validation
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      const mockUser: UserProfile = {
        id: "usr_mock_123",
        email,
        name: email.split("@")[0].toUpperCase(),
        image: "https://i.ibb.co/Q742H44R/gemini-watermark-removed.png",
        provider: "credentials",
      };
      localStorage.setItem("clerk_mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
      throw err;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setIsCheckingAuth(true);
    try {
      setError(null);
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      // Clerk Development mode simulates verification code
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      throw err;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const verifyEmailCode = async (code: string) => {
    setIsCheckingAuth(true);
    try {
      setError(null);
      if (code !== "123456" && code.trim().length !== 6) {
        throw new Error("Invalid verification code. Enter '123456' to pass the simulator!");
      }
      const mockUser: UserProfile = {
        id: "usr_mock_123",
        email: "user@impersio.me",
        name: "Anubhav Sapkota",
        image: "https://i.ibb.co/Q742H44R/gemini-watermark-removed.png",
        provider: "credentials",
      };
      localStorage.setItem("clerk_mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      setPendingVerification(false);
    } catch (err: any) {
      setError(err.message || "Verification code is incorrect.");
      throw err;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("clerk_mock_user");
    setUser(null);
  };

  const signInWithSocial = async (provider: "google" | "github" | "twitter") => {
    setIsCheckingAuth(true);
    try {
      setError(null);
      const mockUser: UserProfile = {
        id: `usr_mock_${provider}`,
        email: `${provider}@impersio.me`,
        name: `${provider === "google" ? "Johan Jovin Cheeran" : "Anubhav Sapkota"}`,
        image: "https://i.ibb.co/Q742H44R/gemini-watermark-removed.png",
        provider: provider,
      };
      localStorage.setItem("clerk_mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err: any) {
      setError(err.message || `Failed to login via ${provider}`);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const saveClerkPublishableKey = (key: string) => {
    localStorage.setItem("clerk_publishable_key", key);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isCheckingAuth,
        isClerkActive: false,
        clerkPublishableKey: "",
        pendingVerification,
        error,
        setError,
        saveClerkPublishableKey,
        signInWithEmail,
        signUpWithEmail,
        verifyEmailCode,
        signOut,
        signInWithSocial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Unified Provider Component
export function ClerkOrMockProvider({ children }: { children: React.ReactNode }) {
  const key = getClerkKey();

  if (key) {
    return (
      <ClerkProvider publishableKey={key}>
        <RealClerkInner>{children}</RealClerkInner>
      </ClerkProvider>
    );
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}

// Unified Hook to use everywhere
export function useAppAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within a ClerkOrMockProvider");
  }
  return context;
}
