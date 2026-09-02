import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import { Check, User, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  id: Id<"requests">;
  imageURl: string;
  username: string;
  email: string;
};

const Request = ({ id, imageURl, username, email }: Props) => {
  const { mutate: denyRequest, pending: denyPending } = useMutationState(api.request.deny);
  const { mutate: acceoptRequest, pending: acceptPending } = useMutationState(api.request.accept);
  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2 outline outline-primary">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src="{imageURl}" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size={"icon"}
          disabled={denyPending || acceptPending}
          onClick={() => {
            acceoptRequest({ id })
              .then(() => {
                toast.success("Request accepted");
              })
              .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "Something went wrong!");
              });
          }}
        >
          <Check />
        </Button>
        <Button
          size={"icon"}
          disabled={denyPending || acceptPending}
          onClick={() => {
            denyRequest({ id })
              .then(() => {
                toast.success("Request denied");
              })
              .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "Something went wrong!");
              });
          }}
          variant={"destructive"}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
