import { useState } from 'react';
import { Eye, RotateCcw } from 'lucide-react';
import { useT } from '../context/LanguageContext.jsx';

export default function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);
  const t = useT();

  return (
    <div
      className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      aria-label={
        flipped ? t('flashcard.aria.answer') : t('flashcard.aria.question')
      }
    >
      <div className="flashcard__inner">
        <div className="flashcard__face">
          <span className="flashcard__tag">{t('flashcard.tag.question')}</span>
          <div className="flashcard__body">{question}</div>
          <div className="flashcard__hint">
            <Eye size={13} aria-hidden /> {t('flashcard.hint.reveal')}
          </div>
        </div>
        <div className="flashcard__face flashcard__face--back">
          <span className="flashcard__tag flashcard__tag--ok">
            {t('flashcard.tag.answer')}
          </span>
          <div className="flashcard__body">{answer}</div>
          <div className="flashcard__hint">
            <RotateCcw size={13} aria-hidden /> {t('flashcard.hint.back')}
          </div>
        </div>
      </div>
    </div>
  );
}
