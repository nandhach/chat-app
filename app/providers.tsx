"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import LoadingLogo from "@/components/shared/LoadingLogo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Unauthenticated>
            <div className="flex justify-center items-center min-h-screen">
              <SignIn />
            </div>
          </Unauthenticated>
          <Authenticated>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors />
          </Authenticated>
          <AuthLoading>
            <LoadingLogo />
          </AuthLoading>
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
