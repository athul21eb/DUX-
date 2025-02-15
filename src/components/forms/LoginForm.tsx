"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DUX from "../ui/Dux";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";
import { LoginSchema } from "@/validator/authforms";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/actions/auth/login";
import { z } from "zod";
import GoogleLogin from "../shared/google-login";

import toast from "react-hot-toast";
import { CardWrapper } from "../shared/cardWrapper";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    login(data).then((res) => {
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
      }
      if (res.success) {

        toast.success(res.success);
        setLoading(false);
      }
    });
  };
  return (
    <div className={"flex flex-col gap-6 "}>

        <CardWrapper title={<DUX />} description="Welcome Back">
          <div className="flex flex-col gap-4 mb-4">

            <GoogleLogin />
          </div>
          <div className=" relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@email.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <div className="flex justify-between items-center">
        <FormLabel>Password</FormLabel>
        <Link href="forgot-password" className="text-sm hover:text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </div>
      <FormControl>
        <div className="relative">
          <Input
            {...field}
            placeholder="******"
            type={showPassword ? "text" : "password"}
            className="pr-10"
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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
          <div className="text-center text-muted-foreground text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline-offset-4 underline hover:text-primary"

            >
              Sign up
            </Link>
          </div>
          </CardWrapper>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
