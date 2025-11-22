import { env } from "@/lib/env";
import { Id } from "convex/_generated/dataModel";

const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL.replace(/.cloud$/, ".site");

declare module "next-auth" {
    interface Session {
        convexToken: string;
        user: {
            id: Id<"users">;
            fid: number;
            username: string;
            image: string;
            currentWalletAddress: `0x${string}`;
        };
    }

    interface User {
        id: Id<"users">;
        fid: number;
        username: string;
        image: string;
        currentWalletAddress: `0x${string}`;
    }

    interface JWT {
        user: {
            id: Id<"users">;
            fid: number;
            username: string;
            image: string;
            currentWalletAddress: `0x${string}`;
        };
    }
}