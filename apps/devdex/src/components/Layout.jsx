import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Settings, PanelLeft, PanelLeftClose } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import { useT } from '../context/LanguageContext.jsx';

const SIDEBAR_STORAGE = 'devdex:sidebar';
const SIDEBAR_AUTO_OPEN = 1280;

function readInitialSidebar() {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(SIDEBAR_STORAGE);
  if (stored === 'open') return true;
  if (stored === 'closed') return false;
  return window.innerWidth >= SIDEBAR_AUTO_OPEN;
}

export default function Layout({ children, logoSrc }) {
  const [sidebarOpen, setSidebarOpen] = useState(readInitialSidebar);
  const t = useT();

  function toggleSidebar() {
    setSidebarOpen((o) => {
      const next = !o;
      window.localStorage.setItem(SIDEBAR_STORAGE, next ? 'open' : 'closed');
      return next;
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="hamburger"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen
                ? t('layout.sidebar.close')
                : t('layout.sidebar.open')
            }
            aria-expanded={sidebarOpen}
            title={
              sidebarOpen
                ? t('layout.sidebar.close.title')
                : t('layout.sidebar.open.title')
            }
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} aria-hidden />
            ) : (
              <PanelLeft size={18} aria-hidden />
            )}
          </button>

          <Link to="/" className="brand" aria-label={t('layout.brand.aria')}>
            <span className="brand__logo">
              <img src={logoSrc ?? "/app-icons/devdex.png"} alt="" width="38" height="38" />
            </span>
            <span className="brand__text">
              <span className="brand__name">DEVDEX</span>
            </span>
          </Link>

          <SearchBar />

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              'icon-button' + (isActive ? ' icon-button--active' : '')
            }
            aria-label={t('layout.settings.aria')}
            title={t('layout.settings.aria')}
          >
            <Settings size={18} aria-hidden />
          </NavLink>
        </div>
      </header>

      <div className="layout">
        <Sidebar open={sidebarOpen} />
        <main className="main">{children}</main>
      </div>

      <BottomNav />

      <footer className="app-footer">
        <span className="dot dot--live" /> DEVDEX · {t('layout.footer.tagline')}
      </footer>
    </div>
  );
}
