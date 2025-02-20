'use client';

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function BlockedUserPage() {
  useEffect(() => {
    console.log("User is blocked. Redirected to /blocked");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6 px-6">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="text-lg text-muted-foreground">
        Your account has been blocked. Please contact support for further assistance.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => signOut({ callbackUrl: "/login" })} variant="destructive">
          Sign Out
        </Button>
        <Button onClick={() => window.location.href = "/"} variant="secondary">
          Go to Home
        </Button>
      </div>
    </div>
  );
}
