import { auth } from "@/lib/auth/auth";

import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    //
    <div className="flex  justify-center items-center w-full">{children}</div>

    // </div>
  );
}
