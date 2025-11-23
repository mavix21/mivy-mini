import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { siwfClient } from "better-auth-siwf/client";
import { SIWFClientType } from "node_modules/better-auth-siwf/dist/types";

const client = createAuthClient({
  plugins: [convexClient(), siwfClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const authClient = client as typeof client & SIWFClientType;
