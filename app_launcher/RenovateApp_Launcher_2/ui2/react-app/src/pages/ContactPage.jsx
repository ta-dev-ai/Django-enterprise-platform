import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ensureCsrfCookie, getCsrfToken } from '../utils/csrf';
import { SITE_CONTACT } from '../constants/siteContact';

/**
 * Porté depuis templates/pages/contact.html
 */
export default function ContactPage() {
  useEffect(() => {
    ensureCsrfCookie();
  }, []);

  return (
    <main className="contact-main">
      <section className="team-section">
        <h2 className="team-title">Notre Équipe</h2>
        <div className="team-title-underline" />

        <div className="team-grid">
          <article className="team-card">
            <div className="team-avatar-wrapper">
              <img
                src="https://i.pravatar.cc/300?u=sophie"
                className="team-avatar"
                alt="Sophie Martin"
              />
            </div>
            <h3 className="team-name">Sophie Martin</h3>
            <span className="team-role">Responsable QA</span>
            <button type="button" className="team-btn">
              Voir CV
            </button>
          </article>

          <article className="team-card">
            <div className="team-avatar-wrapper">
              <img
                src="https://i.pravatar.cc/300?u=thomas"
                className="team-avatar"
                alt="Thomas Dubois"
              />
            </div>
            <h3 className="team-name">Thomas Dubois</h3>
            <span className="team-role">Chef de projet</span>
            <button type="button" className="team-btn">
              Voir CV
            </button>
          </article>

          <article className="team-card">
            <div className="team-avatar-wrapper">
              <img
                src="https://i.pravatar.cc/300?u=tayier"
                className="team-avatar"
                alt="Tayier Nimait"
              />
            </div>
            <h3 className="team-name">Tayier NIMAIT</h3>
            <span className="team-role">Architecte IA &amp; Systèmes</span>
            <Link
              to="/cv"
              className="team-btn"
              style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
            >
              Voir mon CV
            </Link>
          </article>

          <article className="team-card">
            <div className="team-avatar-wrapper">
              <img
                src="https://i.pravatar.cc/300?u=nicolas"
                className="team-avatar"
                alt="Nicolas Moreau"
              />
            </div>
            <h3 className="team-name">Nicolas Moreau</h3>
            <span className="team-role">Concepteur logiciel</span>
            <button type="button" className="team-btn">
              Voir CV
            </button>
          </article>
        </div>
      </section>

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
    </main>
  );
}
