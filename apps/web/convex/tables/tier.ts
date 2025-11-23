import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tiersTable = defineTable({
    creatorId: v.id("creators"),
    name: v.string(), // e.g. "Collector Tier"
    priceUsd: v.number(), // e.g. 1 USDC

    // What does this tier unlock?
    perks: v.object({
        canAccessChat: v.boolean(),
        chatRole: v.union(
            v.literal("observer"),
            v.literal("member"),
            v.literal("vip")
        ),
        canAccessContent: v.boolean(),
    }),
})
    .index("by_creator", ["creatorId"])