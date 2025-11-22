import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserByFid = query({
  args: {
    fid: v.number(),
  },
  handler: async (ctx, args) => {
    const linkedAccount = await ctx.db
      .query('linkedAccounts')
      .withIndex('by_farcaster_fid', (q) => q.eq('account.fid', args.fid))
      .unique();

    if (!linkedAccount) {
      return null;
    }

    const user = await ctx.db.get(linkedAccount.userId);

    if (!user) {
      return null;
    }

    return {
      displayName: user.displayName,
      username: user.username,
      pfpUrl: user.pfpUrl,
      bio: user.bio,
      currentWalletAddress: user.currentWalletAddress,
      fid: args.fid,
      userId: user._id,
      linkedAt: linkedAccount.linkedAt,
    };
  },
});

