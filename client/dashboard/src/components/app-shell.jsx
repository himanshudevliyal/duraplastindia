"use client";
// Dashboard frame: a floating top bar (logo, section pills, user) and a slim
// left rail with quick actions + theme switch. Sections / actions come from
// data/routes.js and follow the user's role.
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  ExternalLink,
  LogOut,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarData } from "@/data/routes";
import { handleLogout, useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavUser } from "./nav-user";

const WEBSITE_URL = "https://www.duraplastindia.com";

// short labels for the top bar
const SHORT = {
  "Product pages": "Products",
  "Custom Pages": "Pages",
  "Channel Partners": "Partners",
  "Distributor Enquiries": "Distributors",
  "Profile Overview": "Profile",
};

const basePath = (url = "") => url.split("?")[0];

function useNav() {
  const { user, isUserLoading } = useAuth();

  return useMemo(() => {
    const sections = sidebarData.filter((s) => s.roles.includes(user?.role));
    const actions = sections.flatMap((s) =>
      (s.items || [])
        .filter(
          (i) =>
            i.isVisible &&
            i.roles.includes(user?.role) &&
            i.title === "Create",
        )
        .map((i) => ({
          url: i.url,
          icon: s.icon,
          label: `New ${(SHORT[s.title] || s.title).replace(/s$/, "").toLowerCase()}`,
        })),
    );
    return { sections, actions, isUserLoading };
  }, [user, isUserLoading]);
}

function RoundButton({ label, active, className, children, ...props }) {
  const Comp = props.href ? Link : "button";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Comp
          {...(Comp === "button" ? { type: "button" } : {})}
          aria-label={label}
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center rounded-full border transition-all",
            active
              ? "bg-brand border-transparent shadow-md"
              : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
            className,
          )}
          {...props}
        >
          {children}
        </Comp>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function ThemeSwitch({ vertical = true }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  return (
    <div
      className={cn(
        "bg-muted flex gap-1 rounded-full p-1",
        vertical ? "flex-col" : "flex-row",
      )}
    >
      <RoundButton
        label="Dark theme"
        active={isDark}
        onClick={() => setTheme("dark")}
        className="size-9 border-0"
      >
        <Moon className="size-4" />
      </RoundButton>
      <RoundButton
        label="Light theme"
        active={!isDark}
        onClick={() => setTheme("light")}
        className="size-9 border-0"
      >
        <Sun className="size-4" />
      </RoundButton>
    </div>
  );
}

// Dura Plast logo (same file as the website: client/web/public/logo.png)
function Logo({ className }) {
  return (
    <Link href="/dashboard" className={cn("shrink-0", className)}>
      <Image
        src="/duraplast-logo.png"
        alt="Dura Plast"
        width={122}
        height={81}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sections, actions, isUserLoading } = useNav();

  const isActive = (url) => {
    const base = basePath(url);
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-svh">
        {/* ================= Left rail (desktop) ================= */}
        <aside className="bg-card/90 supports-[backdrop-filter]:bg-card/75 fixed top-4 bottom-4 left-4 z-40 hidden w-[68px] flex-col items-center gap-3 rounded-full border py-4 shadow-md backdrop-blur-xl md:flex">
          <RoundButton label="Back" onClick={() => router.back()}>
            <ArrowLeft className="size-[18px]" />
          </RoundButton>

          <div className="bg-border my-1 h-px w-8" />

          {/* full width + padding: the scroll box must not clip the round
              buttons, their "+" badge or their shadow */}
          <div className="scrollbar-hide flex min-h-0 w-full flex-1 flex-col items-center gap-3 overflow-y-auto px-2 py-1.5">
            {actions.map((a) => (
              <RoundButton
                key={a.url}
                href={a.url}
                label={a.label}
                active={pathname === a.url}
              >
                <a.icon className="size-[18px]" />
                <span className="bg-brand absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full">
                  <Plus className="size-3" strokeWidth={3} />
                </span>
              </RoundButton>
            ))}

            <RoundButton
              label="Open website"
              onClick={() => window.open(WEBSITE_URL, "_blank", "noopener")}
            >
              <ExternalLink className="size-[18px]" />
            </RoundButton>
          </div>

          <ThemeSwitch />

          <RoundButton label="Log out" onClick={handleLogout}>
            <LogOut className="size-[18px]" />
          </RoundButton>
        </aside>

        <div className="md:pl-[100px]">
          {/* ================= Top bar ================= */}
          <header className="from-background via-background/85 sticky top-0 z-30 bg-linear-to-b to-transparent px-4 pt-4 pb-3">
            <div className="bg-card/90 supports-[backdrop-filter]:bg-card/75 flex items-center gap-3 rounded-full border py-2 pr-2 pl-5 shadow-md backdrop-blur-xl">
              <Logo />

              <nav className="scrollbar-hide flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2">
                {isUserLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-20 rounded-full" />
                    ))
                  : sections.map((s) => (
                      <Link
                        key={s.url}
                        href={s.url}
                        className={cn(
                          "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
                          isActive(s.url)
                            ? "bg-brand shadow-md"
                            : "text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                        )}
                      >
                        {SHORT[s.title] || s.title}
                      </Link>
                    ))}
              </nav>

              {/* quick actions on small screens */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Create"
                    className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-full md:hidden"
                  >
                    <Plus className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuLabel>Create</DropdownMenuLabel>
                  {actions.map((a) => (
                    <DropdownMenuItem key={a.url} asChild>
                      <Link href={a.url}>
                        <a.icon /> {a.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(WEBSITE_URL, "_blank", "noopener")
                    }
                  >
                    <ExternalLink /> Open website
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <ThemeSwitch vertical={false} />
              </div>

              <NavUser />
            </div>
          </header>

          <main className="px-4 pt-6 pb-10 md:px-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
