"use client";

import { createContext, ReactNode } from "react";

const StoreContext = createContext<Record<string, unknown> | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <StoreContext.Provider value={{}}>{children}</StoreContext.Provider>;
};
