import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};

const Header = ({ imageUrl, name, options }: Props) => {
  console.log("Header props:", { imageUrl, name });
  return (
    <Card className="w-full flex rounded-lg items-center p-2 justify-between shadow-sm shadow-primary">
      <div className="flex items-center gap-2">
        <Link href="/conversations" className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="w-10 h-10">
          <AvatarImage src={imageUrl} alt="User Avatar" />
          <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="font-medium">{name}</h2>
      </div>
      <div className="flex gap-2">
        {options ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant="secondary">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option, index) => (
                <DropdownMenuItem key={index} className={cn("cursor-pointer", { "bg-destructive text-destructive-foreground": option.destructive })} onClick={option.onClick}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;
