import { SITE_CONTACT } from '../../constants/siteContact';

export default function ContactInfoSection() {
  return (
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
  );
}
