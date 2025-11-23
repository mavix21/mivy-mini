import { defineSchema } from "convex/server";
import { creatorsTable } from "./tables/creator";
import { interactionsTable, comments } from "./tables/interaction";
import { linkedAccountsTable } from "./tables/linkedAccounts";
import { membershipsTable } from "./tables/membership";
import { postsTable } from "./tables/post";
import { tiersTable } from "./tables/tier";
import { usersTable } from "./tables/user";

export default defineSchema({
    creators: creatorsTable,
    interactions: interactionsTable,
    comments: comments,
    linkedAccounts: linkedAccountsTable,
    memberships: membershipsTable,
    posts: postsTable,
    tiers: tiersTable,
    users: usersTable,
});
