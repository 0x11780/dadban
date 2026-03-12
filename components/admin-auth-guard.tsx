"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/edyen";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    const check = async () => {
      const { data, error } = await api.admin.categories.get();
      if (error) {
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    };
    check();
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center p-6">در حال بارگذاری...</div>
    );
  return <>{children}</>;
}
