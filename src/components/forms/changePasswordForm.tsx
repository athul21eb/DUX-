"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { changPasswordSchema } from "@/validator/authforms";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type PasswordFormValues = z.infer<typeof changPasswordSchema>;

interface ChangePasswordProps {
  serverAction: (
    data: z.infer<typeof changPasswordSchema>,
    email: string
  ) => Promise<any>;
  email: string;
}

export default function ChangePasswordForm({
  serverAction,
  email,
}: ChangePasswordProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(changPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    await serverAction(data, email)
      .then((res) => {
        setPending(false);
        if (res.success) {
          toast.success(res.message);
          setPending(false);
          router.push("/login");
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);

        toast.error("Failed to change password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Change Password
        </h2>
        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    className="pr-10 w-full"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onMouseMove={() => setShowPassword(true)} // Show password on mouse move
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    className="pr-10 w-full"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onMouseMove={() => setShowPassword(true)} // Show password on mouse move
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Changing...." : "Change Password"}
        </Button>
      </form>
    </Form>
  );
}
