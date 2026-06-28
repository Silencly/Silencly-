import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCaXAXGbSB-FfCEsTqciXPer-6_i3frnQY",
  authDomain: "gen-lang-client-0704079791.firebaseapp.com",
  projectId: "gen-lang-client-0704079791",
  storageBucket: "gen-lang-client-0704079791.firebasestorage.app",
  messagingSenderId: "918837420783",
  appId: "1:918837420783:web:ce7abb4c92b59249f9b11a"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

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
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithSocial: (provider: "google" | "github" | "twitter") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          image: firebaseUser.photoURL || "https://i.ibb.co/Q742H44R/gemini-watermark-removed.png",
          provider: firebaseUser.providerData[0]?.providerId || "credentials",
        });
      } else {
        setUser(null);
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      let msg = err.message;
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        msg = "Invalid email or password.";
      }
      setError(msg);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          name: name,
          image: userCredential.user.photoURL || "https://i.ibb.co/Q742H44R/gemini-watermark-removed.png",
          provider: "credentials",
        });
      }
    } catch (err: any) {
      let msg = err.message;
      if (err.code === "auth/email-already-in-use") {
        msg = "This email is already in use.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Sign out failed.");
    }
  };

  const signInWithSocial = async (providerName: "google" | "github" | "twitter") => {
    try {
      setError(null);
      let provider;
      if (providerName === "google") {
        provider = new GoogleAuthProvider();
      } else if (providerName === "github") {
        provider = new GithubAuthProvider();
      } else {
        provider = new TwitterAuthProvider();
      }

      // Try popup first; if in iframe, fallback to redirect which is configured in Firebase console
      try {
        await signInWithPopup(auth, provider);
      } catch (popupErr: any) {
        console.warn("Popup blocked or failed, trying redirect", popupErr);
        await signInWithRedirect(auth, provider);
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${providerName}.`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isCheckingAuth,
        error,
        setError,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        signInWithSocial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within a FirebaseAuthProvider");
  }
  return context;
}
