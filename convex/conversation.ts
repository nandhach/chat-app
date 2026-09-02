import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { currentUser } from "@clerk/nextjs/server";

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

    const conversation = await ctx.db.get(args.id);

    if (!conversation) {
      throw new ConvexError("Conversation Not Found");
    }

    const membership = await ctx.db
      .query("conversationsMembers")
      .withIndex("by_memberId_conversationId", (q) => q.eq("memberId", currentUser._id).eq("conversationId", conversation._id))
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this conversation");
    }

    const allConversationMemberships = await ctx.db
      .query("conversationsMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (conversation.isGroup) {
      return {
        ...conversation,
        otherMember: null,
        otherMembers: allConversationMemberships.map((m) => m.memberId),
      };
    } else {
      const otherMembership = allConversationMemberships.find((m) => m.memberId !== currentUser._id);

      if (!otherMembership) {
        return { ...conversation, otherMember: null, otherMembers: null };
      }

      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      return {
        ...conversation,
        otherMember: { ...otherMemberDetails, lastSeenMessageId: otherMembership.lastSeenMessage },
        otherMembers: null,
      };
    }
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(v.id("users")),
    name: v.string(),
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

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
    });

    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) => {
        await ctx.db.insert("conversationsMembers", {
          memberId,
          conversationId,
        });
      })
    );
  },
});
