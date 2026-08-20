import { useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LoginSection from '../sections/auth/LoginSection';
import { ensureCsrfCookie } from '../utils/csrf';

/**
 * Page Authentification - Refactorisée (Niveau 4)
 * Assemble AuthLayout avec LoginSection
 */
export default function LoginPage() {
  useEffect(() => {
    document.body.className = 'login-body';
    ensureCsrfCookie();
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <AuthLayout>
      <LoginSection />
    </AuthLayout>
  );
}
