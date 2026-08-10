import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import {
  findTopic,
  findGroup,
  LEVELS,
  fmtNum,
  getDexNumber
} from '../data/catalog.js';
import { getMdxComponent } from '../data/mdxLoader.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import LevelChip from '../components/LevelChip.jsx';
import NotFound from './NotFound.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function LevelPage() {
  const { categoryId, topicId, level } = useParams();
  const found = findTopic(categoryId, topicId);
  const { isCompleted, markCompleted } = useProgress();
  const { t, tc, lang } = useLanguage();

  if (!found || !LEVELS.includes(level)) return <NotFound />;
  const { category, topic } = found;
  const group = findGroup(category.groupId);
  const Mdx = getMdxComponent(topic.folder || category.id, topic.id, level, lang);
  if (!Mdx) return <NotFound />;

  const topicKey = `${category.id}/${topic.id}`;
  const done = isCompleted(topicKey, level);
  const number = getDexNumber(category.id, topic.id);

  const idx = LEVELS.indexOf(level);
  const next = LEVELS[idx + 1];
  const prev = LEVELS[idx - 1];
  const catTitle = tc(category.title);
  const topicTitle = tc(topic.title);

  return (
    <>
      <Breadcrumbs
        items={[
          { to: '/', label: t('breadcrumbs.home') },
          group ? { label: tc(group.title) } : null,
          { to: `/category/${category.id}`, label: catTitle },
          {
            to: `/topic/${category.id}/${topic.id}`,
            label: topicTitle
          },
          { label: t(`levelMeta.${level}.label`) }
        ].filter(Boolean)}
      />

      <section
        className="level-header"
        style={{ '--accent-cat': category.color }}
      >
        <div className="level-header__meta">
          <span className="eyebrow">
            {t('level.header.entry')} {fmtNum(number)} · {category.code}
          </span>
          <h1>{topicTitle}</h1>
          <div className="row" style={{ marginTop: 8 }}>
            <LevelChip level={level} />
            <span className="muted">{t(`levelMeta.${level}.desc`)}</span>
          </div>
        </div>
        <button
          className={done ? 'btn btn--ghost' : 'btn btn--primary'}
          onClick={() => markCompleted(topicKey, level, !done)}
        >
          {done ? (
            <>
              <CheckCircle2 size={16} /> {t('level.cta.completed')}
            </>
          ) : (
            <>
              <Circle size={16} /> {t('level.cta.markCompleted')}
            </>
          )}
        </button>
      </section>

      <article className="mdx">
        <Mdx />
      </article>

      <div className="quiz-actions">
        {prev ? (
          <Link
            to={`/topic/${category.id}/${topic.id}/${prev}`}
            className="btn btn--ghost"
          >
            <ArrowLeft size={16} /> {t(`levelMeta.${prev}.label`)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/topic/${category.id}/${topic.id}/${next}`}
            className="btn btn--primary"
          >
            {t(`levelMeta.${next}.label`)} <ArrowRight size={16} />
          </Link>
        ) : (
          <Link to={`/quiz/${category.id}`} className="btn btn--primary">
            {t('level.nav.toQuiz', { name: catTitle })} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </>
  );
}
