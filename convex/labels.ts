import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";


export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const userLabel = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

      const systemLabel = await ctx.db
      .query("labels").collect();

      return [...userLabel, ...systemLabel];
    }
    return [];
  },
});

export const getLabelByLabelId = query({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, {labelId}) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const project = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("_id"), labelId))
      .collect();
      return project?.[0] || null;
    }
    return null;
  },
});