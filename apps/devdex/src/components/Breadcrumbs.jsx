import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useT } from '../context/LanguageContext.jsx';

export default function Breadcrumbs({ items }) {
  const t = useT();
  return (
    <nav className="breadcrumbs" aria-label={t('breadcrumbs.aria')}>
      {items.map((it, i) => (
        <span key={i} className="breadcrumbs__item">
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 ? (
            <ChevronRight size={13} className="breadcrumbs__sep" aria-hidden />
          ) : null}
        </span>
      ))}
    </nav>
  );
}
