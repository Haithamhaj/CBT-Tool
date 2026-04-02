"use client";

import { createContext, useContext } from "react";

type RuntimeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  level: string;
};

type RuntimeAuthContextValue = {
  currentUser: RuntimeUser;
};

const RuntimeAuthContext = createContext<RuntimeAuthContextValue | null>(null);

export function RuntimeAuthProvider({
  children,
  currentUser
}: {
  children: React.ReactNode;
  currentUser: RuntimeUser;
}) {
  return (
    <RuntimeAuthContext.Provider value={{ currentUser }}>
      {children}
    </RuntimeAuthContext.Provider>
  );
}

export function useRuntimeAuth() {
  const context = useContext(RuntimeAuthContext);
  if (!context) {
    throw new Error("useRuntimeAuth must be used inside RuntimeAuthProvider");
  }
  return context;
}
