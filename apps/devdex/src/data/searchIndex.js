/**
 * Indice di ricerca DevDex.
 *
 * Costruito una volta al primo import a partire da:
 *   - catalog (categorie + topic)
 *   - MDX raw (titoli, headings, paragrafi)
 *   - flashcards (Q + A)
 *   - quizzes (Q + opzioni + spiegazione)
 *
 * La ricerca è case-insensitive, accent-insensitive e basata su match di tutti
 * i token della query (AND), con scoring che premia: titolo > heading > snippet.
 */
import { CATEGORIES, findTopicByFolder } from './catalog.js';
import { allMdxRaw } from './mdxLoader.js';
import { FLASHCARDS } from './flashcards.js';
import { QUIZZES } from './quizzes.js';

/* ---------------- normalization ---------------- */

export function normalize(s) {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Converte un field i18n ({it, en, ...} | string) in tutte le sue varianti
 * concatenate, così che la ricerca funzioni indipendentemente dalla lingua. */
function joinAllLangs(field) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') return Object.values(field).join(' ');
  return String(field);
}

function tokens(q) {
  return normalize(q).split(/\s+/).filter(Boolean);
}

/* ---------------- MDX parsing ---------------- */

function stripMd(line) {
  return line
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[#>\-*+\s|]+/, '')
    .trim();
}

function parseMdx(source) {
  if (typeof source !== 'string') {
    return { headings: [], paragraphs: [], firstParagraph: '' };
  }
  const lines = source.split('\n');
  const headings = [];
  const paragraphs = [];
  let inCode = false;
  let buffer = [];

  const flush = () => {
    if (!buffer.length) return;
    paragraphs.push(buffer.join(' '));
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (line.startsWith('```')) {
      inCode = !inCode;
      flush();
      continue;
    }
    if (inCode) continue;
    if (line.startsWith('---')) continue;

    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      flush();
      headings.push(stripMd(h[2]));
      continue;
    }

    const stripped = stripMd(line);
    if (!stripped) {
      flush();
      continue;
    }
    buffer.push(stripped);
  }
  flush();

  const firstParagraph = paragraphs.find((p) => p.length > 40) || paragraphs[0] || '';
  return { headings, paragraphs, firstParagraph };
}

/* ---------------- index build ---------------- */

const ENTRIES = [];

// 1) un'entry per ogni livello MDX
for (const { folder, topicId, level, source } of allMdxRaw()) {
  const found = findTopicByFolder(folder, topicId);
  if (!found) continue;
  const { category, topic } = found;
  const parsed = parseMdx(source);

  ENTRIES.push({
    type: 'topic',
    category,
    topic,
    level,
    title: topic.title,
    headings: parsed.headings,
    snippet: parsed.firstParagraph,
    haystack: normalize(
      [
        joinAllLangs(topic.title),
        joinAllLangs(topic.desc),
        joinAllLangs(category.title),
        category.code,
        level,
        parsed.headings.join(' '),
        parsed.paragraphs.join(' ')
      ].join(' ')
    ),
    url: `/topic/${category.id}/${topic.id}/${level}`
  });
}

// 2) un'entry per ogni flashcard
for (const [deckId, cards] of Object.entries(FLASHCARDS)) {
  const cat = CATEGORIES.find((c) => c.id === deckId);
  cards.forEach((card, i) => {
    ENTRIES.push({
      type: 'flashcard',
      category: cat,
      title: card.q,
      snippet: card.a,
      haystack: normalize(
        `${joinAllLangs(card.q)} ${joinAllLangs(card.a)} ${joinAllLangs(cat?.title)}`
      ),
      url: `/flashcards/${deckId}`,
      cardIndex: i
    });
  });
}

// 3) un'entry per ogni quiz question
for (const [quizId, questions] of Object.entries(QUIZZES)) {
  const cat = CATEGORIES.find((c) => c.id === quizId);
  questions.forEach((q, i) => {
    ENTRIES.push({
      type: 'quiz',
      category: cat,
      title: q.q,
      snippet: q.explanation,
      haystack: normalize(
        `${joinAllLangs(q.q)} ${q.options.map(joinAllLangs).join(' ')} ${joinAllLangs(q.explanation)} ${joinAllLangs(cat?.title)}`
      ),
      url: `/quiz/${quizId}`,
      questionIndex: i
    });
  });
}

/* ---------------- search ---------------- */

export function search(query, { limit = 50 } = {}) {
  const toks = tokens(query);
  if (!toks.length) return [];

  const results = [];
  for (const e of ENTRIES) {
    // AND: tutti i token devono comparire nell'haystack
    let matched = true;
    for (const t of toks) {
      if (!e.haystack.includes(t)) {
        matched = false;
        break;
      }
    }
    if (!matched) continue;

    // scoring
    let score = 0;
    const nTitle = normalize(joinAllLangs(e.title));
    for (const t of toks) {
      if (nTitle.startsWith(t)) score += 200;
      else if (nTitle.includes(t)) score += 100;
      if (e.headings && e.headings.some((h) => normalize(h).includes(t))) score += 40;
      if (e.type === 'topic') score += 10; // i topic vincono leggermente
    }
    // bonus per match esatti dell'intera query nel titolo
    if (nTitle.includes(normalize(query))) score += 150;

    results.push({ ...e, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/* ---------------- highlight helper ---------------- */

/**
 * Genera tokens [{text, hit}] in cui i match della query sono marcati `hit: true`.
 * Case/accent-insensitive ma preserva il testo originale.
 */
export function highlight(text, query) {
  const toks = tokens(query);
  if (!toks.length || !text) return [{ text, hit: false }];

  const nText = normalize(text);
  const ranges = [];
  for (const t of toks) {
    if (!t) continue;
    let i = 0;
    while (i < nText.length) {
      const found = nText.indexOf(t, i);
      if (found === -1) break;
      ranges.push([found, found + t.length]);
      i = found + t.length;
    }
  }
  if (!ranges.length) return [{ text, hit: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }

  const out = [];
  let cur = 0;
  for (const [s, e] of merged) {
    if (cur < s) out.push({ text: text.slice(cur, s), hit: false });
    out.push({ text: text.slice(s, e), hit: true });
    cur = e;
  }
  if (cur < text.length) out.push({ text: text.slice(cur), hit: false });
  return out;
}

/** Restituisce uno snippet centrato sul primo match della query. */
export function makeSnippet(text, query, radius = 90) {
  if (!text) return '';
  const toks = tokens(query);
  if (!toks.length) return text.slice(0, radius * 2);
  const nText = normalize(text);
  let pos = -1;
  for (const t of toks) {
    const i = nText.indexOf(t);
    if (i !== -1 && (pos === -1 || i < pos)) pos = i;
  }
  if (pos === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, pos - radius);
  const end = Math.min(text.length, pos + radius);
  const prefix = start > 0 ? '… ' : '';
  const suffix = end < text.length ? ' …' : '';
  return prefix + text.slice(start, end) + suffix;
}
