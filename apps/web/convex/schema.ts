import { defineSchema } from "convex/server";
import { usersTable } from "./tables/user";
import { typedV } from 'convex-helpers/validators';
import { linkedAccountsTable } from "./tables/linkedAccounts";

const schema = defineSchema({
  users: usersTable,
  linkedAccounts: linkedAccountsTable,
});

export default schema;

export const vv = typedV(schema);
