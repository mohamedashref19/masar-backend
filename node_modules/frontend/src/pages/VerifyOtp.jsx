import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VerifyOTPForm from "../features/auth/components/VerifyOTPForm";
import { useVerifyOTP } from "../features/auth/hooks/useVerifyOTP";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const emailForOTP = useSelector((state) => state.auth.emailForOTP);

  const { mutate: verify, isPending } = useVerifyOTP();

  useEffect(() => {
    if (!emailForOTP) {
      navigate("/register");
    }
  }, [emailForOTP, navigate]);

  const handleVerify = (otpCode) => {
    // بنجمع الإيميل من Redux والكود من الفورم ونبعتهم للـ Hook
    verify({ email: emailForOTP, otp: otpCode });
  };

  if (!emailForOTP) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <VerifyOTPForm
        onSubmit={handleVerify}
        isLoading={isPending}
        email={emailForOTP}
      />
    </div>
  );
}
