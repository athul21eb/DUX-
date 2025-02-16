import UserProfileClient from "@/components/layouts/UserProfileClient";
import { auth } from "@/lib/auth/auth";
import {getUserWithoutIDByEmail } from "@/lib/db/user";

export default async function ProfilePage() {
  const session = await auth();
  if (!session || !session.user?.email) {
    return <div>Not Authorized</div>;
  }

  // Fetch user details from DB using email
  const user = await getUserWithoutIDByEmail(session.user.email);
  if (!user) {
    return <div>User not found</div>;
  }

  return <UserProfileClient user={user} />;
}
