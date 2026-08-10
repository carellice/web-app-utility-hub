import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Library,
  ListChecks,
  ArrowRight,
  FileQuestion
} from 'lucide-react';
import {
  search,
  highlight,
  makeSnippet
} from '../data/searchIndex.js';
import { fmtNum, getDexNumber } from '../data/catalog.js';
import LevelChip from '../components/LevelChip.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

function HL({ text, query }) {
  const parts = highlight(text, query);
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="hl">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

const TYPE_META = {
  topic: { labelKey: 'searchPage.group.topic', icon: BookOpen },
  flashcard: { labelKey: 'searchPage.group.flashcard', icon: Library },
  quiz: { labelKey: 'searchPage.group.quiz', icon: ListChecks }
};

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const { t, tc } = useLanguage();

  const results = useMemo(() => (q ? search(q, { limit: 60 }) : []), [q]);

  // raggruppo per tipo
  const groups = useMemo(() => {
    const g = { topic: [], flashcard: [], quiz: [] };
    for (const r of results) g[r.type]?.push(r);
    return g;
  }, [results]);

  return (
    <>
      <h1 className="page-title" style={{ marginTop: 0 }}>
        <Search size={26} aria-hidden /> {t('searchPage.title')}
      </h1>
      {q ? (
        <p className="muted">
          {results.length === 0
            ? t('searchPage.noResultsFor', { q })
            : t('searchPage.resultsFor', { count: results.length, q })}
        </p>
      ) : (
        <p
          className="muted"
          dangerouslySetInnerHTML={{ __html: t('searchPage.hint') }}
        />
      )}

      {q && results.length === 0 && (
        <div className="search-empty">
          <FileQuestion size={48} strokeWidth={1.5} />
          <p className="muted">{t('searchPage.emptyTip')}</p>
        </div>
      )}

      {q && results.length > 0 && (
        <div className="search-groups">
          {Object.entries(groups).map(([type, list]) =>
            list.length === 0 ? null : (
              <section key={type} className="search-group">
                <h2 className="section-title" style={{ marginTop: 28 }}>
                  <span className="section-title__pill">
                    {t(TYPE_META[type].labelKey)}
                  </span>
                  {list.length === 1
                    ? t('searchPage.group.resultsOne', { n: list.length })
                    : t('searchPage.group.resultsMany', { n: list.length })}
                </h2>
                <div className="search-results">
                  {list.map((r, i) => (
                    <ResultRow key={`${type}-${i}`} r={r} q={q} tc={tc} />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      )}
    </>
  );
}

function ResultRow({ r, q, tc }) {
  const TypeIcon = TYPE_META[r.type].icon;
  const cat = r.category;
  const accent = cat?.color || 'var(--accent)';
  const catTitle = cat ? tc(cat.title) : '';

  if (r.type === 'topic') {
    const num = getDexNumber(cat.id, r.topic.id);
    const TopicIcon = r.topic.icon;
    const lv = r.level;
    return (
      <Link to={r.url} className="search-result" style={{ '--accent-cat': accent }}>
        <div className="search-result__icon">
          <TopicIcon size={20} strokeWidth={2} aria-hidden />
        </div>
        <div className="search-result__body">
          <div className="search-result__meta">
            <span className="search-result__num">{fmtNum(num)}</span>
            <span className="search-result__cat">{cat.code} · {catTitle}</span>
            <LevelChip level={lv} size="sm" />
          </div>
          <div className="search-result__title">
            <HL text={tc(r.topic.title)} query={q} />
          </div>
          <div className="search-result__snippet">
            <HL text={makeSnippet(r.snippet, q, 110)} query={q} />
          </div>
        </div>
        <ArrowRight size={16} className="search-result__arrow" />
      </Link>
    );
  }

  return (
    <Link to={r.url} className="search-result" style={{ '--accent-cat': accent }}>
      <div className="search-result__icon">
        <TypeIcon size={20} strokeWidth={2} aria-hidden />
      </div>
      <div className="search-result__body">
        <div className="search-result__meta">
          <span className="search-result__cat">
            {cat?.code} · {catTitle}
          </span>
        </div>
        <div className="search-result__title">
          <HL text={tc(r.title)} query={q} />
        </div>
        {r.snippet ? (
          <div className="search-result__snippet">
            <HL text={makeSnippet(tc(r.snippet), q, 110)} query={q} />
          </div>
        ) : null}
      </div>
      <ArrowRight size={16} className="search-result__arrow" />
    </Link>
  );
}
