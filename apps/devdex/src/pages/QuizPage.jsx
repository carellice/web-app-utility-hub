import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ListChecks,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Home as HomeIcon
} from 'lucide-react';
import { findCategory } from '../data/catalog.js';
import { getQuiz, getAllQuizzes } from '../data/quizzes.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import CategoryFilterBar from '../components/CategoryFilterBar.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function QuizPage() {
  const { categoryId } = useParams();
  const { recordQuizScore, state } = useProgress();
  const { t, tc } = useLanguage();
  const cat = categoryId ? findCategory(categoryId) : null;

  const questions = useMemo(() => {
    if (categoryId) return getQuiz(categoryId);
    return getAllQuizzes().flatMap((q) => q.questions);
  }, [categoryId]);

  const quizId = categoryId || '_all';
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setDone(false);
  }, [categoryId]);

  if (questions.length === 0) {
    return (
      <>
        <h1>{t('quiz.title')}</h1>
        <p className="muted">{t('quiz.empty')}</p>
      </>
    );
  }

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const catTitle = cat ? tc(cat.title) : '';

  function confirm() {
    if (selected == null) return;
    setConfirmed(true);
    if (selected === current.answer) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      const finalScore = score;
      recordQuizScore(quizId, finalScore, questions.length);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setConfirmed(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const best = state.quizScores[quizId];
    const label =
      pct >= 75
        ? t('quiz.result.great')
        : pct >= 50
          ? t('quiz.result.good')
          : t('quiz.result.review');
    return (
      <>
        <Breadcrumbs
          items={[
            { to: '/', label: t('breadcrumbs.home') },
            cat ? { to: `/category/${cat.id}`, label: catTitle } : null,
            { label: t('quiz.result.crumb') }
          ].filter(Boolean)}
        />
        <div className="quiz-result">
          <div className="quiz-result__icon">
            <Trophy size={52} strokeWidth={1.5} />
          </div>
          <h1 style={{ marginBottom: 4 }}>{label}</h1>
          <div className="quiz-result__score">
            {score} <span className="muted">/ {questions.length}</span>
          </div>
          <p className="muted">
            {t('quiz.result.pct', { pct })}
            {best && best.score === score
              ? ' ' + t('quiz.result.newBest')
              : best
                ? ' ' +
                  t('quiz.result.previousBest', {
                    score: best.score,
                    total: best.total
                  })
                : null}
          </p>
          <div
            className="row"
            style={{ justifyContent: 'center', marginTop: 16 }}
          >
            <button className="btn btn--primary" onClick={restart}>
              <RotateCcw size={16} /> {t('quiz.result.retry')}
            </button>
            <Link to="/" className="btn btn--ghost">
              <HomeIcon size={16} /> {t('quiz.result.home')}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { to: '/', label: t('breadcrumbs.home') },
          cat ? { to: `/category/${cat.id}`, label: catTitle } : null,
          { label: t('quiz.title') }
        ].filter(Boolean)}
      />

      <h1 style={{ marginTop: 0 }} className="page-title">
        <ListChecks size={26} aria-hidden /> {t('quiz.title')}
        {cat ? <span className="muted"> · {catTitle}</span> : null}
      </h1>

      <CategoryFilterBar basePath="/quiz" activeId={categoryId} />

      <div className="quiz">
        <div className="quiz__topbar">
          <div className="quiz__progress">
            {t('quiz.progress.question')} <strong>{index + 1}</strong>{' '}
            {t('quiz.progress.of')} <strong>{questions.length}</strong>
          </div>
          <div className="quiz__score">
            {t('quiz.score')} <strong>{score}</strong>
          </div>
        </div>
        <div className="quiz__bar">
          <div
            className="quiz__bar-fill"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="quiz__question">{tc(current.q)}</div>
        <div className="quiz__options">
          {current.options.map((opt, i) => {
            let cls = 'quiz-option';
            let icon = null;
            if (confirmed) {
              if (i === current.answer) {
                cls += ' quiz-option--correct';
                icon = <CheckCircle2 size={16} aria-hidden />;
              } else if (i === selected) {
                cls += ' quiz-option--wrong';
                icon = <XCircle size={16} aria-hidden />;
              }
            } else if (i === selected) {
              cls += ' quiz-option--selected';
            }
            return (
              <button
                key={i}
                className={cls}
                disabled={confirmed}
                onClick={() => setSelected(i)}
              >
                <span className="quiz-option__letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="quiz-option__text">{tc(opt)}</span>
                {icon ? (
                  <span className="quiz-option__icon">{icon}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {confirmed && (
          <div
            className={`quiz-explanation ${
              selected === current.answer
                ? 'quiz-explanation--ok'
                : 'quiz-explanation--ko'
            }`}
          >
            <strong>
              {selected === current.answer
                ? t('quiz.feedback.correct')
                : t('quiz.feedback.wrong')}
            </strong>{' '}
            {tc(current.explanation)}
          </div>
        )}

        <div className="quiz-actions">
          <span />
          {!confirmed ? (
            <button
              className="btn btn--primary"
              onClick={confirm}
              disabled={selected == null}
              style={selected == null ? { opacity: 0.5 } : null}
            >
              {t('quiz.confirm')}
            </button>
          ) : (
            <button className="btn btn--primary" onClick={next}>
              {isLast ? t('quiz.seeResult') : t('quiz.next')}{' '}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
