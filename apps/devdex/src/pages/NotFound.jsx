import { Link } from 'react-router-dom';
import { Home as HomeIcon, FileQuestion } from 'lucide-react';
import { useT } from '../context/LanguageContext.jsx';

export default function NotFound() {
  const t = useT();
  return (
    <div className="not-found">
      <div className="not-found__icon">
        <FileQuestion size={72} strokeWidth={1.5} />
      </div>
      <h1>{t('notFound.title')}</h1>
      <p className="muted">{t('notFound.body')}</p>
      <Link to="/" className="btn btn--primary" style={{ marginTop: 16 }}>
        <HomeIcon size={16} /> {t('notFound.cta')}
      </Link>
    </div>
  );
}
