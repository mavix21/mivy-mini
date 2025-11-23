import { defineTable } from "convex/server";
import { v } from "convex/values";

export const creatorsTable = defineTable({
    userId: v.id("users"),

    // VISUALS (For the "Discover" card & Profile Header)
    // The 3D cube image in your first screenshot
    coverImageUrl: v.optional(v.string()),
    // "Digital artist & creative technologist..."
    bio: v.string(),

    // METADATA & BADGES
    // For the "Art", "Music", "Tech" filter chips
    categories: v.array(v.string()),
    // The orange checkmark in the second screenshot
    isVerified: v.boolean(),

    // LINKS (Under the bio in screenshot 2)
    externalLinks: v.object({
        website: v.optional(v.string()),     // alexrivera.xyz
        twitter: v.optional(v.string()),     // @alex_rivera
        farcaster: v.optional(v.string()),
    }),

    // STATS (To render the numbers instantly without counting every time)
    // Screenshot: "12.5k Followers", "482 Patrons", "84 ETH Volume"
    stats: v.object({
        followerCount: v.number(),
        patronCount: v.number(), // Active subscribers
        totalVolumeUsd: v.number(), // Total money earned
    }),

    // XMTP Integration
    xmtpGroupId: v.optional(v.string()),
})
    .index("by_userId", ["userId"])
    .searchIndex("by_category", { searchField: "categories" }) // Allow searching by "Art", "Tech"
