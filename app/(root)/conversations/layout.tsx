"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMConversationItem from "./_components/DMConversationItem";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  if (!conversations) {
    return (
      <ItemList title="Conversations">
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ItemList>
    );
  }

  return (
    <>
      <ItemList title="Conversations">
        {conversations.length === 0 ? (
          <p className="w-full h-full flex items-center justify-center">No Conversation</p>
        ) : (
          conversations.map((conv) => {
            if (conv.conversation.isGroup) return null;

            return (
              <DMConversationItem
                key={`${conv.conversation._id}-${conv.otherMember?._id || "unknown"}`}
                id={conv.conversation._id}
                imageUrl={conv.otherMember?.imageUrl || ""}
                username={conv.otherMember?.username || ""}
                lastMessageContent={conv.lastMessage?.content}
                lastMessageSender={conv.lastMessage?.sender}
              />
            );
          })
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationLayout;
