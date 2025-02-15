
import DUX from "@/components/ui/Dux";

import { CardWrapper } from "@/components/shared/cardWrapper";
import ForgotPasswordForm from "@/components/forms/forgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CardWrapper title={<DUX />} description="Forgot your password">
        <p className="text-sm text-gray-600 m-4">
          No problem. Just enter your email, and we'll send you a password reset OTP.
        </p>
        <ForgotPasswordForm />
      </CardWrapper>
    </div>
  );
}
