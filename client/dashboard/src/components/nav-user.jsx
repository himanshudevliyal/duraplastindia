"use client";

import {
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleLogout, useAuth } from "@/providers/auth-provider";
import { Skeleton } from "./ui/skeleton";

export function NavUser({}) {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) return <Skeleton className={"size-11 rounded-full"} />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account"
          className="bg-muted hover:bg-accent flex shrink-0 items-center gap-2 rounded-full border py-1 pr-4 pl-1 transition-colors"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-brand rounded-full">
              {(user?.fullname || user?.username || "A")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-sm font-medium lg:block">
            {user?.fullname || user?.username || "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                <UserRound className="text-primary" size={15} />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user?.fullname || user?.username || "Account"}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
