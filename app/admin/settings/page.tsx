"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/ip-whitelist");
  }, [router]);
  return <div className="p-6">در حال انتقال...</div>;
}
