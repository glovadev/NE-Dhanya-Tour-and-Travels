"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut 
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config";
import { AdminRole, AdminUser } from "@/types";

interface AuthContextType {
  user: { email: string; displayName: string; role: AdminRole } | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; displayName: string; role: AdminRole } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const adminObj = {
            email: fbUser.email || "",
            displayName: fbUser.displayName || fbUser.email?.split("@")[0].toUpperCase() || "Admin",
            role: "super-admin" as AdminRole,
          };
          setUser(adminObj);
        } else {
          setUser(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("ne_dhanya_admin_session");
          }
        }
        setLoading(false);
      });
      return () => unsub();
    } else {
      // Offline / fallback dev mode only when Firebase is not configured
      const stored = typeof window !== "undefined" ? localStorage.getItem("ne_dhanya_admin_session") : null;
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    // If Firebase is configured, strictly authenticate through Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
        const adminObj = {
          email: cred.user.email || email.trim(),
          displayName: cred.user.displayName || cred.user.email?.split("@")[0].toUpperCase() || "Admin",
          role: "super-admin" as AdminRole,
        };
        setUser(adminObj);
        return { success: true };
      } catch (err: any) {
        console.error("Firebase sign in error:", err);
        let errorMsg = err.message || "Failed to sign in";
        if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          errorMsg = "Invalid email or password. Please verify the user exists in your Firebase Console (Authentication > Users).";
        } else if (err.code === "auth/too-many-requests") {
          errorMsg = "Access temporarily disabled due to many failed attempts. Reset your password or try again later.";
        }
        return { success: false, error: errorMsg };
      }
    }

    // Local dev mode fallback (only when Firebase is NOT configured)
    if (email.trim() && pass.length >= 6) {
      const adminObj = {
        email: email.trim(),
        displayName: email.split("@")[0].toUpperCase(),
        role: "super-admin" as AdminRole,
      };
      setUser(adminObj);
      if (typeof window !== "undefined") {
        localStorage.setItem("ne_dhanya_admin_session", JSON.stringify(adminObj));
      }
      return { success: true };
    }

    return { success: false, error: "Please provide a valid email and password" };
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error("Sign out error", e);
      }
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ne_dhanya_admin_session");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
