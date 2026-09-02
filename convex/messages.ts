import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("(Unauthorized) You must be logged in to access this conversation.");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User Not Found");
    }

    const membership = await ctx.db
      .query("conversationsMembers")
      .withIndex("by_memberId_conversationId", (q) => q.eq("memberId", currentUser._id).eq("conversationId", args.id))
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .collect();

    const messageWithUser = Promise.all(
      messages.map(async (message) => {
        const messageSender = await ctx.db.get(message.senderId);

        if (!messageSender) {
          throw new ConvexError("Could not find message sender");
        }
        return {
          message,
          senderImageUrl: messageSender.imageUrl,
          senderName: messageSender.username,
          isCurrentUser: messageSender._id === currentUser._id,
        };
      })
    );

    return messageWithUser;
  },
});
