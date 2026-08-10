import { NavLink } from 'react-router-dom';
import {
  Home as HomeIcon,
  Library,
  ListChecks,
  TrendingUp,
  Search
} from 'lucide-react';
import { GROUPS, CATEGORIES } from '../data/catalog.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const NAV = [
  { to: '/', end: true, labelKey: 'nav.home', icon: HomeIcon },
  { to: '/flashcards', labelKey: 'nav.flashcards', icon: Library },
  { to: '/quiz', labelKey: 'nav.quiz', icon: ListChecks },
  { to: '/progress', labelKey: 'nav.progress', icon: TrendingUp }
];

export default function Sidebar({ open }) {
  const { t, tc } = useLanguage();
  return (
    <aside
      className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}
      aria-hidden={!open}
    >
      <div className="sidebar__inner">
        <section className="sidebar__section">
          <div className="sidebar__label">{t('nav.section.navigation')}</div>
          <nav className="sidebar__nav" aria-label={t('nav.main.aria')}>
            {NAV.map(({ to, end, labelKey, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
                }
              >
                <Icon size={16} aria-hidden />
                <span>{t(labelKey)}</span>
              </NavLink>
            ))}
          </nav>
        </section>

        <section className="sidebar__section">
          <div className="sidebar__label">{t('nav.section.dex')}</div>
          <div className="sidebar__groups">
            {GROUPS.map((group) => {
              const cats = CATEGORIES.filter((c) => c.groupId === group.id);
              const GIcon = group.icon;
              return (
                <div
                  key={group.id}
                  className="sidebar__group"
                  style={{ '--g-color': group.color }}
                >
                  <div className="sidebar__group-title">
                    <span className="sidebar__group-icon">
                      <GIcon size={13} aria-hidden />
                    </span>
                    <span>{tc(group.title)}</span>
                  </div>
                  <ul className="sidebar__cats">
                    {cats.map((c) => (
                      <li key={c.id}>
                        <NavLink
                          to={`/category/${c.id}`}
                          className={({ isActive }) =>
                            'sidebar__cat' +
                            (isActive ? ' sidebar__cat--active' : '')
                          }
                          style={{ '--c-color': c.color }}
                        >
                          <span className="sidebar__cat-dot" />
                          <span className="sidebar__cat-name">{tc(c.title)}</span>
                          <span className="sidebar__cat-count">
                            {c.topics.length}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <div className="sidebar__hint">
          <Search size={12} aria-hidden /> {t('nav.search.hint.press')}{' '}
          <kbd className="kbd">/</kbd> {t('nav.search.hint.toSearch')}
        </div>
      </div>
    </aside>
  );
}
