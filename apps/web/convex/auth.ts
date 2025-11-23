import authSchema from "./betterAuth/schema";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { siwf } from "better-auth-siwf";

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

const decodeJwtAudience = (token: string): string | null => {
  const payload = token.split(".")[1];
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    const decoded = Buffer.from(normalized, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    return typeof parsed.aud === "string" ? parsed.aud : null;
  } catch {
    return null;
  }
};

const wrapSiwfEndpointWithDomainLogging = <
  T extends (...args: any[]) => Promise<any>,
>(
  endpoint: T,
  label: string,
) => {
  const wrapped = (async (inputCtx: any) => {
    const token =
      typeof inputCtx?.body?.token === "string" ? inputCtx.body.token : null;
    const tokenAudience = token ? decodeJwtAudience(token) : null;
    const requestHost = inputCtx?.request?.headers?.get?.("host") ?? null;
    console.warn(
      `[SIWF] ${label} domain comparison | configured=${siwfHostname} | token.aud=${tokenAudience ?? "unknown"} | request.host=${requestHost ?? "unknown"}`,
    );
    return endpoint(inputCtx);
  }) as T & { options?: any; path?: string };

  if (endpoint && typeof endpoint === "function") {
    (wrapped as any).options = (endpoint as any).options;
    (wrapped as any).path = (endpoint as any).path;
  }

  return wrapped as T;
};

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
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
      (() => {
        const siwfPlugin = siwf({
          hostname: siwfHostname,
          allowUserToLink: true,
        });

        if (siwfPlugin.endpoints?.signInWithFarcaster) {
          siwfPlugin.endpoints.signInWithFarcaster =
            wrapSiwfEndpointWithDomainLogging(
              siwfPlugin.endpoints.signInWithFarcaster,
              "signInWithFarcaster",
            );
        }

        if (siwfPlugin.endpoints?.linkFarcaster) {
          siwfPlugin.endpoints.linkFarcaster =
            wrapSiwfEndpointWithDomainLogging(
              siwfPlugin.endpoints.linkFarcaster,
              "linkFarcaster",
            );
        }

        return siwfPlugin;
      })(),
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
