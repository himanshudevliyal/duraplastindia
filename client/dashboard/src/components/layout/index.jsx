"use client";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-client-provider";
import { usePathname } from "next/navigation";
import AppShell from "../app-shell";
import ProtectedRouteProvider from "@/providers/protected-route-provider";
import { publicRoutes } from "@/data/routes";

export default function Layout({ children }) {
  const pathname = usePathname();
  const getContent = () => {
    if (publicRoutes.includes(pathname)) {
      return children;
    }

    return (
      <AuthProvider>
        <ProtectedRouteProvider>
          <AppShell>{children}</AppShell>
        </ProtectedRouteProvider>
      </AuthProvider>
    );
  };

  return <QueryProvider>{getContent()}</QueryProvider>;
}
