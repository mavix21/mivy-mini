import 'server-only';

import { api } from '@/backend/_generated/api';
import { fetchQuery } from "convex/nextjs"

export async function getUserByFid(fid: number) {
  return await fetchQuery(api.users.getUserByFid, {
    fid,
  });
}
