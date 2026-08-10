import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ListChecks,
  Library,
  CheckCheck,
  Trophy,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  CATEGORIES,
  GROUPS,
  findTopic,
  fmtNum,
  getDexNumber,
  getTotalEntries
} from '../data/catalog.js';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const TOTAL_LEVELS = CATEGORIES.reduce(
  (s, c) => s + c.topics.reduce((ts, t) => ts + t.levels.length, 0),
  0
);

/** Topic d'ingresso pensati per chi inizia (uno per pilastro tematico). */
const STARTERS = [
  { categoryId: 'java', topicId: 'oop' },
  { categoryId: 'spring', topicId: 'spring-boot' },
  { categoryId: 'database-persistence', topicId: 'acid' },
  { categoryId: 'api-communication', topicId: 'rest-vs-soap-vs-rpc' }
];

export default function Home() {
  const { state } = useProgress();
  const { t, tc } = useLanguage();

  /* aggregazioni progresso */
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const quizCount = Object.keys(state.quizScores).length;
  const bestQuiz = Object.entries(state.quizScores)
    .map(([id, v]) => ({ id, ...v, pct: (v.score / v.total) * 100 }))
    .sort((a, b) => b.pct - a.pct)[0];
  const hasProgress = completedCount > 0 || quizCount > 0;

  return (
    <>
      {/* ---------- Hero compatto ---------- */}
      <section className="home-hero">
        <div className="home-hero__grid" aria-hidden />
        <div className="home-hero__main">
          <span className="eyebrow">{t('home.eyebrow')}</span>
          <h1>
            {t('home.title.before')}{' '}
            <span className="grad">{t('home.title.grad')}</span>{' '}
            {t('home.title.after')}
          </h1>
          <p dangerouslySetInnerHTML={{ __html: t('home.lead') }} />
          <div className="home-hero__cta">
            <Link to="/category/java" className="btn btn--primary">
              <BookOpen size={16} /> {t('home.cta.startJava')}
              <ArrowRight size={16} />
            </Link>
            <Link to="/quiz" className="btn btn--ghost">
              <ListChecks size={16} /> {t('home.cta.quiz')}
            </Link>
            <Link to="/flashcards" className="btn btn--ghost">
              <Library size={16} /> {t('home.cta.flashcards')}
            </Link>
          </div>
        </div>
        <ul className="home-hero__stats" aria-label={t('home.stats.aria')}>
          <li>
            <strong>{getTotalEntries()}</strong>
            <span>{t('home.stats.topics')}</span>
          </li>
          <li>
            <strong>{TOTAL_LEVELS}</strong>
            <span>{t('home.stats.levels')}</span>
          </li>
          <li>
            <strong>{GROUPS.length}</strong>
            <span>{t('home.stats.areas')}</span>
          </li>
        </ul>
      </section>

      {/* ---------- Mini dashboard progressi (solo se ce ne sono) ---------- */}
      {hasProgress && (
        <section className="home-progress">
          <div className="home-progress__head">
            <h2 className="section-title">
              <span className="section-title__pill">{t('home.progress.pill')}</span>
              {t('home.progress.title')}
            </h2>
            <Link to="/progress" className="home-progress__link">
              {t('home.progress.details')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="home-progress__stats">
            <div className="stat">
              <div className="stat__icon">
                <CheckCheck size={20} />
              </div>
              <div>
                <div className="stat__value">
                  {completedCount}
                  <span className="muted" style={{ fontSize: 16 }}>
                    {' '}
                    / {TOTAL_LEVELS}
                  </span>
                </div>
                <div className="stat__label">{t('home.progress.completed')}</div>
              </div>
            </div>
            <div className="stat">
              <div className="stat__icon">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="stat__value">{quizCount}</div>
                <div className="stat__label">{t('home.progress.quizCount')}</div>
              </div>
            </div>
            <div className="stat">
              <div className="stat__icon">
                <Trophy size={20} />
              </div>
              <div>
                <div className="stat__value">
                  {bestQuiz ? `${Math.round(bestQuiz.pct)}%` : '—'}
                </div>
                <div className="stat__label">
                  {bestQuiz
                    ? t('home.progress.bestQuizNamed', { id: bestQuiz.id })
                    : t('home.progress.bestQuiz')}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Da dove iniziare ---------- */}
      <section>
        <h2 className="section-title">
          <span className="section-title__pill">{t('home.start.pill')}</span>
          {t('home.start.title')}
        </h2>
        <div className="grid grid--entries">
          {STARTERS.map(({ categoryId, topicId }) => {
            const found = findTopic(categoryId, topicId);
            if (!found) return null;
            const { category, topic } = found;
            const TIcon = topic.icon;
            const num = getDexNumber(category.id, topic.id);
            return (
              <Link
                key={topicId}
                to={`/topic/${category.id}/${topic.id}`}
                className="entry-card"
                style={{ '--accent-cat': category.color }}
              >
                <div className="entry-card__num">{fmtNum(num)}</div>
                <div className="entry-card__icon">
                  <TIcon size={22} strokeWidth={2} aria-hidden />
                </div>
                <div className="entry-card__body">
                  <span className="entry-card__title">{tc(topic.title)}</span>
                  <span className="entry-card__desc">{tc(topic.desc)}</span>
                </div>
                <div className="entry-card__foot">
                  <span className="entry-card__cat-tag">
                    <span
                      className="entry-card__cat-dot"
                      style={{ background: category.color }}
                    />
                    {tc(category.title)}
                  </span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Esplora le sezioni (vista compatta) ---------- */}
      <section>
        <h2 className="section-title">
          <span className="section-title__pill">{t('home.explore.pill')}</span>
          {t('home.explore.title')}
        </h2>
        <div className="explore-grid">
          {GROUPS.map((group) => {
            const cats = CATEGORIES.filter((c) => c.groupId === group.id);
            const total = cats.reduce((s, c) => s + c.topics.length, 0);
            const GIcon = group.icon;
            return (
              <article
                key={group.id}
                className="explore-card"
                style={{ '--accent-group': group.color }}
              >
                <header className="explore-card__head">
                  <span className="explore-card__icon">
                    <GIcon size={18} strokeWidth={2} aria-hidden />
                  </span>
                  <div className="explore-card__title-wrap">
                    <h3 className="explore-card__title">{tc(group.title)}</h3>
                    <span className="explore-card__count">
                      {t('home.explore.topicCount', { count: total })}
                    </span>
                  </div>
                </header>
                <ul className="explore-card__cats">
                  {cats.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/category/${c.id}`}
                        className="explore-card__cat"
                        style={{ '--c-color': c.color }}
                      >
                        <span className="explore-card__cat-dot" />
                        <span className="explore-card__cat-name">
                          {tc(c.title)}
                        </span>
                        <span className="explore-card__cat-count">
                          {c.topics.length}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------- Tip footer ---------- */}
      <section className="home-tip">
        <Sparkles size={16} aria-hidden />
        <span>
          <strong>{t('home.tip.label')}</strong> —{' '}
          <span dangerouslySetInnerHTML={{ __html: t('home.tip.body') }} />
        </span>
      </section>
    </>
  );
}
