import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { CATEGORIES } from '../data/catalog.js';
import { useLanguage } from '../context/LanguageContext.jsx';

/**
 * Barra filtri categoria: wrap su desktop, scroll orizzontale su mobile.
 *
 * @param {string} basePath - "/flashcards" o "/quiz"
 * @param {string|undefined} activeId - categoryId attivo (undefined = "Tutte")
 */
export default function CategoryFilterBar({ basePath, activeId }) {
  const { t, tc } = useLanguage();
  return (
    <div className="filter-bar" role="navigation" aria-label={t('filter.aria')}>
      <Link
        to={basePath}
        className={`filter-chip filter-chip--all ${
          !activeId ? 'filter-chip--active' : ''
        }`}
        aria-current={!activeId ? 'page' : undefined}
      >
        <Layers size={13} aria-hidden />
        <span>{t('filter.all')}</span>
      </Link>
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const isActive = activeId === c.id;
        return (
          <Link
            key={c.id}
            to={`${basePath}/${c.id}`}
            className={`filter-chip ${isActive ? 'filter-chip--active' : ''}`}
            style={{ '--c-color': c.color }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={13} aria-hidden />
            <span>{tc(c.title)}</span>
          </Link>
        );
      })}
    </div>
  );
}
