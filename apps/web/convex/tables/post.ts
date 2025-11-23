import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postsTable = defineTable({
    creatorId: v.id("creators"),
    creationTime: v.number(), // "5h ago"

    // LOCKING MECHANISM
    // Which tier is needed to see the unblurred content?
    // If null, it's a public post.
    requiredTierId: v.optional(v.id("tiers")),

    // CONTENT BODY (Discriminated Union)
    // Supports Text, Image, Video as seen in UI
    body: v.union(
        v.object({
            type: v.literal("text"),
            content: v.string(),
        }),
        v.object({
            type: v.literal("image"),
            caption: v.optional(v.string()),
            filecoinCid: v.string(),
            mimeType: v.string(),
            blurhash: v.optional(v.string()), // For the blurred preview background
        }),
        v.object({
            type: v.literal("video"),
            description: v.optional(v.string()),
            filecoinCid: v.string(),
            encryptionMetadata: v.optional(v.string()),
            thumbnailUrl: v.optional(v.string()), // For the locked state preview
        })
    ),

    // SOCIAL STATS (For the bottom bar icons: 89 Likes, 156 Comments)
    stats: v.object({
        likeCount: v.number(),
        commentCount: v.number(),
        shareCount: v.number(),
    })
})
    .index("by_creator", ["creatorId"])