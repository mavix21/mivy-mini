import { defineTable } from "convex/server"
import { v } from "convex/values"

export const interactionsTable = defineTable({
    postId: v.id("posts"),
    userId: v.id("user"),
})
    .index("by_post_and_user", ["postId", "userId"])

export const comments = defineTable({
    postId: v.id("posts"),
    userId: v.id("user"),
    text: v.string(),
    postedAt: v.number(),
})
    .index("by_post", ["postId"])