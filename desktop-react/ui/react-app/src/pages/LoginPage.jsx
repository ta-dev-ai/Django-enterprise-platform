import { useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LoginSection from '../sections/auth/LoginSection';
import { ensureCsrfCookie } from '../utils/csrf';
import { clearPageBodyClasses, setPageBodyClasses } from '../utils/bodyClass';

/**
 * Page Authentification - Refactorisée (Niveau 4)
 * Assemble AuthLayout avec LoginSection
 */
export default function LoginPage() {
  useEffect(() => {
    setPageBodyClasses('login-body');
    ensureCsrfCookie();
    return () => {
      clearPageBodyClasses();
    };
  }, []);

  return (
    <AuthLayout>
      <LoginSection />
    </AuthLayout>
  );
}
