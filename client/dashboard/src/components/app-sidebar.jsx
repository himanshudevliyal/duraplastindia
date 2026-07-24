"use client";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { sidebarData } from "@/data/routes";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import { useMemo } from "react";

export function AppSidebar({ ...props }) {
  const { user, isUserLoading } = useAuth();
  const filteredRoutes = useMemo(() => {
    return sidebarData
      .filter((route) => route.roles.includes(user?.role))
      .map((item) => {
        return {
          ...item,
          items: item.items.filter(
            (item) => item.roles.includes(user?.role) && item.isVisible,
          ),
        };
      });
  }, [user]);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      {...props}
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarContent>
        {/* <div className="max-h-16 max-w-full p-2">
          <Image
            src="/logo.png"
            width={150}
            height={50}
            alt="Mac auto"
            className="mx-auto"
            loading="lazy"
          />
        </div> */}
        <NavMain items={filteredRoutes} />
      </SidebarContent>

      {/* <SidebarFooter>
        {isUserLoading ? (
          <Skeleton className={"h-12 bg-white/5"} />
        ) : (
          <SidebarUser user={user} />
        )}
      </SidebarFooter> */}
    </Sidebar>
  );
}
