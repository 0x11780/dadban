"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/edyen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type SettingsData = {
  reports_enabled: boolean;
  default_tokens_new_user: number;
  tokens_reward_approved_report: number;
  tokens_deduct_false_report: number;
  tokens_deduct_problematic_report: number;
  tokens_reward_invited_activity: number;
};

const LABELS: Record<keyof SettingsData, string> = {
  reports_enabled: "فعال‌سازی دریافت گزارش جدید",
  default_tokens_new_user: "تعداد توکن‌های پیش‌فرض کاربر جدید",
  tokens_reward_approved_report: "تعداد توکن هدیه بعد از تأیید گزارش",
  tokens_deduct_false_report: "تعداد توکن کسر شده در صورت گزارش غلط",
  tokens_deduct_problematic_report: "تعداد توکن کسر شده در صورت گزارش مشکل‌دار",
  tokens_reward_invited_activity: "تعداد توکن هدیه در صورت فعالیت کاربر دعوت‌شده",
};

const defaults: SettingsData = {
  reports_enabled: true,
  default_tokens_new_user: 10,
  tokens_reward_approved_report: 5,
  tokens_deduct_false_report: 3,
  tokens_deduct_problematic_report: 1,
  tokens_reward_invited_activity: 2,
};

export default function AdminSystemSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const { data } = await api.admin.settings.get();
    const raw = data?.data ?? {};
    setSettings({
      reports_enabled:
        typeof raw.reports_enabled === "boolean"
          ? raw.reports_enabled
          : raw.reports_enabled === "true",
      default_tokens_new_user:
        Number(raw.default_tokens_new_user) || defaults.default_tokens_new_user,
      tokens_reward_approved_report:
        Number(raw.tokens_reward_approved_report) || defaults.tokens_reward_approved_report,
      tokens_deduct_false_report:
        Number(raw.tokens_deduct_false_report) || defaults.tokens_deduct_false_report,
      tokens_deduct_problematic_report:
        Number(raw.tokens_deduct_problematic_report) || defaults.tokens_deduct_problematic_report,
      tokens_reward_invited_activity:
        Number(raw.tokens_reward_invited_activity) || defaults.tokens_reward_invited_activity,
    });
  };

  useEffect(() => {
    fetchSettings().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.admin.settings.put({
        reports_enabled: settings.reports_enabled,
        default_tokens_new_user: settings.default_tokens_new_user,
        tokens_reward_approved_report: settings.tokens_reward_approved_report,
        tokens_deduct_false_report: settings.tokens_deduct_false_report,
        tokens_deduct_problematic_report: settings.tokens_deduct_problematic_report,
        tokens_reward_invited_activity: settings.tokens_reward_invited_activity,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6" dir="rtl">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="text-right">
      <h1 className="mb-6 text-2xl font-bold">تنظیمات سیستم</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات توکن و گزارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <Label htmlFor="reports_enabled" className="cursor-pointer">
                {LABELS.reports_enabled}
              </Label>
              <Switch
                id="reports_enabled"
                checked={settings.reports_enabled}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, reports_enabled: v }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_tokens_new_user">{LABELS.default_tokens_new_user}</Label>
              <Input
                id="default_tokens_new_user"
                type="number"
                min={0}
                value={settings.default_tokens_new_user}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    default_tokens_new_user: Math.max(0, Number.parseInt(e.target.value, 10) || 0),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokens_reward_approved_report">
                {LABELS.tokens_reward_approved_report}
              </Label>
              <Input
                id="tokens_reward_approved_report"
                type="number"
                min={0}
                value={settings.tokens_reward_approved_report}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    tokens_reward_approved_report: Math.max(
                      0,
                      Number.parseInt(e.target.value, 10) || 0,
                    ),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokens_deduct_false_report">
                {LABELS.tokens_deduct_false_report}
              </Label>
              <Input
                id="tokens_deduct_false_report"
                type="number"
                min={0}
                value={settings.tokens_deduct_false_report}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    tokens_deduct_false_report: Math.max(
                      0,
                      Number.parseInt(e.target.value, 10) || 0,
                    ),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokens_deduct_problematic_report">
                {LABELS.tokens_deduct_problematic_report}
              </Label>
              <Input
                id="tokens_deduct_problematic_report"
                type="number"
                min={0}
                value={settings.tokens_deduct_problematic_report}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    tokens_deduct_problematic_report: Math.max(
                      0,
                      Number.parseInt(e.target.value, 10) || 0,
                    ),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokens_reward_invited_activity">
                {LABELS.tokens_reward_invited_activity}
              </Label>
              <Input
                id="tokens_reward_invited_activity"
                type="number"
                min={0}
                value={settings.tokens_reward_invited_activity}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    tokens_reward_invited_activity: Math.max(
                      0,
                      Number.parseInt(e.target.value, 10) || 0,
                    ),
                  }))
                }
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
