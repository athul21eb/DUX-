"use client";

import { LoginForm } from "@/components/forms/LoginForm";
import Modal from "@/components/shared/interceptinModal";
import { usePathname } from "next/navigation";

export default function LoginModal() {
  const pathname = usePathname();
  if (pathname !== "/login") return null;

  return (
    <Modal>
      <LoginForm />
    </Modal>
  );
}
