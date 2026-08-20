import { getCsrfToken } from '../../utils/csrf';
import { SITE_CONTACT } from '../../constants/siteContact';

export default function ContactFormSection() {
  return (
    <section className="contact-form-section">
      <h1 className="contact-form-title">Contactez-nous</h1>
      <dl className="legal-contact-card" style={{ maxWidth: '32rem', margin: '0 auto 2rem' }}>
        <dt>Recrutement ESN / CH</dt>
        <dd>
          <a href={`mailto:${SITE_CONTACT.recruiterEmail}`}>{SITE_CONTACT.recruiterEmail}</a>
        </dd>
        <dt>Plateforme</dt>
        <dd>
          <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
        </dd>
        <dt>Localisation</dt>
        <dd>
          {SITE_CONTACT.addressLine}, {SITE_CONTACT.country}
        </dd>
      </dl>
      <div className="contact-form-card">
        <form className="contact-form" method="post" action="/contact/">
          <input type="hidden" name="csrfmiddlewaretoken" value={getCsrfToken()} />

          <div className="contact-form-row">
            <input
              className="contact-input"
              type="text"
              name="name"
              placeholder="Votre Nom"
              required
            />
            <input
              className="contact-input"
              type="email"
              name="email"
              placeholder="Votre Email"
              required
            />
          </div>

          <input
            className="contact-input"
            type="text"
            name="subject"
            placeholder="Sujet de votre message"
            required
          />
          <textarea
            className="contact-textarea"
            name="message"
            placeholder="Votre Message"
            rows={5}
            required
          />

          <div className="contact-submit-wrapper">
            <button type="submit" className="contact-submit-btn">
              Envoyer le message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
