import { Link } from 'react-router-dom';
import { SITE_CONTACT } from '../constants/siteContact';
import { useLocale } from '../i18n/LocaleContext';

export default function SwissHomeBento() {
  const { t } = useLocale();

  return (
    <section className="swiss-bento" aria-labelledby="swiss-bento-title">
      <p className="swiss-bento__eyebrow">{t('home.eyebrow')}</p>
      <h1 id="swiss-bento-title" className="swiss-bento__title">
        {t('home.title')}
      </h1>
      <p className="swiss-bento__lead">{t('home.lead')}</p>

      <div className="swiss-bento__grid">
        <Link to="/cv" className="swiss-bento__card swiss-bento__card--cv">
          <div className="swiss-bento__card-icon">
            <span className="material-symbols-outlined">badge</span>
          </div>
          <h3>{t('home.cvTitle')}</h3>
          <p>{t('home.cvText')}</p>
          <div className="swiss-bento__tags">
            <span className="swiss-bento__tag">Python</span>
            <span className="swiss-bento__tag">Django</span>
            <span className="swiss-bento__tag">React</span>
            <span className="swiss-bento__tag">Azure AI</span>
          </div>
          <span className="swiss-bento__btn swiss-bento__btn--primary" style={{ marginTop: '0.75rem', width: 'fit-content' }}>
            {t('home.cvCta')} →
          </span>
        </Link>

        <Link to="/dashboard" className="swiss-bento__card swiss-bento__card--span-6">
          <div className="swiss-bento__card-icon">
            <span className="material-symbols-outlined">dashboard</span>
          </div>
          <h3>{t('home.dashboardTitle')}</h3>
          <p>{t('home.dashboardText')}</p>
        </Link>

        <div className="swiss-bento__card swiss-bento__card--span-6">
          <div className="swiss-bento__card-icon">
            <span className="material-symbols-outlined">dataset</span>
          </div>
          <h3>{t('home.dataTitle')}</h3>
          <p className="swiss-bento__stat">{t('home.dataStat')}</p>
          <p>{t('home.dataText')}</p>
        </div>

        <div className="swiss-bento__card swiss-bento__card--span-4">
          <div className="swiss-bento__card-icon">
            <span className="material-symbols-outlined">layers</span>
          </div>
          <h3>{t('home.stackTitle')}</h3>
          <p>{t('home.stackText')}</p>
        </div>

        <a
          href={SITE_CONTACT.github}
          target="_blank"
          rel="noopener noreferrer"
          className="swiss-bento__card swiss-bento__card--span-4"
        >
          <div className="swiss-bento__card-icon">
            <span className="material-symbols-outlined">code</span>
          </div>
          <h3>{t('home.githubCta')}</h3>
          <p>github.com/ta-dev-ai</p>
        </a>

        <Link to="/login" className="swiss-bento__card swiss-bento__card--span-4">
          <div className="swiss-bento__card-icon">
            <span className="material-symbols-outlined">login</span>
          </div>
          <h3>{t('home.demoCta')}</h3>
          <p>demo@renovenergy.com</p>
        </Link>
      </div>

      <div className="swiss-bento__actions">
        <Link to="/dashboard" className="swiss-bento__btn swiss-bento__btn--primary">
          {t('home.dashboardCta')}
        </Link>
        <Link to="/cv" className="swiss-bento__btn swiss-bento__btn--secondary">
          {t('home.cvCta')}
        </Link>
        <a
          href={`mailto:${SITE_CONTACT.recruiterEmail}`}
          className="swiss-bento__btn swiss-bento__btn--secondary"
        >
          {SITE_CONTACT.recruiterEmail}
        </a>
      </div>
    </section>
  );
}
