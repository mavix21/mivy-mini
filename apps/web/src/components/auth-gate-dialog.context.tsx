"use client";

import { createContext, useCallback, useContext, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SiwfButton } from "./siwf-button";

interface AuthGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSignedIn: () => void;
}

type AuthGateDialogMessage = {
  title: string;
  description: string;
};

const AUTH_DIALOG_MESSAGES: Record<
  "default" | "createPost",
  AuthGateDialogMessage
> = {
  default: {
    title: "Sign in to continue",
    description:
      "You need to sign in with Farcaster before accessing this feature.",
  },
  createPost: {
    title: "Sign in to create",
    description: "Create and publish posts once you're signed in.",
  },
};

export type AuthGateDialogKey = keyof typeof AUTH_DIALOG_MESSAGES;

interface OpenOptions {
  key?: AuthGateDialogKey;
  title?: string;
  description?: string;
}

type AuthGateDialogContextValue = {
  open: (options?: OpenOptions) => void;
  close: () => void;
};

const AuthGateDialogContext = createContext<
  AuthGateDialogContextValue | undefined
>(undefined);

function AuthGateDialog({
  open,
  onOpenChange,
  title,
  description,
  onSignedIn,
}: AuthGateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-10/12 p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle className="mx-auto max-w-fit text-center text-4xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-md mt-2 grid gap-8">
            <span className="mx-auto block max-w-[30ch] text-center">
              {description}
            </span>
            <SiwfButton
              className="w-full"
              showStatusMessage
              onSuccess={() => {
                onSignedIn();
              }}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export const AuthGateDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState<AuthGateDialogMessage>(
    AUTH_DIALOG_MESSAGES.default,
  );

  const close = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const open = useCallback((options?: OpenOptions) => {
    const key = options?.key ?? "default";
    const base = AUTH_DIALOG_MESSAGES[key] ?? AUTH_DIALOG_MESSAGES.default;

    setMessage({
      title: options?.title ?? base.title,
      description: options?.description ?? base.description,
    });
    setDialogOpen(true);
  }, []);

  return (
    <AuthGateDialogContext.Provider value={{ open, close }}>
      {children}
      <AuthGateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={message.title}
        description={message.description}
        onSignedIn={close}
      />
    </AuthGateDialogContext.Provider>
  );
};

export const useAuthGateDialog = () => {
  const context = useContext(AuthGateDialogContext);

  if (!context) {
    throw new Error(
      "useAuthGateDialog must be used within a AuthGateDialogProvider",
    );
  }

  return context;
};
