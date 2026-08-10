/**
 * Catalogo dei contenuti DevDex.
 *
 * Gerarchia:
 *   GROUP (macro-area: Linguaggi, Framework, Database, …)
 *     └── CATEGORY (es. Java, Spring, Quarkus, …)
 *           └── TOPIC (es. Stream API, @Transactional, …)
 *                 └── LEVELS (principiante, medio, avanzato → file MDX)
 *
 * Ogni topic ha `folder` che indica la cartella sotto src/content/<folder>/ dove
 * vivono i suoi file MDX (decoupling tra raggruppamento-display e cartella-fonte).
 *
 * I campi user-visible (title, desc) sono oggetti { it, en } risolti a runtime
 * dal hook useTc() in base alla lingua attiva.
 */
import {
  Coffee,
  Leaf,
  Database,
  Network,
  BrainCircuit,
  Sparkles,
  Boxes,
  Lock,
  Layers,
  Layers3,
  Workflow,
  Spline,
  Globe2,
  Cpu,
  Bot,
  Smartphone,
  Sprout,
  Cog,
  Flame,
  Repeat,
  ShieldCheck,
  Split,
  Server,
  Component,
  Hourglass,
  GitMerge,
  Bell,
  Plug,
  Snowflake,
  Route,
  Cloud,
  Search,
  DatabaseZap,
  Telescope,
  Hexagon,
  CalendarClock,
  Zap,
  HardDrive,
  BookOpenCheck,
  Code2,
  Atom
} from 'lucide-react';

export const LEVELS = ['principiante', 'medio', 'avanzato'];

// LEVEL_META resta come fonte di verità per icon/color. Le label umane vengono
// dal dizionario translations.js (levelMeta.<lv>.label / .short / .desc).
export const LEVEL_META = {
  principiante: {
    icon: Sprout,
    color: '#22c55e'
  },
  medio: {
    icon: Cog,
    color: '#eab308'
  },
  avanzato: {
    icon: Flame,
    color: '#ef4444'
  }
};

/* ---- helper per dichiarare topic con folder ---- */
const t = (id, title, icon, desc, folder) => ({
  id,
  title,
  icon,
  desc,
  folder,
  levels: ['principiante', 'medio', 'avanzato']
});

/* ============================================================
 * GROUPS — macro aree visualizzate nella Home
 * ============================================================ */
export const GROUPS = [
  {
    id: 'languages',
    title: { it: 'Linguaggi', en: 'Languages' },
    desc: {
      it: 'Linguaggi di programmazione e loro ecosistemi.',
      en: 'Programming languages and their ecosystems.'
    },
    icon: Code2,
    color: '#F89820'
  },
  {
    id: 'frameworks',
    title: { it: 'Framework', en: 'Frameworks' },
    desc: {
      it: 'Framework backend e frontend, opinionated e leggeri.',
      en: 'Backend and frontend frameworks, opinionated and lightweight.'
    },
    icon: Boxes,
    color: '#6DB33F'
  },
  {
    id: 'database',
    title: { it: 'Database & Persistence', en: 'Database & Persistence' },
    desc: {
      it: 'RDBMS, NoSQL, ORM, indici, analisi query.',
      en: 'RDBMS, NoSQL, ORM, indexes, query analysis.'
    },
    icon: Database,
    color: '#0EA5E9'
  },
  {
    id: 'architecture',
    title: { it: 'Architettura & API', en: 'Architecture & API' },
    desc: {
      it: 'Stili API, microservizi, processo software.',
      en: 'API styles, microservices, software process.'
    },
    icon: Network,
    color: '#A855F7'
  },
  {
    id: 'ai',
    title: { it: 'AI & LLM', en: 'AI & LLM' },
    desc: {
      it: 'Integrazione di LLM, embedding, RAG, agent.',
      en: 'LLM integration, embeddings, RAG, agents.'
    },
    icon: BrainCircuit,
    color: '#EC4899'
  },
  {
    id: 'deep-extra',
    title: {
      it: 'Approfondimenti & Curiosità',
      en: 'Deep Dives & Curiosities'
    },
    desc: {
      it: 'JVM internals, Design Patterns, curiosità tecniche.',
      en: 'JVM internals, Design Patterns, technical curiosities.'
    },
    icon: Sparkles,
    color: '#EAB308'
  }
];

/* ============================================================
 * CATEGORIES — sotto ogni group; raggruppano i topic correlati
 * ============================================================ */
export const CATEGORIES = [
  /* -------- Linguaggi -------- */
  {
    id: 'java',
    groupId: 'languages',
    title: { it: 'Java', en: 'Java' },
    code: 'JAVA',
    color: '#F89820',
    icon: Coffee,
    desc: {
      it: 'Tutto Java: linguaggio, OOP, concorrenza, async, Stream, ForkJoinPool.',
      en: 'All things Java: language, OOP, concurrency, async, Streams, ForkJoinPool.'
    },
    topics: [
      t(
        'immutability',
        { it: 'Mutabilità & Immutabilità', en: 'Mutability & Immutability' },
        Lock,
        {
          it: 'Stringhe, wrapper, defensive copy, design immutabile.',
          en: 'Strings, wrappers, defensive copy, immutable design.'
        },
        'java-core'
      ),
      t(
        'oop',
        { it: 'OOP & SOLID', en: 'OOP & SOLID' },
        Component,
        {
          it: 'Ereditarietà vs composizione, polimorfismo, SOLID, Java specifics.',
          en: 'Inheritance vs composition, polymorphism, SOLID, Java specifics.'
        },
        'java-core'
      ),
      t(
        'varargs',
        { it: 'Varargs (String...)', en: 'Varargs (String...)' },
        Layers,
        {
          it: 'Sintassi, edge case e gestione array sotto il cofano.',
          en: 'Syntax, edge cases and array handling under the hood.'
        },
        'java-core'
      ),
      t(
        'streams',
        { it: 'Stream API', en: 'Stream API' },
        Spline,
        {
          it: 'Pipeline, lazy evaluation, Spliterator, stream paralleli.',
          en: 'Pipeline, lazy evaluation, Spliterator, parallel streams.'
        },
        'java-core'
      ),
      t(
        'async',
        { it: 'Sincrono vs Asincrono', en: 'Sync vs Async' },
        Repeat,
        {
          it: 'Callback, Future, executor model, Virtual Threads.',
          en: 'Callbacks, Future, executor model, Virtual Threads.'
        },
        'java-core'
      ),
      t(
        'completable-future',
        { it: 'CompletableFuture', en: 'CompletableFuture' },
        Hourglass,
        {
          it: 'Composizione, thenApply/Compose/Combine, exception handling, deep dive.',
          en: 'Composition, thenApply/Compose/Combine, exception handling, deep dive.'
        },
        'java-core'
      ),
      t(
        'fork-join-pool',
        { it: 'ForkJoinPool', en: 'ForkJoinPool' },
        GitMerge,
        {
          it: 'Divide-and-conquer, work-stealing, commonPool, ManagedBlocker.',
          en: 'Divide-and-conquer, work-stealing, commonPool, ManagedBlocker.'
        },
        'java-core'
      ),
      t(
        'callbacks',
        { it: 'Callback patterns', en: 'Callback patterns' },
        Bell,
        {
          it: 'Listener, callback hell, da callback a Future a reactive.',
          en: 'Listeners, callback hell, from callback to Future to reactive.'
        },
        'java-core'
      )
    ]
  },

  /* -------- Framework -------- */
  {
    id: 'spring',
    groupId: 'frameworks',
    title: { it: 'Spring', en: 'Spring' },
    code: 'SPR',
    color: '#6DB33F',
    icon: Leaf,
    desc: {
      it: 'Spring Boot, DI, AOP, @Transactional, DispatcherServlet, WebClient, Cloud.',
      en: 'Spring Boot, DI, AOP, @Transactional, DispatcherServlet, WebClient, Cloud.'
    },
    topics: [
      t(
        'spring-boot',
        { it: 'Spring Boot core', en: 'Spring Boot core' },
        Server,
        {
          it: 'Auto-configuration, starter, conditional beans, profili.',
          en: 'Auto-configuration, starters, conditional beans, profiles.'
        },
        'spring'
      ),
      t(
        'dependency-injection',
        { it: 'Dependency Injection', en: 'Dependency Injection' },
        Plug,
        {
          it: 'IoC, costruttore vs setter vs field, scope, BeanPostProcessor.',
          en: 'IoC, constructor vs setter vs field, scopes, BeanPostProcessor.'
        },
        'spring'
      ),
      t(
        'aop',
        { it: 'AOP (Aspect Oriented)', en: 'AOP (Aspect Oriented)' },
        Layers3,
        {
          it: 'Cross-cutting concerns, aspect, advice, pointcut, proxy.',
          en: 'Cross-cutting concerns, aspects, advice, pointcut, proxy.'
        },
        'spring'
      ),
      t(
        'lazy',
        { it: '@Lazy & startup', en: '@Lazy & startup' },
        Snowflake,
        {
          it: 'Bean lazy, spezzare cicli, lazy-init globale, performance.',
          en: 'Lazy beans, breaking cycles, global lazy-init, performance.'
        },
        'spring'
      ),
      t(
        'transactional',
        { it: '@Transactional', en: '@Transactional' },
        ShieldCheck,
        {
          it: 'Propagation, isolation, self-invocation pitfalls.',
          en: 'Propagation, isolation, self-invocation pitfalls.'
        },
        'spring'
      ),
      t(
        'dispatcher-servlet',
        { it: 'DispatcherServlet', en: 'DispatcherServlet' },
        Route,
        {
          it: 'Front controller, HandlerMapping, request lifecycle.',
          en: 'Front controller, HandlerMapping, request lifecycle.'
        },
        'spring'
      ),
      t(
        'resttemplate-vs-webclient',
        { it: 'RestTemplate vs WebClient', en: 'RestTemplate vs WebClient' },
        Split,
        {
          it: 'Blocking vs reactive, backpressure, migration path.',
          en: 'Blocking vs reactive, backpressure, migration path.'
        },
        'spring'
      ),
      t(
        'spring-cloud',
        { it: 'Spring Cloud', en: 'Spring Cloud' },
        Cloud,
        {
          it: 'Service discovery, config server, gateway, resilience, tracing.',
          en: 'Service discovery, config server, gateway, resilience, tracing.'
        },
        'spring'
      )
    ]
  },
  {
    id: 'quarkus',
    groupId: 'frameworks',
    title: { it: 'Quarkus', en: 'Quarkus' },
    code: 'QRK',
    color: '#4695EB',
    icon: Cpu,
    desc: {
      it: 'Framework Java "supersonic, subatomic": GraalVM, AOT, dev mode.',
      en: 'Java framework "supersonic, subatomic": GraalVM, AOT, dev mode.'
    },
    topics: [
      t(
        'quarkus',
        { it: 'Quarkus', en: 'Quarkus' },
        Cpu,
        {
          it: 'Native image, GraalVM, dev mode supersonic.',
          en: 'Native image, GraalVM, supersonic dev mode.'
        },
        'emerging-tech'
      )
    ]
  },
  {
    id: 'vite-react',
    groupId: 'frameworks',
    title: { it: 'Vite + React', en: 'Vite + React' },
    code: 'VITE',
    color: '#61DAFB',
    icon: Atom,
    desc: {
      it: 'Stack frontend moderno: ESM nativo, HMR, build con Rollup.',
      en: 'Modern frontend stack: native ESM, HMR, Rollup-based build.'
    },
    topics: [
      t(
        'vite-react',
        { it: 'Vite + React', en: 'Vite + React' },
        Zap,
        {
          it: 'ESM nativo, HMR, build, plugin, perché ha vinto su Webpack/CRA.',
          en: 'Native ESM, HMR, build, plugins, why it won over Webpack/CRA.'
        },
        'emerging-tech'
      )
    ]
  },

  /* -------- Database & Persistence -------- */
  {
    id: 'database-persistence',
    groupId: 'database',
    title: { it: 'Database & Persistence', en: 'Database & Persistence' },
    code: 'DB',
    color: '#0EA5E9',
    icon: Database,
    desc: {
      it: 'ACID, indici, SQL vs NoSQL, JDBC vs Hibernate, analisi query.',
      en: 'ACID, indexes, SQL vs NoSQL, JDBC vs Hibernate, query analysis.'
    },
    topics: [
      t(
        'acid',
        { it: 'Proprietà A.C.I.D.', en: 'A.C.I.D. properties' },
        ShieldCheck,
        {
          it: 'Atomicità, Consistenza, Isolamento, Durabilità.',
          en: 'Atomicity, Consistency, Isolation, Durability.'
        },
        'data-persistence'
      ),
      t(
        'indexes',
        { it: 'Indici DB', en: 'DB Indexes' },
        Search,
        {
          it: 'B-tree, hash, covering, partial, GIN/GiST, leftmost prefix.',
          en: 'B-tree, hash, covering, partial, GIN/GiST, leftmost prefix.'
        },
        'data-persistence'
      ),
      t(
        'sql-vs-nosql',
        { it: 'SQL vs NoSQL', en: 'SQL vs NoSQL' },
        Split,
        {
          it: "Modelli, casi d'uso, MongoDB vs MySQL/MariaDB.",
          en: 'Models, use cases, MongoDB vs MySQL/MariaDB.'
        },
        'data-persistence'
      ),
      t(
        'jdbc-vs-hibernate',
        { it: 'JDBC vs Hibernate', en: 'JDBC vs Hibernate' },
        DatabaseZap,
        {
          it: 'API low-level vs ORM, sessione, dirty checking, JPA, costi.',
          en: 'Low-level API vs ORM, session, dirty checking, JPA, costs.'
        },
        'data-persistence'
      ),
      t(
        'query-analysis',
        { it: 'Analisi query complesse', en: 'Complex query analysis' },
        Telescope,
        {
          it: 'EXPLAIN, statistiche, piani esecuzione, N+1, profiling.',
          en: 'EXPLAIN, statistics, execution plans, N+1, profiling.'
        },
        'data-persistence'
      )
    ]
  },

  /* -------- Architettura & API -------- */
  {
    id: 'api-communication',
    groupId: 'architecture',
    title: { it: 'API & Communication', en: 'API & Communication' },
    code: 'API',
    color: '#6366F1',
    icon: Globe2,
    desc: {
      it: 'REST, SOAP, RPC, GraphQL: stili API e comunicazione.',
      en: 'REST, SOAP, RPC, GraphQL: API styles and communication.'
    },
    topics: [
      t(
        'rest-vs-soap-vs-rpc',
        { it: 'REST vs SOAP vs RPC', en: 'REST vs SOAP vs RPC' },
        Globe2,
        {
          it: 'Stili architetturali, trade-off, quando usarli.',
          en: 'Architectural styles, trade-offs, when to use them.'
        },
        'architettura'
      ),
      t(
        'graphql',
        { it: 'GraphQL', en: 'GraphQL' },
        Hexagon,
        {
          it: 'Schema, query, mutation, subscription, N+1, persisted queries.',
          en: 'Schema, query, mutation, subscription, N+1, persisted queries.'
        },
        'architettura'
      )
    ]
  },
  {
    id: 'architecture-process',
    groupId: 'architecture',
    title: { it: 'Architettura & Processo', en: 'Architecture & Process' },
    code: 'ARC',
    color: '#A855F7',
    icon: Workflow,
    desc: {
      it: 'Microservizi, sagas, SDLC, DevOps, DORA metrics.',
      en: 'Microservices, sagas, SDLC, DevOps, DORA metrics.'
    },
    topics: [
      t(
        'microservices',
        { it: 'Microservizi', en: 'Microservices' },
        Workflow,
        {
          it: 'Bounded context, comunicazione, saga, observability.',
          en: 'Bounded context, communication, saga, observability.'
        },
        'architettura'
      ),
      t(
        'sdlc',
        {
          it: 'Software Development Lifecycle',
          en: 'Software Development Lifecycle'
        },
        CalendarClock,
        {
          it: 'Waterfall, Agile, DevOps, CI/CD, DORA metrics.',
          en: 'Waterfall, Agile, DevOps, CI/CD, DORA metrics.'
        },
        'architettura'
      )
    ]
  },

  /* -------- AI & LLM -------- */
  {
    id: 'spring-ai',
    groupId: 'ai',
    title: { it: 'Spring AI & LangChain4j', en: 'Spring AI & LangChain4j' },
    code: 'AI',
    color: '#EC4899',
    icon: Bot,
    desc: {
      it: 'LLM in Java: prompt, embeddings, RAG, function calling, agent.',
      en: 'LLMs in Java: prompts, embeddings, RAG, function calling, agents.'
    },
    topics: [
      t(
        'spring-ai',
        { it: 'Spring AI & LangChain4j', en: 'Spring AI & LangChain4j' },
        Bot,
        {
          it: 'LLM in Java: prompt, embeddings, RAG, agent.',
          en: 'LLMs in Java: prompts, embeddings, RAG, agents.'
        },
        'emerging-tech'
      )
    ]
  },

  /* -------- Approfondimenti & Curiosità -------- */
  {
    id: 'jvm-internals',
    groupId: 'deep-extra',
    title: { it: 'JVM Internals', en: 'JVM Internals' },
    code: 'JVM',
    color: '#10B981',
    icon: HardDrive,
    desc: {
      it: 'Memory model, GC, JIT, classloader, escape analysis, Loom.',
      en: 'Memory model, GC, JIT, classloader, escape analysis, Loom.'
    },
    topics: [
      t(
        'jvm-internals',
        { it: 'JVM internals', en: 'JVM internals' },
        HardDrive,
        {
          it: 'Memory model, GC, JIT, classloader, escape analysis.',
          en: 'Memory model, GC, JIT, classloader, escape analysis.'
        },
        'extra'
      )
    ]
  },
  {
    id: 'design-patterns',
    groupId: 'deep-extra',
    title: { it: 'Design Patterns', en: 'Design Patterns' },
    code: 'PAT',
    color: '#EAB308',
    icon: BookOpenCheck,
    desc: {
      it: 'GoF, creazionali / strutturali / comportamentali, Java moderno.',
      en: 'GoF, creational / structural / behavioral, modern Java.'
    },
    topics: [
      t(
        'design-patterns',
        { it: 'Design Patterns', en: 'Design Patterns' },
        BookOpenCheck,
        {
          it: 'GoF, creazionali / strutturali / comportamentali, Java moderno.',
          en: 'GoF, creational / structural / behavioral, modern Java.'
        },
        'extra'
      )
    ]
  },
  {
    id: 'curiosita',
    groupId: 'deep-extra',
    title: { it: 'Curiosità tecniche', en: 'Technical curiosities' },
    code: 'EX',
    color: '#FACC15',
    icon: Sparkles,
    desc: {
      it: 'Topic insoliti ma istruttivi: Swift su Android, NDK toolchain.',
      en: 'Unusual but instructive topics: Swift on Android, NDK toolchain.'
    },
    topics: [
      t(
        'swift-on-android',
        { it: 'Swift su Android', en: 'Swift on Android' },
        Smartphone,
        {
          it: 'NDK toolchain, perché funziona, perché è raro.',
          en: 'NDK toolchain, why it works, why it is rare.'
        },
        'extra'
      )
    ]
  }
];

/* ============================================================
 * helpers
 * ============================================================ */

const ENTRIES = [];
let counter = 1;
for (const c of CATEGORIES) {
  for (const tp of c.topics) {
    ENTRIES.push({
      number: counter++,
      categoryId: c.id,
      topicId: tp.id
    });
  }
}

export function getDexNumber(categoryId, topicId) {
  const entry = ENTRIES.find(
    (e) => e.categoryId === categoryId && e.topicId === topicId
  );
  return entry ? entry.number : 0;
}

export function getTotalEntries() {
  return ENTRIES.length;
}

export function getCategoryNumber(categoryId) {
  return CATEGORIES.findIndex((c) => c.id === categoryId) + 1;
}

export function findCategory(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) || null;
}

export function findGroup(groupId) {
  return GROUPS.find((g) => g.id === groupId) || null;
}

export function findTopic(categoryId, topicId) {
  const cat = findCategory(categoryId);
  if (!cat) return null;
  const topic = cat.topics.find((tp) => tp.id === topicId) || null;
  return topic ? { category: cat, topic } : null;
}

/** Cerca un topic dato `folder + topicId` (per l'indice di ricerca, che parte
 * dai file MDX senza conoscere la categoria a priori). */
export function findTopicByFolder(folder, topicId) {
  for (const c of CATEGORIES) {
    const topic = c.topics.find((tp) => tp.folder === folder && tp.id === topicId);
    if (topic) return { category: c, topic };
  }
  return null;
}

/** Restituisce array `[{ group, categories: [...] }]` per il render raggruppato. */
export function getCategoriesGrouped() {
  return GROUPS.map((g) => ({
    group: g,
    categories: CATEGORIES.filter((c) => c.groupId === g.id)
  }));
}

/** Formatta come "#001" */
export function fmtNum(n, pad = 3) {
  return '#' + String(n).padStart(pad, '0');
}
