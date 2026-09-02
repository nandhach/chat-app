"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme/them-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useConversation } from "@/hooks/useConversation";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const MobileNav = () => {
  const paths = useNavigation();
  const { isActive } = useConversation();
  if (isActive) return null;

  return (
    <Card className="fixed bottom-4 flex justify-between items-center h-16 w-[calc(100vw-32px)] px-2 py-4 lg:hidden">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center ">
          {paths.paths.map((path, id) => {
            return (
              <li className="relative" key={id}>
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant={path.active ? "default" : "outline"}>
                        {path.icon}
                      </Button>
                    </TooltipTrigger>
                    {path.count ? <Badge className="absolute left-6 bottom-7 px-2 bg-secondary-foreground ">{path.count}</Badge> : null}
                    <TooltipTrigger>
                      <TooltipContent>{path.name}</TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </Link>
              </li>
            );
          })}

          <li>
            <UserButton />
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
