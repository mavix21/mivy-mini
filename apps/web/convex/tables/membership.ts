import { defineTable } from "convex/server";
import { v } from "convex/values";

export const membershipsTable = defineTable({
    supporterId: v.id("user"),
    creatorId: v.id("creators"),
    tierId: v.id("tiers"),

    // Subscription Logic
    status: v.union(
        v.object({
            kind: v.literal("active"),
            startedAt: v.number(),
            expiresAt: v.number(),
            txHash: v.string(), // Celo Transaction Hash
        }),
        v.object({
            kind: v.literal("expired"),
            expiredAt: v.number(),
        })
    )
})
    .index("by_supporter", ["supporterId"])
    .index("by_creator_and_supporter", ["creatorId", "supporterId"])