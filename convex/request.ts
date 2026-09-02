import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const createTask = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("(Unaothorized)You must be logged in to create a task.");
    }

    if (args.email === identity.email) {
      throw new ConvexError("You cannot create a task for yourself.");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User Not Found");
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("User Could Not Be Found");
    }

    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) => q.eq("receiver", receiver._id).eq("sender", currentUser._id))
      .unique();

    if (requestAlreadySent) {
      throw new ConvexError("Request Already Sent");
    }

    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) => q.eq("receiver", currentUser._id).eq("sender", receiver._id))
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError("This User Already Sent You A Request");
    }

    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    if (friends1.some((friend) => friend.user2 === receiver._id) || friends2.some((friend) => friend.user1 === receiver._id)) {
      throw new ConvexError("You Are Already Friends");
    }

    const request = await ctx.db.insert("requests", { sender: currentUser._id, receiver: receiver._id });

    return request;
  },
});

export const deny = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("(Unaothorized)You must be logged in to create a task.");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User Not Found");
    }

    const request = await ctx.db.get(args.id);

    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("Request Not Found");
    }

    await ctx.db.delete(request._id);

    return request;
  },
});

export const accept = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("(Unaothorized)You must be logged in to create a task.");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User Not Found");
    }

    const request = await ctx.db.get(args.id);

    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("Request Not Found");
    }

    const conversationId = await ctx.db.insert("conversations", { isGroup: false });

    await ctx.db.insert("friends", { user1: currentUser._id, user2: request.sender, conversationId });

    await ctx.db.insert("conversationsMembers", { memberId: request.sender, conversationId });
    await ctx.db.insert("conversationsMembers", { memberId: currentUser._id, conversationId });

    await ctx.db.delete(request._id);
  },
});
