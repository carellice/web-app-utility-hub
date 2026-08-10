/**
 * Carica gli MDX in modo eager con import.meta.glob.
 *
 * Path layout:
 *   src/content/<folder>/<topicId>.<level>.mdx          → default (IT)
 *   src/content/<folder>/<topicId>.<level>.<lang>.mdx   → variante per lingua
 *
 * `getMdxComponent(folder, topicId, level, lang)` ritorna la variante per
 * `lang` se esiste, altrimenti fallback al file IT di default.
 */
import { DEFAULT_LANG } from './translations.js';

const modules = import.meta.glob('../content/**/*.mdx', { eager: true });
const raw = import.meta.glob('../content/**/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default'
});

// Match sia `topic.level.mdx` (IT) sia `topic.level.<lang>.mdx`.
const PATH_RX =
  /\.\.\/content\/([^/]+)\/([^/]+)\.(principiante|medio|avanzato)(?:\.([a-z]{2}))?\.mdx$/;

const componentMap = {};
const rawMap = {};

function makeKey(folder, topicId, level, lang) {
  return `${folder}/${topicId}/${level}/${lang || DEFAULT_LANG}`;
}

for (const path in modules) {
  const m = path.match(PATH_RX);
  if (!m) continue;
  const [, folder, topicId, level, lang] = m;
  componentMap[makeKey(folder, topicId, level, lang)] = modules[path].default;
}

for (const path in raw) {
  const m = path.match(PATH_RX);
  if (!m) continue;
  const [, folder, topicId, level, lang] = m;
  rawMap[makeKey(folder, topicId, level, lang)] = raw[path];
}

export function getMdxComponent(folder, topicId, level, lang) {
  const want = makeKey(folder, topicId, level, lang);
  if (componentMap[want]) return componentMap[want];
  const fallback = makeKey(folder, topicId, level, DEFAULT_LANG);
  return componentMap[fallback] || null;
}

export function hasMdx(folder, topicId, level, lang) {
  return Boolean(getMdxComponent(folder, topicId, level, lang));
}

export function getMdxRaw(folder, topicId, level, lang) {
  const want = makeKey(folder, topicId, level, lang);
  if (rawMap[want]) return rawMap[want];
  const fallback = makeKey(folder, topicId, level, DEFAULT_LANG);
  return rawMap[fallback] || null;
}

export function allMdxRaw() {
  return Object.entries(rawMap).map(([key, source]) => {
    const [folder, topicId, level, lang] = key.split('/');
    return { folder, topicId, level, lang, source };
  });
}
