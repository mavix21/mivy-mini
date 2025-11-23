"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Compass, Plus, User } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";
import {
  useAuthGateDialog,
  type AuthGateDialogKey,
} from "./auth-gate-dialog.context";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { open: openAuthDialog } = useAuthGateDialog();

  const navItems = [
    {
      name: "Explore",
      href: "/",
      icon: Compass,
    },
    {
      name: "Create",
      href: "/create",
      icon: Plus,
      isPrimary: true,
      requiresAuth: true,
      dialogKey: "createPost" as AuthGateDialogKey,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const handleNavigate = useCallback(
    (
      href: string,
      options?: { requiresAuth?: boolean; dialogKey?: AuthGateDialogKey },
    ) => {
      if (options?.requiresAuth) {
        if (isLoading) {
          return;
        }

        if (!isAuthenticated) {
          openAuthDialog({ key: options.dialogKey ?? "default" });
          return;
        }
      }

      router.push(href);
    },
    [isAuthenticated, isLoading, openAuthDialog, router],
  );

  if (pathname === "/create") return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 md:hidden">
      <nav className="flex items-center justify-between gap-2 rounded-full border bg-background/80 p-2 px-6 shadow-lg backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <button
                key={item.href}
                type="button"
                aria-label={item.name}
                onClick={() =>
                  handleNavigate(item.href, {
                    requiresAuth: item.requiresAuth,
                    dialogKey: item.dialogKey,
                  })
                }
                className="mx-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-6 w-6")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
