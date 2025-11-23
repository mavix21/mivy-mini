import { nextJsHandler } from "@convex-dev/better-auth/nextjs";

export const runtime = "nodejs";

export const { GET, POST } = nextJsHandler();
