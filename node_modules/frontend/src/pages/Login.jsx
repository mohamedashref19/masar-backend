import LoginForm from "../features/auth/components/LoginForm";
import { useLogin } from "../features/auth/hooks/useLogin";

export default function Login() {
  const { mutate: login, isPending } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <LoginForm onSubmit={login} isLoading={isPending} />
    </div>
  );
}
