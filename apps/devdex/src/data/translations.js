/**
 * UI translations.
 *
 * Keys are flat dotted-strings, grouped by section for readability.
 * When a key is missing in a language, the LanguageContext falls back to
 * DEFAULT_LANG ('it').
 *
 * Educational content (MDX, quizzes, flashcards, catalog) is handled
 * separately via tc(field) which accepts either a plain string or
 * { it, en } objects.
 */

export const DEFAULT_LANG = 'it';
export const SUPPORTED_LANGS = ['it', 'en'];

export const LANG_LABELS = {
  it: { native: 'Italiano', flag: 'IT' },
  en: { native: 'English', flag: 'EN' }
};

const it = {
  /* ---------- layout / chrome ---------- */
  'layout.sidebar.open': 'Apri navigazione',
  'layout.sidebar.close': 'Chiudi navigazione',
  'layout.sidebar.open.title': 'Apri sidebar',
  'layout.sidebar.close.title': 'Chiudi sidebar',
  'layout.brand.aria': 'DevDex home',
  'layout.settings.aria': 'Impostazioni',
  'layout.footer.tagline': 'funziona offline',

  /* ---------- nav ---------- */
  'nav.home': 'Home',
  'nav.flashcards': 'Flashcards',
  'nav.quiz': 'Quiz',
  'nav.progress': 'Progressi',
  'nav.mobile.aria': 'Navigazione mobile',
  'nav.main.aria': 'Navigazione principale',
  'nav.section.navigation': 'NAVIGAZIONE',
  'nav.section.dex': 'SEZIONI DEL DEX',
  'nav.search.hint.press': 'Premi',
  'nav.search.hint.toSearch': 'per cercare',

  /* ---------- search bar ---------- */
  'search.bar.placeholder': 'Cerca argomenti, codice, quiz…',
  'search.bar.aria': 'Cerca su DevDex',
  'search.bar.clear': 'Pulisci ricerca',

  /* ---------- breadcrumbs ---------- */
  'breadcrumbs.aria': 'Breadcrumb',
  'breadcrumbs.home': 'Home',

  /* ---------- category filter bar ---------- */
  'filter.aria': 'Filtra per categoria',
  'filter.all': 'Tutte',

  /* ---------- flashcard ---------- */
  'flashcard.tag.question': 'DOMANDA',
  'flashcard.tag.answer': 'SOLUZIONE',
  'flashcard.aria.question': 'Domanda. Click per rivelare.',
  'flashcard.aria.answer': 'Soluzione',
  'flashcard.hint.reveal': 'click per rivelare',
  'flashcard.hint.back': 'click per tornare',

  /* ---------- home ---------- */
  'home.eyebrow': 'ENCICLOPEDIA TASCABILE',
  'home.title.before': 'Il',
  'home.title.grad': 'Pokédex',
  'home.title.after': 'dello sviluppatore',
  'home.lead':
    'Studio rapido, ripasso pre-colloquio e <em>chicche</em> tecniche su Java, Spring, database, architettura e AI. Tre livelli di profondità per ogni argomento. Funziona offline.',
  'home.cta.startJava': 'Inizia da Java',
  'home.cta.quiz': 'Quiz',
  'home.cta.flashcards': 'Flashcards',
  'home.stats.aria': 'Statistiche del catalogo',
  'home.stats.topics': 'argomenti',
  'home.stats.levels': 'livelli',
  'home.stats.areas': 'aree',
  'home.progress.pill': 'RIEPILOGO',
  'home.progress.title': 'I tuoi progressi',
  'home.progress.details': 'Dettagli',
  'home.progress.completed': 'Livelli completati',
  'home.progress.quizCount': 'Quiz svolti',
  'home.progress.bestQuiz': 'Miglior quiz',
  'home.progress.bestQuizNamed': 'Miglior quiz ({id})',
  'home.start.pill': 'START HERE',
  'home.start.title': 'Da dove iniziare',
  'home.explore.pill': 'EXPLORE',
  'home.explore.title': 'Esplora le sezioni',
  'home.explore.topicCount': '{count} topic',
  'home.tip.label': 'Tip',
  'home.tip.body':
    'premi <kbd>/</kbd> ovunque per aprire la ricerca su titoli, contenuti, flashcards e quiz.',

  /* ---------- category page ---------- */
  'category.banner.code': 'CODE',
  'category.banner.topics': 'ARGOMENTI',
  'category.entries.pill': 'ENTRIES',
  'category.entries.title': 'Argomenti',
  'category.entries.levels': 'LIVELLI',
  'category.practice.pill': 'PRACTICE',
  'category.practice.title': 'Esercitati',
  'category.practice.flashcardsOf': 'Flashcards di {name}',
  'category.practice.quizOf': 'Quiz di {name}',

  /* ---------- topic page ---------- */
  'topic.banner.entry': 'DEX ENTRY',
  'topic.banner.progress': 'PROGRESSO',
  'topic.levels.pill': 'LEVELS',
  'topic.levels.title': 'Scegli un livello',
  'topic.level.completed': 'COMPLETATO',
  'topic.level.soon': 'SOON',
  'topic.level.open': 'Apri',
  'topic.level.upcoming': 'In arrivo',

  /* ---------- level page ---------- */
  'level.header.entry': 'ENTRY',
  'level.cta.completed': 'Completato',
  'level.cta.markCompleted': 'Segna come completato',
  'level.nav.toQuiz': 'Vai al quiz di {name}',

  /* ---------- flashcards page ---------- */
  'flashcards.title': 'Flashcards',
  'flashcards.empty': 'Nessuna flashcard disponibile.',
  'flashcards.prev': 'Precedente',
  'flashcards.shuffle': 'Casuale',
  'flashcards.next': 'Successiva',

  /* ---------- quiz page ---------- */
  'quiz.title': 'Quiz',
  'quiz.empty': 'Nessuna domanda disponibile.',
  'quiz.progress.question': 'Domanda',
  'quiz.progress.of': 'di',
  'quiz.score': 'Punti',
  'quiz.confirm': 'Conferma',
  'quiz.next': 'Prossima',
  'quiz.seeResult': 'Vedi risultato',
  'quiz.feedback.correct': 'Corretto!',
  'quiz.feedback.wrong': 'Sbagliato.',
  'quiz.result.crumb': 'Risultato Quiz',
  'quiz.result.great': 'Ottimo!',
  'quiz.result.good': 'Buono!',
  'quiz.result.review': 'Da rivedere',
  'quiz.result.pct': '{pct}% di risposte corrette',
  'quiz.result.newBest': '· nuovo record personale!',
  'quiz.result.previousBest': '· record personale: {score}/{total}',
  'quiz.result.retry': 'Rifai il quiz',
  'quiz.result.home': 'Home',

  /* ---------- progress page ---------- */
  'progress.title': 'I tuoi progressi',
  'progress.lead':
    'Tutto è salvato esclusivamente nel localStorage del tuo browser. Nessun server, nessun account.',
  'progress.stat.completed': 'Livelli completati',
  'progress.stat.quizCount': 'Quiz svolti',
  'progress.stat.bestQuiz': 'Miglior quiz',
  'progress.stat.bestQuizNamed': 'Miglior quiz ({id})',
  'progress.sections.pill': 'SECTIONS',
  'progress.sections.title': 'Avanzamento per categoria',
  'progress.section.levelsOf': '{done} / {total} livelli',
  'progress.section.details': 'Dettagli',
  'progress.system.pill': 'SYSTEM',
  'progress.system.title': 'Reset dati',
  'progress.system.reset': 'Cancella tutti i progressi',
  'progress.system.resetConfirm':
    'Vuoi davvero cancellare tutti i tuoi progressi? Operazione non reversibile.',

  /* ---------- search page ---------- */
  'searchPage.title': 'Ricerca',
  'searchPage.noResultsFor': 'Nessun risultato per “{q}”',
  'searchPage.resultsFor': '{count} risultati per “{q}”',
  'searchPage.hint':
    'Scrivi qualcosa nella barra qui sopra. Puoi cercare nei titoli, nei contenuti dei livelli, nelle flashcards e nei quiz. Premi <kbd>/</kbd> ovunque per saltare al campo di ricerca.',
  'searchPage.emptyTip':
    'Prova con sinonimi (es. "transazione" → "transactional") oppure parole più brevi.',
  'searchPage.group.topic': 'ARGOMENTO',
  'searchPage.group.flashcard': 'FLASHCARD',
  'searchPage.group.quiz': 'QUIZ',
  'searchPage.group.resultsOne': '{n} risultato',
  'searchPage.group.resultsMany': '{n} risultati',

  /* ---------- not found ---------- */
  'notFound.title': 'Entry non trovata',
  'notFound.body': 'Questa "voce del Pokédex" non esiste (ancora).',
  'notFound.cta': 'Torna alla Home',

  /* ---------- settings ---------- */
  'settings.title': 'Impostazioni',
  'settings.lead':
    "Preferenze d'uso, gestione dei progressi e cache. Tutto salvato localmente, niente account né server.",

  'settings.appearance.title': 'Aspetto',
  'settings.appearance.lead': "Tema dell'interfaccia.",
  'settings.theme.label': 'Tema',
  'settings.theme.activeNow': 'Attualmente attivo:',
  'settings.theme.aria': 'Selezione tema',
  'settings.theme.auto': 'Auto',
  'settings.theme.light': 'Chiaro',
  'settings.theme.dark': 'Scuro',
  'settings.theme.effective.light': 'chiaro',
  'settings.theme.effective.dark': 'scuro',
  'settings.reduceMotion.label': 'Riduci animazioni',
  'settings.reduceMotion.lead':
    'Disabilita transizioni e animazioni non essenziali.',

  'settings.language.title': 'Lingua',
  'settings.language.lead':
    "Lingua dell'interfaccia e di tutti i contenuti didattici (articoli, quiz, flashcards, catalogo).",
  'settings.language.label': 'Lingua interfaccia',
  'settings.language.aria': 'Selezione lingua',

  'settings.data.title': 'Dati & Progressi',
  'settings.data.lead':
    'Esporta / importa lo stato per backup o spostarlo su un altro device.',
  'settings.data.export.label': 'Esporta progressi',
  'settings.data.export.lead':
    'Scarica un file JSON con livelli completati, quiz e flashcards viste.',
  'settings.data.export.cta': 'Esporta JSON',
  'settings.data.import.label': 'Importa progressi',
  'settings.data.import.lead':
    'Sostituisci lo stato attuale con il contenuto di un file esportato.',
  'settings.data.import.cta': 'Importa JSON',
  'settings.data.reset.label': 'Reset progressi',
  'settings.data.reset.lead':
    'Azzera livelli completati, quiz e flashcards. Non reversibile.',
  'settings.data.reset.cta': 'Reset',
  'settings.data.reset.confirmCta': 'Conferma reset',

  'settings.cache.title': 'Cache & offline',
  'settings.cache.lead':
    "L'app funziona offline grazie a un service worker. Puoi pulire la cache se vedi contenuti vecchi.",
  'settings.cache.clear.label': 'Pulisci cache PWA',
  'settings.cache.clear.lead':
    'Rimuove il service worker e ogni cache. Ricarica la pagina dopo.',
  'settings.cache.clear.cta': 'Pulisci cache',

  'settings.info.title': 'Informazioni',
  'settings.info.lead': 'Stato del catalogo e dello storage locale.',
  'settings.info.areas': 'Aree tematiche',
  'settings.info.topics': 'Argomenti',
  'settings.info.totalLevels': 'Livelli totali',
  'settings.info.completed': 'Completati',
  'settings.info.quizCount': 'Quiz svolti',
  'settings.info.storage': 'Storage locale',

  'settings.toast.exported': 'Progressi esportati',
  'settings.toast.exportFailed': 'Esportazione fallita: {error}',
  'settings.toast.imported': 'Progressi importati',
  'settings.toast.importFailed': 'Importazione fallita: {error}',
  'settings.toast.reset': 'Progressi azzerati',
  'settings.toast.fileReadError': 'Errore lettura file',
  'settings.toast.cacheCleared': 'Cache PWA pulita · ricarica la pagina',
  'settings.toast.cacheFailed': 'Pulizia cache fallita: {error}',

  /* ---------- level meta (catalog descriptions used in UI) ---------- */
  'levelMeta.principiante.label': 'Principiante',
  'levelMeta.principiante.short': 'BASIC',
  'levelMeta.principiante.desc': 'Fondamenti, sintassi e concetti base.',
  'levelMeta.medio.label': 'Medio',
  'levelMeta.medio.short': 'STANDARD',
  'levelMeta.medio.desc':
    'Design pattern, implementazioni standard e logiche intermedie.',
  'levelMeta.avanzato.label': 'Avanzato',
  'levelMeta.avanzato.short': 'EXPERT',
  'levelMeta.avanzato.desc':
    'Ottimizzazioni, "under the hood" e casi limite (chicche).'
};

const en = {
  /* ---------- layout / chrome ---------- */
  'layout.sidebar.open': 'Open navigation',
  'layout.sidebar.close': 'Close navigation',
  'layout.sidebar.open.title': 'Open sidebar',
  'layout.sidebar.close.title': 'Close sidebar',
  'layout.brand.aria': 'DevDex home',
  'layout.settings.aria': 'Settings',
  'layout.footer.tagline': 'works offline',

  /* ---------- nav ---------- */
  'nav.home': 'Home',
  'nav.flashcards': 'Flashcards',
  'nav.quiz': 'Quiz',
  'nav.progress': 'Progress',
  'nav.mobile.aria': 'Mobile navigation',
  'nav.main.aria': 'Main navigation',
  'nav.section.navigation': 'NAVIGATION',
  'nav.section.dex': 'DEX SECTIONS',
  'nav.search.hint.press': 'Press',
  'nav.search.hint.toSearch': 'to search',

  /* ---------- search bar ---------- */
  'search.bar.placeholder': 'Search topics, code, quizzes…',
  'search.bar.aria': 'Search DevDex',
  'search.bar.clear': 'Clear search',

  /* ---------- breadcrumbs ---------- */
  'breadcrumbs.aria': 'Breadcrumb',
  'breadcrumbs.home': 'Home',

  /* ---------- category filter bar ---------- */
  'filter.aria': 'Filter by category',
  'filter.all': 'All',

  /* ---------- flashcard ---------- */
  'flashcard.tag.question': 'QUESTION',
  'flashcard.tag.answer': 'ANSWER',
  'flashcard.aria.question': 'Question. Click to reveal.',
  'flashcard.aria.answer': 'Answer',
  'flashcard.hint.reveal': 'click to reveal',
  'flashcard.hint.back': 'click to flip back',

  /* ---------- home ---------- */
  'home.eyebrow': 'POCKET ENCYCLOPEDIA',
  'home.title.before': 'The developer',
  'home.title.grad': 'Pokédex',
  'home.title.after': '',
  'home.lead':
    'Quick study, pre-interview review and technical <em>nuggets</em> on Java, Spring, databases, architecture and AI. Three depth levels per topic. Works offline.',
  'home.cta.startJava': 'Start with Java',
  'home.cta.quiz': 'Quiz',
  'home.cta.flashcards': 'Flashcards',
  'home.stats.aria': 'Catalog statistics',
  'home.stats.topics': 'topics',
  'home.stats.levels': 'levels',
  'home.stats.areas': 'areas',
  'home.progress.pill': 'OVERVIEW',
  'home.progress.title': 'Your progress',
  'home.progress.details': 'Details',
  'home.progress.completed': 'Levels completed',
  'home.progress.quizCount': 'Quizzes taken',
  'home.progress.bestQuiz': 'Best quiz',
  'home.progress.bestQuizNamed': 'Best quiz ({id})',
  'home.start.pill': 'START HERE',
  'home.start.title': 'Where to start',
  'home.explore.pill': 'EXPLORE',
  'home.explore.title': 'Explore the sections',
  'home.explore.topicCount': '{count} topics',
  'home.tip.label': 'Tip',
  'home.tip.body':
    'press <kbd>/</kbd> anywhere to open search across titles, content, flashcards and quizzes.',

  /* ---------- category page ---------- */
  'category.banner.code': 'CODE',
  'category.banner.topics': 'TOPICS',
  'category.entries.pill': 'ENTRIES',
  'category.entries.title': 'Topics',
  'category.entries.levels': 'LEVELS',
  'category.practice.pill': 'PRACTICE',
  'category.practice.title': 'Practice',
  'category.practice.flashcardsOf': '{name} flashcards',
  'category.practice.quizOf': '{name} quiz',

  /* ---------- topic page ---------- */
  'topic.banner.entry': 'DEX ENTRY',
  'topic.banner.progress': 'PROGRESS',
  'topic.levels.pill': 'LEVELS',
  'topic.levels.title': 'Pick a level',
  'topic.level.completed': 'COMPLETED',
  'topic.level.soon': 'SOON',
  'topic.level.open': 'Open',
  'topic.level.upcoming': 'Coming soon',

  /* ---------- level page ---------- */
  'level.header.entry': 'ENTRY',
  'level.cta.completed': 'Completed',
  'level.cta.markCompleted': 'Mark as completed',
  'level.nav.toQuiz': 'Go to {name} quiz',

  /* ---------- flashcards page ---------- */
  'flashcards.title': 'Flashcards',
  'flashcards.empty': 'No flashcards available.',
  'flashcards.prev': 'Previous',
  'flashcards.shuffle': 'Shuffle',
  'flashcards.next': 'Next',

  /* ---------- quiz page ---------- */
  'quiz.title': 'Quiz',
  'quiz.empty': 'No questions available.',
  'quiz.progress.question': 'Question',
  'quiz.progress.of': 'of',
  'quiz.score': 'Score',
  'quiz.confirm': 'Confirm',
  'quiz.next': 'Next',
  'quiz.seeResult': 'See result',
  'quiz.feedback.correct': 'Correct!',
  'quiz.feedback.wrong': 'Wrong.',
  'quiz.result.crumb': 'Quiz result',
  'quiz.result.great': 'Excellent!',
  'quiz.result.good': 'Good!',
  'quiz.result.review': 'Needs review',
  'quiz.result.pct': '{pct}% correct answers',
  'quiz.result.newBest': '· new personal best!',
  'quiz.result.previousBest': '· personal best: {score}/{total}',
  'quiz.result.retry': 'Retake the quiz',
  'quiz.result.home': 'Home',

  /* ---------- progress page ---------- */
  'progress.title': 'Your progress',
  'progress.lead':
    "Everything is saved only in your browser's localStorage. No server, no account.",
  'progress.stat.completed': 'Levels completed',
  'progress.stat.quizCount': 'Quizzes taken',
  'progress.stat.bestQuiz': 'Best quiz',
  'progress.stat.bestQuizNamed': 'Best quiz ({id})',
  'progress.sections.pill': 'SECTIONS',
  'progress.sections.title': 'Progress by category',
  'progress.section.levelsOf': '{done} / {total} levels',
  'progress.section.details': 'Details',
  'progress.system.pill': 'SYSTEM',
  'progress.system.title': 'Data reset',
  'progress.system.reset': 'Clear all progress',
  'progress.system.resetConfirm':
    'Do you really want to delete all your progress? This cannot be undone.',

  /* ---------- search page ---------- */
  'searchPage.title': 'Search',
  'searchPage.noResultsFor': 'No results for “{q}”',
  'searchPage.resultsFor': '{count} results for “{q}”',
  'searchPage.hint':
    'Type something in the bar above. You can search titles, level content, flashcards and quizzes. Press <kbd>/</kbd> anywhere to jump to the search field.',
  'searchPage.emptyTip':
    'Try synonyms (e.g. "transazione" → "transactional") or shorter words.',
  'searchPage.group.topic': 'TOPIC',
  'searchPage.group.flashcard': 'FLASHCARD',
  'searchPage.group.quiz': 'QUIZ',
  'searchPage.group.resultsOne': '{n} result',
  'searchPage.group.resultsMany': '{n} results',

  /* ---------- not found ---------- */
  'notFound.title': 'Entry not found',
  'notFound.body': "This Pokédex entry doesn't exist (yet).",
  'notFound.cta': 'Back to Home',

  /* ---------- settings ---------- */
  'settings.title': 'Settings',
  'settings.lead':
    'Usage preferences, progress and cache management. All saved locally — no account, no server.',

  'settings.appearance.title': 'Appearance',
  'settings.appearance.lead': 'Interface theme.',
  'settings.theme.label': 'Theme',
  'settings.theme.activeNow': 'Currently active:',
  'settings.theme.aria': 'Theme selection',
  'settings.theme.auto': 'Auto',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.theme.effective.light': 'light',
  'settings.theme.effective.dark': 'dark',
  'settings.reduceMotion.label': 'Reduce motion',
  'settings.reduceMotion.lead':
    'Disable non-essential transitions and animations.',

  'settings.language.title': 'Language',
  'settings.language.lead':
    'Language for the interface and all educational content (articles, quizzes, flashcards, catalog).',
  'settings.language.label': 'Interface language',
  'settings.language.aria': 'Language selection',

  'settings.data.title': 'Data & Progress',
  'settings.data.lead':
    'Export / import your state to back up or move it to another device.',
  'settings.data.export.label': 'Export progress',
  'settings.data.export.lead':
    'Download a JSON file with completed levels, quizzes and seen flashcards.',
  'settings.data.export.cta': 'Export JSON',
  'settings.data.import.label': 'Import progress',
  'settings.data.import.lead':
    'Replace your current state with the contents of an exported file.',
  'settings.data.import.cta': 'Import JSON',
  'settings.data.reset.label': 'Reset progress',
  'settings.data.reset.lead':
    'Clear completed levels, quizzes and flashcards. Not reversible.',
  'settings.data.reset.cta': 'Reset',
  'settings.data.reset.confirmCta': 'Confirm reset',

  'settings.cache.title': 'Cache & offline',
  'settings.cache.lead':
    'The app works offline thanks to a service worker. You can clear the cache if you see stale content.',
  'settings.cache.clear.label': 'Clear PWA cache',
  'settings.cache.clear.lead':
    'Removes the service worker and every cache. Reload the page afterwards.',
  'settings.cache.clear.cta': 'Clear cache',

  'settings.info.title': 'About',
  'settings.info.lead': 'Catalog and local storage status.',
  'settings.info.areas': 'Topic areas',
  'settings.info.topics': 'Topics',
  'settings.info.totalLevels': 'Total levels',
  'settings.info.completed': 'Completed',
  'settings.info.quizCount': 'Quizzes taken',
  'settings.info.storage': 'Local storage',

  'settings.toast.exported': 'Progress exported',
  'settings.toast.exportFailed': 'Export failed: {error}',
  'settings.toast.imported': 'Progress imported',
  'settings.toast.importFailed': 'Import failed: {error}',
  'settings.toast.reset': 'Progress reset',
  'settings.toast.fileReadError': 'File read error',
  'settings.toast.cacheCleared': 'PWA cache cleared · reload the page',
  'settings.toast.cacheFailed': 'Cache clear failed: {error}',

  /* ---------- level meta ---------- */
  'levelMeta.principiante.label': 'Beginner',
  'levelMeta.principiante.short': 'BASIC',
  'levelMeta.principiante.desc': 'Fundamentals, syntax and core concepts.',
  'levelMeta.medio.label': 'Intermediate',
  'levelMeta.medio.short': 'STANDARD',
  'levelMeta.medio.desc':
    'Design patterns, standard implementations and intermediate logic.',
  'levelMeta.avanzato.label': 'Advanced',
  'levelMeta.avanzato.short': 'EXPERT',
  'levelMeta.avanzato.desc':
    'Optimizations, "under the hood" and edge cases (gotchas).'
};

export const translations = { it, en };
