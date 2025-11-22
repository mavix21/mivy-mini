"use client";

import { FarcasterProvider } from "@/contexts/miniapp-context";
import { FrameWalletProvider } from "@/contexts/frame-wallet-context";
import dynamic from "next/dynamic";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false },
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErudaProvider>
      <FrameWalletProvider>
        <FarcasterProvider addMiniAppOnLoad={true}>
          {children}
        </FarcasterProvider>
      </FrameWalletProvider>
    </ErudaProvider>
  );
}
