import { Link } from 'react-router-dom';
import {
  Trash2,
  TrendingUp,
  Trophy,
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/catalog.js';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ProgressPage() {
  const { state, reset } = useProgress();
  const { t, tc } = useLanguage();

  const totalLevels = CATEGORIES.reduce(
    (sum, c) => sum + c.topics.reduce((s, tp) => s + tp.levels.length, 0),
    0
  );
  const completedCount = Object.values(state.completed).filter(Boolean).length;

  const quizCount = Object.keys(state.quizScores).length;
  const bestQuiz = Object.entries(state.quizScores)
    .map(([id, v]) => ({ id, ...v, pct: (v.score / v.total) * 100 }))
    .sort((a, b) => b.pct - a.pct)[0];

  return (
    <>
      <h1 className="page-title" style={{ marginTop: 0 }}>
        <TrendingUp size={26} aria-hidden /> {t('progress.title')}
      </h1>
      <p className="muted">{t('progress.lead')}</p>

      <div className="progress-stats">
        <div className="stat">
          <div className="stat__icon">
            <CheckCheck size={20} />
          </div>
          <div>
            <div className="stat__value">
              {completedCount}
              <span className="muted" style={{ fontSize: 16 }}>
                {' '}
                / {totalLevels}
              </span>
            </div>
            <div className="stat__label">{t('progress.stat.completed')}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat__icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat__value">{quizCount}</div>
            <div className="stat__label">{t('progress.stat.quizCount')}</div>
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
                ? t('progress.stat.bestQuizNamed', { id: bestQuiz.id })
                : t('progress.stat.bestQuiz')}
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">
        <span className="section-title__pill">{t('progress.sections.pill')}</span>
        {t('progress.sections.title')}
      </h2>
      <div className="grid grid--categories">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const total = c.topics.reduce((s, tp) => s + tp.levels.length, 0);
          const done = c.topics.reduce(
            (s, tp) =>
              s +
              tp.levels.filter(
                (lv) => state.completed[`${c.id}/${tp.id}:${lv}`]
              ).length,
            0
          );
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="dex-card"
              style={{ '--accent-cat': c.color }}
            >
              <div className="dex-card__head">
                <span className="dex-card__num">{c.code}</span>
                <span className="dex-card__code">{pct}%</span>
              </div>
              <div className="dex-card__icon">
                <Icon size={24} strokeWidth={2} aria-hidden />
              </div>
              <div className="dex-card__body">
                <span className="dex-card__title">{tc(c.title)}</span>
                <span className="dex-card__desc">
                  {t('progress.section.levelsOf', { done, total })}
                </span>
              </div>
              <div className="bar" style={{ marginTop: 4 }}>
                <div
                  className="bar__fill"
                  style={{ width: `${pct}%`, background: c.color }}
                />
              </div>
              <div className="dex-card__foot">
                <span>{t('progress.section.details')}</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="section-title">
        <span className="section-title__pill">{t('progress.system.pill')}</span>
        {t('progress.system.title')}
      </h2>
      <button
        className="btn btn--ghost btn--danger"
        onClick={() => {
          if (window.confirm(t('progress.system.resetConfirm'))) {
            reset();
          }
        }}
      >
        <Trash2 size={16} /> {t('progress.system.reset')}
      </button>
    </>
  );
}
