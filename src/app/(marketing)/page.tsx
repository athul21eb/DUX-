"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div>
      <h1>Home Page</h1>

      <Button
        onClick={() => {
          router.push("/login");
          window.scrollTo(0, 0);
        }}
      >
        login
      </Button>
    </div>
  );
}
