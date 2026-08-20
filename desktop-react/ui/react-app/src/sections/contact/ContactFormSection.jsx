import { getCsrfToken } from '../../utils/csrf';

export default function ContactFormSection() {
  return (
    <section className="contact-form-section">
      <h1 className="contact-form-title">Contactez-nous</h1>
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
