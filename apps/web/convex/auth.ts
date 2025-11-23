import authSchema from "./betterAuth/schema";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { siwf } from "better-auth-siwf";
import { nextCookies } from "better-auth/next-js";

const resolveSiteUrl = () => {
  const fallback = "http://localhost:3000";
  const candidate =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : undefined) ??
    fallback;

  try {
    new URL(candidate);
    console.warn("Resolved site URL:", candidate);
    return candidate;
  } catch {
    console.warn("Using fallback site URL:", fallback);
    return fallback;
  }
};

const siteUrl = resolveSiteUrl();
const siwfHostname = new URL(siteUrl).hostname;
console.warn("[SIWF] configured hostname:", siwfHostname);

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    verbose: true,
    local: {
      schema: authSchema,
    },
  },
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
      siwf({
        hostname: siwfHostname,
        allowUserToLink: true,
      }),
      nextCookies(),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
