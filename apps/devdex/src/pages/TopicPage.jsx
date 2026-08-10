import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Lock as LockIcon } from 'lucide-react';
import {
  findTopic,
  findGroup,
  LEVEL_META,
  fmtNum,
  getDexNumber
} from '../data/catalog.js';
import { hasMdx } from '../data/mdxLoader.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import LevelChip from '../components/LevelChip.jsx';
import NotFound from './NotFound.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function TopicPage() {
  const { categoryId, topicId } = useParams();
  const found = findTopic(categoryId, topicId);
  const { isCompleted } = useProgress();
  const { t, tc } = useLanguage();
  if (!found) return <NotFound />;
  const { category, topic } = found;
  const group = findGroup(category.groupId);
  const Icon = topic.icon;
  const number = getDexNumber(category.id, topic.id);

  const catTitle = tc(category.title);
  const topicTitle = tc(topic.title);

  const doneCount = topic.levels.filter((lv) =>
    isCompleted(`${category.id}/${topic.id}`, lv)
  ).length;

  return (
    <>
      <Breadcrumbs
        items={[
          { to: '/', label: t('breadcrumbs.home') },
          group ? { label: tc(group.title) } : null,
          { to: `/category/${category.id}`, label: catTitle },
          { label: topicTitle }
        ].filter(Boolean)}
      />

      <section
        className="entry-banner"
        style={{ '--accent-cat': category.color }}
      >
        <div className="entry-banner__numblock">
          <span className="eyebrow">{t('topic.banner.entry')}</span>
          <strong>{fmtNum(number)}</strong>
        </div>
        <div className="entry-banner__icon">
          <Icon size={44} strokeWidth={2} aria-hidden />
        </div>
        <div className="entry-banner__body">
          <span className="entry-banner__cat">
            <span className="dot" style={{ background: category.color }} />
            {catTitle} · {category.code}
          </span>
          <h1>{topicTitle}</h1>
          <p className="muted">{tc(topic.desc)}</p>
        </div>
        <div className="entry-banner__progress">
          <span className="muted">{t('topic.banner.progress')}</span>
          <strong>
            {doneCount} / {topic.levels.length}
          </strong>
          <div className="bar">
            <div
              className="bar__fill"
              style={{
                width: `${(doneCount / topic.levels.length) * 100}%`,
                background: category.color
              }}
            />
          </div>
        </div>
      </section>

      <h2 className="section-title">
        <span className="section-title__pill">{t('topic.levels.pill')}</span>
        {t('topic.levels.title')}
      </h2>
      <div className="levels">
        {topic.levels.map((level) => {
          const meta = LEVEL_META[level];
          const exists = hasMdx(topic.folder || category.id, topic.id, level);
          const done = isCompleted(`${category.id}/${topic.id}`, level);
          const LIcon = meta.icon;
          return (
            <Link
              key={level}
              to={`/topic/${category.id}/${topic.id}/${level}`}
              className={`level-card ${!exists ? 'level-card--locked' : ''}`}
              aria-disabled={!exists}
              style={{
                '--level-color': meta.color,
                pointerEvents: exists ? 'auto' : 'none'
              }}
            >
              <div className="level-card__head">
                <LevelChip level={level} />
                {done ? (
                  <span className="badge badge--done">
                    {t('topic.level.completed')}
                  </span>
                ) : !exists ? (
                  <span className="badge badge--locked">
                    <LockIcon size={11} /> {t('topic.level.soon')}
                  </span>
                ) : null}
              </div>
              <div className="level-card__icon">
                <LIcon size={26} strokeWidth={2} aria-hidden />
              </div>
              <div className="level-card__title">
                {t(`levelMeta.${level}.label`)}
              </div>
              <div className="level-card__desc">
                {t(`levelMeta.${level}.desc`)}
              </div>
              <div className="level-card__footer">
                <span>
                  {exists ? t('topic.level.open') : t('topic.level.upcoming')}
                </span>
                {exists ? <ArrowRight size={14} /> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
