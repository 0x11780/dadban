"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AcceptInvitationForm } from "@/components/accept-invitation-form";
import { AppProvider } from "@/context/app-context";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");

  if (!invitationId) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-foreground mb-2 text-xl font-bold">لینک دعوت نامعتبر است</h1>
          <p className="text-muted-foreground">لطفاً از لینک ارسال شده در ایمیل خود استفاده کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <AcceptInvitationForm invitationId={invitationId} />
    </AppProvider>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">در حال بارگذاری...</div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
