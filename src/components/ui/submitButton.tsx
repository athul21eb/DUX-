"use client";

import "client-only";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importing cn utility for class name handling

interface SubmitButtonProps {
  buttonText: string; // Button text when not pending
  loadingText: string; // Loading text during submission
  className?: string; // Optional custom class for styling
}

export function SubmitButton({
  buttonText,
  loadingText,
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus(); // Tracks form submission status

  return (
    <Button
      type="submit"
      className={cn("w-full", className, { "opacity-50": pending })} // Adding opacity class when pending
      disabled={pending}
    >
      {pending ? loadingText : buttonText}
    </Button>
  );
}
