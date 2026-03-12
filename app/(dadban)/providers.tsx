"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { AppProvider } from "@/context/app-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider dir="rtl">
      <AppProvider>{children}</AppProvider>
    </DirectionProvider>
  );
}
