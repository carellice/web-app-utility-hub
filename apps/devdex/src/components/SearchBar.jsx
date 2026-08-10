import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useT } from '../context/LanguageContext.jsx';

export default function SearchBar() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const t = useT();

  // sync col query string quando cambia route
  useEffect(() => {
    setQ(params.get('q') || '');
  }, [params]);

  // shortcut: "/" focus, "Esc" clear/blur
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function submit(e) {
    e.preventDefault();
    const v = q.trim();
    if (v) navigate(`/search?q=${encodeURIComponent(v)}`);
  }

  function clear() {
    setQ('');
    inputRef.current?.focus();
  }

  return (
    <form className="search-bar" role="search" onSubmit={submit}>
      <Search size={15} className="search-bar__icon" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        className="search-bar__input"
        placeholder={t('search.bar.placeholder')}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label={t('search.bar.aria')}
      />
      {q ? (
        <button
          type="button"
          className="search-bar__clear"
          onClick={clear}
          aria-label={t('search.bar.clear')}
        >
          <X size={14} />
        </button>
      ) : (
        <kbd className="search-bar__kbd" aria-hidden>/</kbd>
      )}
    </form>
  );
}
