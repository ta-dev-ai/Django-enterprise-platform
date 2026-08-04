import { useLocale } from '../i18n/LocaleContext';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="swiss-lang-switcher" role="group" aria-label="Langue">
      <button
        type="button"
        className={locale === 'fr' ? 'is-active' : ''}
        onClick={() => setLocale('fr')}
      >
        FR
      </button>
      <span aria-hidden="true">|</span>
      <button
        type="button"
        className={locale === 'de' ? 'is-active' : ''}
        onClick={() => setLocale('de')}
      >
        DE
      </button>
    </div>
  );
}
