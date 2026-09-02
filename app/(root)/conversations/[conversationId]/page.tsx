"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useParams } from "next/navigation";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";

// interface Props {
//   params: {
//     conversationId: string;
//   };
// }

const ConversationPage = () => {
  const params = useParams();
  const parsedConversationId = params?.conversationId as Id<"conversations">;

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  const conversation = useQuery(api.conversation.get, {
    id: parsedConversationId,
  });

  console.log("Conversation ID:", parsedConversationId);
  console.log("Conversation data:", conversation);

  if (conversation === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (conversation === null) {
    return <p className="w-full h-full flex items-center justify-center">No conversation found</p>;
  }

  return (
    <ConversationContainer>
      <RemoveFriendDialog open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen} conversationId={parsedConversationId} />
      <Header
        name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || "Unnamed Conversation"}
        imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl}
        options={
          conversation.isGroup
            ? [
                {
                  label: "Leave Group",
                  onClick: () => setDeleteGroupDialogOpen(true),
                  destructive: false,
                },
                {
                  label: "Delete Group",
                  onClick: () => setLeaveGroupDialogOpen(true),
                  destructive: true,
                },
              ]
            : [
                {
                  label: "Remove Friend",
                  onClick: () => setRemoveFriendDialogOpen(true),
                  destructive: true,
                },
              ]
        }
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
