import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shuffle, Library } from 'lucide-react';
import { findCategory } from '../data/catalog.js';
import { getDeck, getAllDecks } from '../data/flashcards.js';
import Flashcard from '../components/Flashcard.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import CategoryFilterBar from '../components/CategoryFilterBar.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function FlashcardsPage() {
  const { categoryId } = useParams();
  const { markFlashcardSeen } = useProgress();
  const { t, tc } = useLanguage();

  const cat = categoryId ? findCategory(categoryId) : null;

  const cards = useMemo(() => {
    if (categoryId) return getDeck(categoryId);
    return getAllDecks().flatMap((d) =>
      d.cards.map((c) => ({ ...c, deckId: d.id }))
    );
  }, [categoryId]);

  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [categoryId]);

  useEffect(() => {
    if (cards.length === 0) return;
    markFlashcardSeen(categoryId || '_all', index);
  }, [index, categoryId, cards.length, markFlashcardSeen]);

  if (cards.length === 0) {
    return (
      <>
        <h1>{t('flashcards.title')}</h1>
        <p className="muted">{t('flashcards.empty')}</p>
      </>
    );
  }

  const current = cards[index];
  const next = () => setIndex((i) => (i + 1) % cards.length);
  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const shuffle = () => setIndex(Math.floor(Math.random() * cards.length));
  const catTitle = cat ? tc(cat.title) : '';

  return (
    <>
      <Breadcrumbs
        items={[
          { to: '/', label: t('breadcrumbs.home') },
          cat
            ? { to: `/category/${cat.id}`, label: catTitle }
            : { label: t('flashcards.title') },
          cat ? { label: t('flashcards.title') } : null
        ].filter(Boolean)}
      />
      <h1 style={{ marginTop: 0 }} className="page-title">
        <Library size={26} aria-hidden /> {t('flashcards.title')}
        {cat ? <span className="muted"> · {catTitle}</span> : null}
      </h1>

      <CategoryFilterBar basePath="/flashcards" activeId={categoryId} />

      <div className="flashcard-deck">
        <div className="flashcard-progress">
          <span>{index + 1}</span>
          <span className="muted"> / {cards.length}</span>
        </div>
        <Flashcard
          key={`${categoryId || 'all'}-${index}`}
          question={tc(current.q)}
          answer={tc(current.a)}
        />
        <div className="flashcard-controls">
          <button className="btn btn--ghost" onClick={prev}>
            <ArrowLeft size={16} /> {t('flashcards.prev')}
          </button>
          <button className="btn btn--ghost" onClick={shuffle}>
            <Shuffle size={16} /> {t('flashcards.shuffle')}
          </button>
          <button className="btn btn--primary" onClick={next}>
            {t('flashcards.next')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
