import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { BottomNav } from "@/components/bottom-nav";
import Providers from "@/components/providers";
import { ConvexClientProvider } from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Embed metadata for Farcaster sharing
const frame = {
  version: "1",
  imageUrl: `${appUrl}/opengraph-image.png`,
  button: {
    title: "Start earning",
    action: {
      type: "launch_frame",
      name: "mivy-mini",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export const metadata: Metadata = {
  title: "Mivy",
  description: "The next generation of content creation",
  openGraph: {
    title: "Mivy",
    description: "The next generation of content creation",
    images: [`${appUrl}/opengraph-image.png`],
  },
  other: {
    "fc:frame": JSON.stringify(frame),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar is included on all pages */}
        <div className="relative flex min-h-screen flex-col">
          <ConvexClientProvider>
            <Providers>
              {/* <Navbar /> */}
              <BottomNav />
              <main className="flex-1">{children}</main>
            </Providers>
          </ConvexClientProvider>
        </div>
      </body>
    </html>
  );
}
