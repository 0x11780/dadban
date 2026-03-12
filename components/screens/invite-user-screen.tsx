"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, DADBAN_INVITE_TOKEN_KEY } from "@/lib/edyen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Mail, Copy, Check, UserCheck, Ticket } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { formatTimeAgo } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type InviteCodeItem = {
  id: string;
  code: string;
  used: boolean;
  invitedEmail: string | null;
  isActive: boolean;
  createdAt: string;
};

export function InviteUserScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [myCodes, setMyCodes] = useState<InviteCodeItem[]>([]);
  const [myCodesLoading, setMyCodesLoading] = useState(false);

  const fetchMyCodes = useCallback(async () => {
    setMyCodesLoading(true);
    const { data, error: fetchError } = await api.invite["my-codes"].get();
    setMyCodesLoading(false);
    if (!fetchError && Array.isArray(data)) setMyCodes(data);
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(DADBAN_INVITE_TOKEN_KEY) : null;
    if (token || document.cookie.includes("better-auth")) {
      void fetchMyCodes();
    }
  }, [fetchMyCodes]);

  const copyToClipboard = useCallback(
    async (code?: string) => {
      const target = code ?? inviteCode;
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target);
        setCopiedCode(target);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = target;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopiedCode(target);
        setTimeout(() => setCopiedCode(null), 2000);
      }
    },
    [inviteCode],
  );

  const handlePersonalInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setInviteCode("");
    setIsLoading(true);

    const trimmedEmail = email.trim();
    const body = trimmedEmail
      ? { type: "personal" as const, email: trimmedEmail }
      : { type: "public" as const };
    const token =
      typeof window !== "undefined" ? localStorage.getItem(DADBAN_INVITE_TOKEN_KEY) : null;
    const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, error: inviteError } = await api.invite["invite-user"].post(body, opts);

    if (inviteError?.value) {
      const errMsg = inviteError?.value?.error?.message || "خطا در ارسال دعوت.";
      setError(errMsg);
      setIsLoading(false);
      return;
    }
    if (data && !(data as { ok?: boolean }).ok) {
      setError((data as { error?: string })?.error || "خطا در ارسال دعوت.");
      setIsLoading(false);
      return;
    }

    const res = data as {
      ok?: boolean;
      code?: string;
      registerLink?: string;
    } | null;
    const code = res?.code ?? "";
    setInviteCode(code);
    setSuccessMessage(
      trimmedEmail
        ? `دعوت به ${trimmedEmail} ارسال شد.`
        : "کد دعوت با موفقیت ایجاد شد. این کد یک‌بار مصرف است.",
    );
    setEmail("");
    setIsLoading(false);
    void fetchMyCodes();
  };

  const handlePublicInvite = async () => {
    setError("");
    setSuccessMessage("");
    setInviteCode("");
    setIsLoading(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem(DADBAN_INVITE_TOKEN_KEY) : null;
    const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, error: inviteError } = await api.invite["invite-user"].post(
      { type: "public" },
      opts,
    );

    if (inviteError) {
      const errMsg =
        typeof inviteError === "string"
          ? inviteError
          : (inviteError as { message?: string })?.message || "خطا در ایجاد دعوت عمومی.";
      setError(errMsg);
      setIsLoading(false);
      return;
    }
    const res = data as {
      ok?: boolean;
      code?: string;
      registerLink?: string;
    } | null;
    if (res && !res.ok) {
      setError((res as { error?: string })?.error || "خطا در ایجاد دعوت عمومی.");
      setIsLoading(false);
      return;
    }

    const code = res?.code ?? "";
    setInviteCode(code);
    setSuccessMessage("کد دعوت با موفقیت ایجاد شد. این کد یک‌بار مصرف است.");
    setIsLoading(false);
    void fetchMyCodes();
  };

  return (
    <div className="bg-background flex flex-col items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground text-xl font-bold">دعوت کاربر</CardTitle>
          <CardDescription>ایمیل کاربر را وارد کنید یا یک دعوت عمومی ایجاد کنید</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handlePersonalInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل (خالی = دعوت عمومی)</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="text-destructive bg-destructive/10 flex items-center gap-2 rounded-lg p-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMessage && inviteCode && (
              <div className="space-y-3 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
                  <span className="text-foreground text-sm">{successMessage}</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground relative -bottom-1 text-xs">
                    کد دعوت
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      value={inviteCode}
                      readOnly
                      className="text-center text-lg font-bold tracking-widest"
                      dir="ltr"
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard()}
                        className={
                          copiedCode === inviteCode
                            ? "gap-2 text-green-600! dark:text-green-500!"
                            : "gap-2"
                        }
                      >
                        {copiedCode === inviteCode ? (
                          <>
                            <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
                            <span className="text-green-600 dark:text-green-500">کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            کپی
                          </>
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "در حال ارسال..." : email ? "ارسال دعوت" : "ایجاد دعوت عمومی"}
              </Button>
            </div>

            {/* لیست کدهای دعوت ایجاد شده */}
            <div className="bg-card border-border mt-6 w-full max-w-md overflow-hidden rounded-lg border">
              <div className="border-border border-b px-4 py-3">
                <h3 className="text-foreground flex items-center gap-2 font-semibold">
                  <Ticket className="h-4 w-4" />
                  کدهای دعوت من
                </h3>
              </div>
              {myCodesLoading ? (
                <div className="text-muted-foreground p-6 text-center text-sm">
                  در حال بارگذاری...
                </div>
              ) : myCodes.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-sm">
                  هنوز کد دعوتی ایجاد نکرده‌اید
                </div>
              ) : (
                <ScrollArea className="max-h-[280px]">
                  <ul className="divide-border divide-y">
                    {myCodes.map((item) => (
                      <li
                        key={item.id}
                        className="hover:bg-muted/30 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 px-4 py-4 align-middle transition-colors"
                      >
                        <div className="bg-muted-foreground/5 flex min-w-0 items-center gap-2 rounded-lg py-1">
                          <span
                            className="bg-muted rounded px-2.5 py-1 text-sm font-bold tracking-wider"
                            dir="ltr"
                          >
                            {item.code}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={
                              copiedCode === item.code
                                ? "h-7 shrink-0 gap-1.5 px-2 text-green-600! dark:text-green-500!"
                                : "h-7 shrink-0 gap-1.5 px-2"
                            }
                            onClick={() => copyToClipboard(item.code)}
                          >
                            {copiedCode === item.code ? (
                              <>
                                <Check className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-500" />
                                <span className="text-green-600 dark:text-green-500">کپی شد!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                کپی
                              </>
                            )}
                          </Button>

                          {item.invitedEmail ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p
                                  className="text-muted-foreground col-span-2 mr-auto ml-2 truncate text-xs"
                                  dir="ltr"
                                  title={item.invitedEmail}
                                >
                                  مخصوص
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.invitedEmail}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <p
                              dir="ltr"
                              className="text-muted-foreground col-span-2 mr-auto ml-2 truncate text-xs"
                            >
                              عمومی
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 self-center">
                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                              item.used
                                ? "bg-muted text-muted-foreground"
                                : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                            }`}
                          >
                            {item.used ? (
                              <>
                                <UserCheck className="h-3 w-3 shrink-0" />
                                استفاده شده
                              </>
                            ) : (
                              <>
                                <Ticket className="h-3 w-3 shrink-0" />
                                آزاد
                              </>
                            )}
                          </span>
                          <span className="text-muted-foreground shrink-0 text-[9px]">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>

            <Button type="button" onClick={() => router.back()} variant="ghost" className="w-full">
              بازگشت
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
