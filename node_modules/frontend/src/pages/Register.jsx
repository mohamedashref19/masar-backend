import RegisterForm from "../features/auth/components/RegisterForm";
import { useRegister } from "../features/auth/hooks/useRegister";

export default function Register() {
  // بنستدعي الـ Hook اللي عملناه
  const { mutate: registerUser, isPending } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <RegisterForm onSubmit={registerUser} isLoading={isPending} />
    </div>
  );
}
