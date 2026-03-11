"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, Users, UserCircle, FileText, ScrollText } from "lucide-react";

const navItems = [
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/people", label: "افراد", icon: UserCircle },
  { href: "/admin/reports", label: "گزارش‌ها", icon: FileText },
  { href: "/admin/logs", label: "لاگ‌ها", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="border-border bg-muted/30 flex w-64 flex-col gap-2 border-l p-4">
        <h2 className="mb-4 px-2 text-lg font-bold">پنل ادمین</h2>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-4 py-2 ${
              pathname === href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
