import { createAuthClient } from "better-auth/react";
import { getAppBaseUrl } from "@/lib/app-base-url";

export const authClient = createAuthClient({
  baseURL: getAppBaseUrl(),
  basePath: "/api/auth",
});
