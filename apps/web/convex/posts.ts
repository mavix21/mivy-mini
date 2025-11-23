import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();

    const postsWithCreator = await Promise.all(
      posts.map(async (post) => {
        const creator = await ctx.db.get(post.creatorId);
        if (!creator) return null;
        const user = await ctx.db.get(creator._id);
        if (!user) return null;

        return {
          ...post,
          creator: {
            ...creator,
            user,
          },
        };
      }),
    );

    return postsWithCreator.filter((p) => p !== null).sort((a, b) => b.creationTime - a.creationTime);
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.string(),
    type: v.literal("text"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Unauthorized");
    }

    const creator = await ctx.db
      .query("creators")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .first();

    if (!creator) {
      throw new Error("Creator profile not found");
    }

    const fullContent = [args.title, args.summary, args.content]
      .filter((s) => s && s.trim().length > 0)
      .join("\n\n");

    await ctx.db.insert("posts", {
      creatorId: creator._id,
      creationTime: Date.now(),
      body: {
        type: "text",
        content: fullContent,
      },
      stats: {
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
      },
    });
  },
});
