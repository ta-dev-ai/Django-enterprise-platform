import { useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import TeamGridSection from '../sections/contact/TeamGridSection';
import ContactInfoSection from '../sections/contact/ContactInfoSection';
import ContactFormSection from '../sections/contact/ContactFormSection';
import { ensureCsrfCookie } from '../utils/csrf';

/**
 * Page Contact (< 25 lignes)
 */
export default function ContactPage() {
  useEffect(() => {
    ensureCsrfCookie();
  }, []);

  return (
    <PublicLayout>
      <main className="contact-main">
        <TeamGridSection />
        <ContactInfoSection />
        <ContactFormSection />
      </main>
    </PublicLayout>
  );
}
