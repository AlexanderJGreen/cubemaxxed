"use client";

import React, { createContext, useContext } from "react";

const ProContext = createContext<boolean>(false);

export function useIsPro(): boolean {
  return useContext(ProContext);
}

export function ProProvider({
  children,
  isPro,
}: {
  children: React.ReactNode;
  isPro: boolean;
}) {
  return <ProContext.Provider value={isPro}>{children}</ProContext.Provider>;
}
