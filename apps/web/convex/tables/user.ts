import { defineTable } from "convex/server";
import { v } from "convex/values";

    export const userTable = defineTable({
    farcasterFid: v.number(),
    displayName: v.string(),
    username: v.string(),
    pfpUrl: v.optional(v.string()),
    
    walletAddress: v.string(), 
    xmtpAddress: v.string(), 
  })
  .index("by_farcasterFid", ["farcasterFid"])
  .index("by_walletAddress", ["walletAddress"])