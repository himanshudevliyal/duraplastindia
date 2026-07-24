import React from "react";
import Image from "next/image";

export default function AuthLayout({ children, className }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid h-full w-full lg:grid-cols-2">
        <div className="bg-background border-border hidden h-full border-r p-6 md:flex md:items-center md:justify-center">
          <figure className="m-auto max-w-sm">
            <Image
              src="/login.svg"
              alt="Authentication illustration"
              width={200}
              height={200}
              className="h-full w-full object-contain dark:brightness-90 dark:contrast-110"
            />
          </figure>
        </div>
        <div className="bg-background flex h-full items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
