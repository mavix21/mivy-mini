"use client";

import { useCallback } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  useSignInWithFarcaster,
  type UseSignInWithFarcasterResult,
} from "@/hooks/use-sign-in-with-farcaster";

type SignedInUser = NonNullable<UseSignInWithFarcasterResult["user"]>;

export type SiwfButtonProps = Omit<ButtonProps, "onClick"> & {
  label?: string;
  pendingLabel?: string;
  successLabel?: string;
  showStatusMessage?: boolean;
  onSuccess?: (user: SignedInUser) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
};

export function SiwfButton({
  label = "Sign in with Farcaster",
  pendingLabel = "Signing in…",
  successLabel = "Signed in",
  showStatusMessage = true,
  onSuccess,
  onError,
  disabled,
  type,
  className,
  ...buttonProps
}: SiwfButtonProps) {
  const { signInWithFarcaster, isPending, status, user, error } =
    useSignInWithFarcaster({ onSuccess, onError });

  const handleClick = useCallback(async () => {
    try {
      await signInWithFarcaster();
    } catch {
      // Errors are already surfaced via hook state and optional callbacks.
    }
  }, [signInWithFarcaster]);

  const currentLabel = isPending
    ? pendingLabel
    : status === "success"
      ? successLabel
      : label;

  const statusMessage = (() => {
    if (!showStatusMessage) {
      return null;
    }

    if (status === "error") {
      return error?.message ?? "Unable to sign in. Please try again.";
    }

    if (status === "success") {
      if (user?.name) {
        return `Signed in as ${user.name}`;
      }

      return successLabel;
    }

    return null;
  })();

  const statusTone =
    status === "error" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="grid gap-2">
      <Button
        type={type ?? "button"}
        className={className}
        disabled={disabled || isPending}
        onClick={handleClick}
        {...buttonProps}
      >
        {isPending && <Spinner className="mr-2" />}
        {currentLabel}
      </Button>

      {statusMessage && (
        <p
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`text-sm ${statusTone}`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
