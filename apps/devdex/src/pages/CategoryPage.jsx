import { Link, useParams } from 'react-router-dom';
import { Library, ListChecks, ArrowRight } from 'lucide-react';
import {
  findCategory,
  findGroup,
  getDexNumber,
  fmtNum,
  LEVEL_META
} from '../data/catalog.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import NotFound from './NotFound.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { t, tc } = useLanguage();
  const cat = findCategory(categoryId);
  if (!cat) return <NotFound />;
  const group = findGroup(cat.groupId);
  const Icon = cat.icon;
  const catTitle = tc(cat.title);
  const groupTitle = group ? tc(group.title) : '';

  return (
    <>
      <Breadcrumbs
        items={[
          { to: '/', label: t('breadcrumbs.home') },
          group ? { label: groupTitle } : null,
          { label: catTitle }
        ].filter(Boolean)}
      />

      <section
        className="section-banner"
        style={{ '--accent-cat': cat.color }}
      >
        <div className="section-banner__icon">
          <Icon size={36} strokeWidth={2} aria-hidden />
        </div>
        <div className="section-banner__body">
          <span className="eyebrow">
            {group ? `${groupTitle.toUpperCase()} · ` : ''}
            {t('category.banner.code')} <strong>{cat.code}</strong>
          </span>
          <h1>{catTitle}</h1>
          <p className="muted">{tc(cat.desc)}</p>
        </div>
        <div className="section-banner__stat">
          <span className="muted">{t('category.banner.topics')}</span>
          <strong>{cat.topics.length}</strong>
        </div>
      </section>

      <h2 className="section-title">
        <span className="section-title__pill">{t('category.entries.pill')}</span>
        {t('category.entries.title')}
      </h2>
      <div className="grid grid--entries">
        {cat.topics.map((tp) => {
          const TIcon = tp.icon;
          const number = getDexNumber(cat.id, tp.id);
          return (
            <Link
              key={tp.id}
              to={`/topic/${cat.id}/${tp.id}`}
              className="entry-card"
              style={{ '--accent-cat': cat.color }}
            >
              <div className="entry-card__num">{fmtNum(number)}</div>
              <div className="entry-card__icon">
                <TIcon size={22} strokeWidth={2} aria-hidden />
              </div>
              <div className="entry-card__body">
                <span className="entry-card__title">{tc(tp.title)}</span>
                <span className="entry-card__desc">{tc(tp.desc)}</span>
              </div>
              <div className="entry-card__foot">
                <span className="entry-card__levels" aria-label={t('category.entries.levels')}>
                  <span className="entry-card__levels-label">
                    {t('category.entries.levels')}
                  </span>
                  {tp.levels.map((lv) => (
                    <span
                      key={lv}
                      className="entry-card__level-dot"
                      style={{ '--c': LEVEL_META[lv].color }}
                      title={t(`levelMeta.${lv}.label`)}
                    />
                  ))}
                </span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="section-title">
        <span className="section-title__pill">{t('category.practice.pill')}</span>
        {t('category.practice.title')}
      </h2>
      <div className="row">
        <Link
          to={`/flashcards/${cat.id}`}
          className="btn btn--ghost"
        >
          <Library size={16} />{' '}
          {t('category.practice.flashcardsOf', { name: catTitle })}
        </Link>
        <Link to={`/quiz/${cat.id}`} className="btn btn--ghost">
          <ListChecks size={16} />{' '}
          {t('category.practice.quizOf', { name: catTitle })}
        </Link>
      </div>
    </>
  );
}
