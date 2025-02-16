"use client";

import { UserProfileForm } from "../forms/updateUserDetailsForm";


export default function UserProfileClient({ user }:{user:any}) {
  return <UserProfileForm user={user} />;
}
