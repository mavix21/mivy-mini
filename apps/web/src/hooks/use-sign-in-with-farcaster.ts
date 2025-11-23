import { useCallback, useRef, useState } from "react";
import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import { authClient } from "@/lib/auth-client";
import type { SIWFSignInResponse } from "node_modules/better-auth-siwf/dist/types";

type SiwfActions = typeof authClient.siwf;
type SignInAction = SiwfActions["signInWithFarcaster"];
type SignInPayload = Parameters<SignInAction>[0];
type SignInResponse = Awaited<ReturnType<SignInAction>>;
type VerifyResult = SIWFSignInResponse["data"];
type VerifiedUser = VerifyResult["user"];
type SignInStatus = "idle" | "pending" | "success" | "error";
type SignInState<User> = {
  status: SignInStatus;
  user: User | null;
  error: Error | null;
};

const createInitialState = <User>(): SignInState<User> => ({
  status: "idle",
  user: null,
  error: null,
});

type UseSignInWithFarcasterOptions = {
  /** Optional success callback invoked with the authenticated Better Auth user. */
  onSuccess?: (user: VerifiedUser) => void | Promise<void>;
  /** Optional error callback invoked whenever the sign-in flow fails. */
  onError?: (error: Error) => void | Promise<void>;
};

export type UseSignInWithFarcasterResult = {
  signInWithFarcaster: () => Promise<VerifiedUser>;
  reset: () => void;
  status: SignInStatus;
  isPending: boolean;
  user: VerifiedUser | null;
  error: Error | null;
};

/**
 * Handles the Farcaster Mini App QuickAuth flow and persists the session with Better Auth.
 * Keeps side-effects scoped to the sign-in invocation instead of lifecycle hooks.
 */
export const useSignInWithFarcaster = (
  options?: UseSignInWithFarcasterOptions,
): UseSignInWithFarcasterResult => {
  const [state, setState] = useState(() => createInitialState<VerifiedUser>());
  const inFlightRef = useRef<Promise<VerifiedUser> | null>(null);
  const optionsRef = useRef<UseSignInWithFarcasterOptions | undefined>(options);
  optionsRef.current = options;

  const reset = useCallback(() => {
    setState(createInitialState<VerifiedUser>());
  }, []);

  const signInWithFarcaster = useCallback(async () => {
    if (inFlightRef.current) {
      return inFlightRef.current;
    }

    const signInPromise: Promise<VerifiedUser> = (async () => {
      setState({ status: "pending", user: null, error: null });

      try {
        const isInMiniApp = await miniappSdk.isInMiniApp();
        if (!isInMiniApp) {
          throw new Error(
            "Farcaster sign-in is only available inside the Mini App.",
          );
        }

        const ctx = await miniappSdk.context;
        const tokenResult = await miniappSdk.quickAuth.getToken();
        if (!tokenResult || !tokenResult.token) {
          throw new Error("Failed to get token");
        }

        const payload: SignInPayload = {
          token: tokenResult.token,
          user: {
            ...ctx.user,
            notificationDetails: (ctx.client?.notificationDetails ??
              undefined) as SignInPayload["user"]["notificationDetails"],
          },
        };

        const response = await authClient.signInWithFarcaster(payload);
        const result = unwrapVerifyResponse(response);
        if (!result?.success) {
          const message = response.error?.message ?? "Failed to verify token";
          throw new Error(message);
        }

        const user = result.user;
        setState({ status: "success", user, error: null });
        await optionsRef.current?.onSuccess?.(user);
        return user;
      } catch (unknownError) {
        const normalizedError =
          unknownError instanceof Error
            ? unknownError
            : new Error("Farcaster sign-in failed");

        console.error("[useSignInWithFarcaster]", normalizedError);
        setState({ status: "error", user: null, error: normalizedError });
        await optionsRef.current?.onError?.(normalizedError);
        throw normalizedError;
      } finally {
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = signInPromise;
    return signInPromise;
  }, []);

  return {
    signInWithFarcaster,
    reset,
    status: state.status,
    isPending: state.status === "pending",
    user: state.user,
    error: state.error,
  };
};

const unwrapVerifyResponse = (
  response: SignInResponse,
): VerifyResult | undefined => {
  const body = response.data;
  if (!body) {
    return undefined;
  }

  if (isSiwfEnvelope(body)) {
    return body.data;
  }

  return body as VerifyResult;
};

const isSiwfEnvelope = (value: unknown): value is SIWFSignInResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "data" in (value as Record<string, unknown>);
};
