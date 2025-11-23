import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();

    const postsWithCreator = await Promise.all(
      posts.map(async (post) => {
        const creator = await ctx.db.get(post.creatorId);
        if (!creator) return null;
        const user = await ctx.db.get(creator.userId);
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

    return postsWithCreator
      .filter((p) => p !== null)
      .sort((a, b) => b.creationTime - a.creationTime);
  },
});
