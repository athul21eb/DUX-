"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../ui/ThemeProvider";
import { ViewTransitions } from "next-view-transitions";
import { SessionProvider } from "next-auth/react";
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ViewTransitions>
        <SessionProvider>{children}</SessionProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "dark:bg-black dark:text-white shadow-lg rounded-lg ",
          }}
        />
      </ViewTransitions>
    </ThemeProvider>
  );
}

export default AllProviders;
