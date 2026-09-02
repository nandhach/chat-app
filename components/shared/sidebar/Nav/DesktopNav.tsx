"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme/them-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const DesktopNav = () => {
  const paths = useNavigation();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
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
                    {path.count ? <Badge className="absolute left-6 bottom-7 px-2 bg-secondary-foreground">{path.count}</Badge> : null}
                    <TooltipTrigger>
                      <TooltipContent>{path.name}</TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <ThemeToggle />
          </li>
          <li>
            <UserButton />
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default DesktopNav;
