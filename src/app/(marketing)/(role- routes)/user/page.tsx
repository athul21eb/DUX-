

import { UserProfileForm } from "@/components/forms/updateUserDetailsForm"
import { auth } from "@/lib/auth/auth";
import { User } from "next-auth";

export default async function UserPage() {
 const session = await auth();

 if(!session)return null
 const {user} = session

  return (
    <UserProfileForm user={user}/>
  )
}

