"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { updateUser } from "@/lib/actions/user";
import { CardWrapper } from "../shared/cardWrapper";
import { DatePicker } from "@/components/ui/date-picker";
import toast from "react-hot-toast";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dob: z.date().optional(),
  image: z.string().optional(),
});

type UserFormValues = z.infer<typeof UserSchema>;

export function UserProfileForm({ user }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "Other",
      dob: user?.dob ? new Date(user.dob) : undefined,
      image: user?.image || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    console.log(data);
    toast.success("Profile updated successfully");
  };

  return (
    <CardWrapper title="User Profile" description="Manage your profile details">
      <div className="flex flex-col items-center mb-4">
        <Image
          src={(selectedImage ? imagePreview : selectedImage) || "/default-avatar.png"}
          width={100}
          height={100}
          className="rounded-full border"
          alt="User Avatar"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="johndoe@email.com" type="email" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123-456-7890" type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Male/Female/Other" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <DatePicker selected={field.value} onChange={field.onChange} placeholderText="Select date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
