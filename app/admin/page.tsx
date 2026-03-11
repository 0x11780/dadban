"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/edyen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data, error } = await api.admin.categories.get();
      if (error) router.replace("/");
    };
    check();
  }, [router]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">داشبورد</h1>
      <p className="text-muted-foreground mb-6">به پنل مدیریت دادبان خوش آمدید.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>دسته‌بندی‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">مدیریت دسته‌بندی گزارش‌ها</p>
            <a href="/admin/categories" className="text-primary hover:underline">
              مشاهده →
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>کاربران</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">لیست کاربران سیستم</p>
            <a href="/admin/users" className="text-primary hover:underline">
              مشاهده →
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>اشخاص</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">مدیریت افراد معروف و دستی</p>
            <a href="/admin/people" className="text-primary hover:underline">
              مشاهده →
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>گزارش‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">گزارش‌های ثبت شده</p>
            <a href="/admin/reports" className="text-primary hover:underline">
              مشاهده →
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>لاگ‌های حسابرسی</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">تاریخچه اقدامات</p>
            <a href="/admin/logs" className="text-primary hover:underline">
              مشاهده →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
