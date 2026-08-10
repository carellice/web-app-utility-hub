import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const STORAGE_KEY = 'devdex:progress:v1';

const DEFAULT_STATE = {
  completed: {},
  quizScores: {},
  flashcardsSeen: {}
};

function readStorage() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(readStorage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const markCompleted = useCallback((topicId, level, value = true) => {
    const key = `${topicId}:${level}`;
    setState((prev) => ({
      ...prev,
      completed: { ...prev.completed, [key]: value }
    }));
  }, []);

  const isCompleted = useCallback(
    (topicId, level) => Boolean(state.completed[`${topicId}:${level}`]),
    [state.completed]
  );

  const recordQuizScore = useCallback((quizId, score, total) => {
    setState((prev) => {
      const previous = prev.quizScores[quizId];
      const best =
        !previous || score / total > previous.score / previous.total
          ? { score, total, at: Date.now() }
          : previous;
      return {
        ...prev,
        quizScores: { ...prev.quizScores, [quizId]: best }
      };
    });
  }, []);

  const markFlashcardSeen = useCallback((deckId, cardIndex) => {
    setState((prev) => {
      const seen = new Set(prev.flashcardsSeen[deckId] || []);
      seen.add(cardIndex);
      return {
        ...prev,
        flashcardsSeen: { ...prev.flashcardsSeen, [deckId]: Array.from(seen) }
      };
    });
  }, []);

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  /** Esporta lo stato in un payload JSON serializzabile. */
  const exportData = useCallback(() => {
    return {
      type: 'devdex-progress',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: state
    };
  }, [state]);

  /**
   * Importa uno stato. Accetta sia il payload con header (type/version/data)
   * sia lo state diretto. Throws con messaggio leggibile in caso di errore.
   */
  const importData = useCallback((payload) => {
    if (!payload || typeof payload !== 'object') {
      throw new Error('File non valido: oggetto atteso.');
    }
    let data = payload;
    if (payload.type) {
      if (payload.type !== 'devdex-progress') {
        throw new Error(`File non valido: tipo "${payload.type}" non riconosciuto.`);
      }
      data = payload.data;
    }
    if (!data || typeof data !== 'object') {
      throw new Error('File non valido: campo "data" mancante.');
    }
    const next = {
      completed: data.completed && typeof data.completed === 'object' ? data.completed : {},
      quizScores: data.quizScores && typeof data.quizScores === 'object' ? data.quizScores : {},
      flashcardsSeen:
        data.flashcardsSeen && typeof data.flashcardsSeen === 'object'
          ? data.flashcardsSeen
          : {}
    };
    setState(next);
    return next;
  }, []);

  const value = useMemo(
    () => ({
      state,
      markCompleted,
      isCompleted,
      recordQuizScore,
      markFlashcardSeen,
      reset,
      exportData,
      importData
    }),
    [
      state,
      markCompleted,
      isCompleted,
      recordQuizScore,
      markFlashcardSeen,
      reset,
      exportData,
      importData
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx)
    throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
