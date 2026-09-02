import { ConvexError } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("(Unaothorized)You must be logged in to create a task.");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User Not Found");
    }

    const conversationMemberships = await ctx.db
      .query("conversationsMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversations = Promise.all(
      conversationMemberships?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);

        if (!conversation) {
          throw new ConvexError("Conversation Not Found");
        }

        return conversation;
      })
    );

    const conversationWithDetails = await Promise.all(
      (await conversations).map(async (conversation) => {
        const allConversationMemberships = await ctx.db
          .query("conversationsMembers")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation?._id))
          .collect();

        const lastMessage = await getMessageDetails({ ctx, id: conversation.lastMessageId });

        if (conversation.isGroup) {
          return { conversation, lastMessage };
        } else {
          const otherMembership = allConversationMemberships.filter((membership) => membership.memberId !== currentUser._id)[0];

          if (!otherMembership) {
            console.warn(`No other member found in conversation: ${conversation._id}`);
            return { conversation, otherMember: null };
          }

          const otherMember = await ctx.db.get(otherMembership.memberId);

          return { conversation, otherMember, lastMessage };
        }
      })
    );

    return conversationWithDetails;
  },
});

const getMessageDetails = async ({ ctx, id }: { ctx: QueryCtx | MutationCtx; id: Id<"messages"> | undefined}) => {
  if (!id) return null;

  const message = await ctx.db.get(id);

  if (!message) return null;

  const sender = await ctx.db.get(message.senderId);

  if (!sender) return null;

  const content = getMessageContent(message.type, message.content as unknown as string);

  return { sender: sender.username, content };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    case "image":
      return content; //"[Non-text]"
    default:
      return content;
  }
};
