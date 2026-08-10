import { useTranslation } from 'react-i18next';
import CryptoBox from './components/CryptoBox';
import './App.css';

const languages = [
  { code: 'it', label: 'IT' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
];

export default function App({ logoSrc = '/logo.svg' }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="app">
      <header className="header">
        <div className="lang-selector">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              className={`lang-btn${i18n.language.startsWith(code) ? ' lang-active' : ''}`}
              onClick={() => changeLanguage(code)}
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </div>
        <img src={logoSrc} alt="Easy Crypt" className="logo" />
        <h1>{t('app.title')}</h1>
        <p className="subtitle">{t('app.subtitle')}</p>
      </header>
      <main>
        <CryptoBox />
      </main>
      <footer className="footer">
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  );
}
