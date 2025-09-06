'use client';

import { AdminLoginForm } from '@/components/auth/AdminLoginForm';
import { useAuthStore } from '@/store/authStore';
import { LoginFormData } from '@/types/forms';

export default function AdminLoginPage() {
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (data: LoginFormData) => {
    await login({
      email: data.email,
      password: data.password,
    });
    // No need for manual redirect - middleware will handle it
  };

  return (
    <AdminLoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
    />
  );
}
