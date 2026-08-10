import { NavLink, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Library,
  ListChecks,
  TrendingUp
} from 'lucide-react';
import { useT } from '../context/LanguageContext.jsx';

const ITEMS = [
  { to: '/', end: true, labelKey: 'nav.home', icon: HomeIcon, match: (p) => p === '/' },
  {
    to: '/flashcards',
    labelKey: 'nav.flashcards',
    icon: Library,
    match: (p) => p === '/flashcards' || p.startsWith('/flashcards/')
  },
  {
    to: '/quiz',
    labelKey: 'nav.quiz',
    icon: ListChecks,
    match: (p) => p === '/quiz' || p.startsWith('/quiz/')
  },
  {
    to: '/progress',
    labelKey: 'nav.progress',
    icon: TrendingUp,
    match: (p) => p === '/progress'
  }
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const t = useT();
  const activeIndex = ITEMS.findIndex((item) => item.match(pathname));
  const showIndicator = activeIndex >= 0;

  return (
    <nav className="bottom-nav" aria-label={t('nav.mobile.aria')}>
      <ul
        className="bottom-nav__list"
        style={{
          '--items': ITEMS.length,
          '--active-index': Math.max(activeIndex, 0)
        }}
      >
        <span
          className="bottom-nav__indicator"
          data-show={showIndicator}
          aria-hidden
        />
        {ITEMS.map(({ to, end, labelKey, icon: Icon }, i) => {
          const label = t(labelKey);
          return (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  'bottom-nav__item' +
                  (i === activeIndex || isActive
                    ? ' bottom-nav__item--active'
                    : '')
                }
                aria-label={label}
              >
                <span className="bottom-nav__icon">
                  <Icon size={20} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="bottom-nav__label">{label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
