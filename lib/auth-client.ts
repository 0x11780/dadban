import { createAuthClient } from "better-auth/react";
import { appInviteClient } from "@better-auth-extended/app-invite/client";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  plugins: [appInviteClient()],
});
