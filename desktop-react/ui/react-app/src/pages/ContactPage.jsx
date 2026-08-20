import { useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import TeamGridSection from '../sections/contact/TeamGridSection';
import ContactFormSection from '../sections/contact/ContactFormSection';
import { ensureCsrfCookie } from '../utils/csrf';

/**
 * Page Contact (Niveau 4)
 * Assemble PublicLayout avec les sections TeamGrid et ContactForm
 */
export default function ContactPage() {
  useEffect(() => {
    ensureCsrfCookie();
  }, []);

  return (
    <PublicLayout>
      <main className="contact-main">
        <TeamGridSection />
        <ContactFormSection />
      </main>
    </PublicLayout>
  );
}
