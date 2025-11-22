import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { omit } from "convex-helpers";
import { vv } from "./schema";

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

export const insertUserByFid = mutation({
  args: {
    ...omit(vv.doc('users').fields, ['_id', '_creationTime']),
    currentWalletAddress: v.optional(v.string()),
    fid: v.number(),
    initializedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const linkedAccount = await ctx.db
      .query('linkedAccounts')
      .withIndex('by_farcaster_fid', (q) => q.eq('account.fid', args.fid))
      .unique();

    if (linkedAccount) {
      const user = await ctx.db.get(linkedAccount.userId);
      if (!user) {
        throw new ConvexError({
          message: 'User not found',
        });
      }

      return linkedAccount.userId;
    }

    const userId = await ctx.db.insert('users', {
      username: args.username,
      pfpUrl: args.pfpUrl,
      displayName: args.displayName,
      bio: args.bio,
      currentWalletAddress: args.currentWalletAddress,
      profileInitializedAt: args.initializedAt,
    });

    await ctx.db.insert('linkedAccounts', {
      account: {
        protocol: 'farcaster',
        fid: args.fid,
        username: args.username,
        pfpUrl: args.pfpUrl,
        displayName: args.displayName,
        bio: args.bio,
        lastSyncedAt: args.initializedAt,
      },
      userId,
      linkedAt: Date.now(),
    });

    return userId;
  },
});

