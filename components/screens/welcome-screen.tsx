"use client";

import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, HelpCircle, KeyRound, LogIn } from "lucide-react";
import Image from "next/image";

export function WelcomeScreen() {
  const { navigate } = useApp();

  return (
    <div className="flex flex-1 flex-col items-center p-4 pb-8">
      {/* Logo above the card */}
      <div className="mb-6 flex justify-center">
        <Image src="/icon.svg" alt="دادبان" width={80} height={80} className="h-20 w-20" />
      </div>

      {/* Justice illustration */}
      <div className="text-primary/80 mx-auto mb-6 w-full max-w-[200px]">
        <Image
          src="/justice-illustration.svg"
          alt="ترازو عدالت"
          width={200}
          height={166}
          className="h-auto w-full"
        />
      </div>

      {/* Main card */}
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground text-2xl font-bold">به دادبان خوش آمدید</CardTitle>
          <CardDescription className="mt-2 text-base">
            ما اینجا هستیم تا مطمئن شویم هیچ‌کس از عدالت فرار نمی‌کند
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-center text-sm font-medium">
            ورود به حساب کاربری
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate("invite-code")}
              className="flex-1 justify-center gap-3 py-6 text-base"
              variant="default"
            >
              <KeyRound className="h-5 w-5 shrink-0" />
              کد دعوت
            </Button>
            <Button
              onClick={() => navigate("login")}
              className="flex-1 justify-center gap-3 py-6 text-base"
              variant="secondary"
            >
              <LogIn className="h-5 w-5 shrink-0" />
              ورود با ایمیل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links below the card */}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          onClick={() => navigate("about")}
          variant="link"
          className="text-muted-foreground gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          ما چه کاری انجام می‌دهیم؟
        </Button>
        <Button
          onClick={() => navigate("security")}
          variant="link"
          className="text-muted-foreground gap-2"
        >
          <Shield className="h-4 w-4" />
          نگرانی‌های امنیتی
        </Button>
      </div>
    </div>
  );
}
