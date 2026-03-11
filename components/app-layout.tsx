"use client";

import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Languages } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { state, setLanguage } = useApp();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header - visible on all pages */}
      <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="دادبان" width={36} height={36} className="h-9 w-9" />
            <span className="text-foreground text-lg font-bold">دادبان</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(state.language === "fa" ? "en" : "fa")}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {state.language === "fa" ? "English" : "فارسی"}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col">{children}</main>

      {/* Footer - visible on all pages */}
      <footer className="border-border bg-muted/30 border-t px-4 py-6">
        <div className="text-muted-foreground container mx-auto text-center text-sm">
          <p>
            © {new Date().getFullYear()} دادبان — ما اینجا هستیم تا مطمئن شویم هیچ‌کس از عدالت فرار
            نمی‌کند
          </p>
        </div>
      </footer>
    </div>
  );
}
