/**
 * Mazzi di flashcards per categoria.
 * Il deckId combacia con il categoryId in catalog.js.
 *
 * Ogni `q` / `a` è un oggetto { it, en } risolto a runtime da useTc().
 */
export const FLASHCARDS = {
  java: [
    {
      q: {
        it: 'Perché String è immutabile in Java?',
        en: 'Why is String immutable in Java?'
      },
      a: {
        it: 'Per thread-safety, ottimizzazione del String Pool, sicurezza (es. classloader/permessi che usano stringhe come chiavi) e per garantire un hashCode stabile.',
        en: 'For thread-safety, String Pool optimization, security (e.g. classloaders/permissions that use strings as keys) and to guarantee a stable hashCode.'
      }
    },
    {
      q: {
        it: 'Varargs: cosa riceve effettivamente il metodo?',
        en: 'Varargs: what does the method actually receive?'
      },
      a: {
        it: 'Un array dello stesso tipo. `String...` è zucchero per `String[]`. Passare un array esplicito lo riusa, passare null va castato.',
        en: 'An array of the same type. `String...` is sugar for `String[]`. Passing an explicit array reuses it; passing null must be cast.'
      }
    },
    {
      q: {
        it: 'Cosa significa "defensive copy"?',
        en: 'What does "defensive copy" mean?'
      },
      a: {
        it: 'Restituire/accettare copie difensive di oggetti mutabili (es. Date, collezioni) per preservare lo stato interno della classe.',
        en: 'Returning/accepting defensive copies of mutable objects (e.g. Date, collections) to preserve the class internal state.'
      }
    },
    {
      q: {
        it: "Cos'è LSP (Liskov Substitution)?",
        en: 'What is LSP (Liskov Substitution)?'
      },
      a: {
        it: 'Un sottotipo deve essere usabile al posto del supertipo senza alterare la correttezza del programma. Es. Square che eredita Rectangle viola LSP.',
        en: 'A subtype must be usable in place of the supertype without altering program correctness. E.g. Square extending Rectangle violates LSP.'
      }
    },
    {
      q: {
        it: 'Differenza tra ereditarietà e composizione?',
        en: 'Difference between inheritance and composition?'
      },
      a: {
        it: 'Ereditarietà accoppia "is-a" rigido (fragile base class). Composizione ("has-a") delega a un collaboratore: più flessibile, testabile, raccomandata in genere.',
        en: 'Inheritance is a rigid "is-a" coupling (fragile base class). Composition ("has-a") delegates to a collaborator: more flexible, testable, generally recommended.'
      }
    },
    {
      q: {
        it: 'A cosa servono i record (Java 16+)?',
        en: 'What are records (Java 16+) for?'
      },
      a: {
        it: 'DTO/Value Object immutabili con costruttore canonico, accessor, equals/hashCode/toString automatici. Niente boilerplate.',
        en: 'Immutable DTOs/Value Objects with canonical constructor, accessors, automatic equals/hashCode/toString. No boilerplate.'
      }
    },
    {
      q: {
        it: 'Sealed class: a cosa servono?',
        en: 'Sealed classes: what are they for?'
      },
      a: {
        it: 'Limitano chi può estenderle (permits). Abilitano switch esaustivo con pattern matching senza default.',
        en: 'They restrict who can extend them (permits). They enable exhaustive switches with pattern matching, no default needed.'
      }
    },
    {
      q: {
        it: "Cos'è una vtable?",
        en: 'What is a vtable?'
      },
      a: {
        it: 'Una tabella per classe con i puntatori ai metodi virtuali. invokevirtual la consulta per dispatch dinamico. Il JIT può inlinare se la call site è monomorfica.',
        en: 'A per-class table with pointers to virtual methods. invokevirtual consults it for dynamic dispatch. The JIT can inline if the call site is monomorphic.'
      }
    },
    {
      q: {
        it: "Cos'è invokedynamic e dove lo usa Java?",
        en: 'What is invokedynamic and where does Java use it?'
      },
      a: {
        it: 'Istruzione bytecode che linka una call site a runtime. Usato per: lambda (LambdaMetafactory), concatenazione String (Java 9+), pattern matching (Java 21+).',
        en: 'Bytecode instruction that links a call site at runtime. Used for: lambdas (LambdaMetafactory), String concatenation (Java 9+), pattern matching (Java 21+).'
      }
    },
    {
      q: {
        it: 'PECS: cosa significa?',
        en: 'PECS: what does it mean?'
      },
      a: {
        it: 'Producer-Extends, Consumer-Super. List<? extends T> per leggere (produce T), List<? super T> per scrivere (consuma T). Gestione varianza nei generics.',
        en: 'Producer-Extends, Consumer-Super. List<? extends T> to read (produces T), List<? super T> to write (consumes T). Variance handling in generics.'
      }
    },
    {
      q: {
        it: 'Differenza tra Stream sequenziale e parallelo?',
        en: 'Difference between sequential and parallel Stream?'
      },
      a: {
        it: 'Il parallelo divide la sorgente con uno Spliterator e usa il common ForkJoinPool. Va usato solo con grandi dataset, operazioni CPU-bound e senza stato condiviso/IO.',
        en: 'The parallel one splits the source via a Spliterator and uses the common ForkJoinPool. Only use it with large datasets, CPU-bound operations and no shared state/IO.'
      }
    },
    {
      q: {
        it: 'CompletableFuture: differenza tra thenApply e thenApplyAsync?',
        en: 'CompletableFuture: difference between thenApply and thenApplyAsync?'
      },
      a: {
        it: 'thenApply esegue nella stessa thread del completamento; thenApplyAsync ne fa il submit su un Executor (di default il commonPool del ForkJoinPool).',
        en: 'thenApply runs on the same thread as the completion; thenApplyAsync submits it to an Executor (by default the ForkJoinPool commonPool).'
      }
    },
    {
      q: {
        it: 'allOf di CompletableFuture short-circuita su errore?',
        en: 'Does CompletableFuture.allOf short-circuit on error?'
      },
      a: {
        it: "No: aspetta che tutti i child completino (anche quelli falliti) prima di segnalare l'eccezione. Per fast-fail serve combinare con anyOf su un detector.",
        en: 'No: it waits for all children to complete (even failed ones) before signaling the exception. For fast-fail combine with anyOf on a detector.'
      }
    },
    {
      q: {
        it: 'CompletableFuture.cancel(true) interrompe il task?',
        en: 'Does CompletableFuture.cancel(true) interrupt the task?'
      },
      a: {
        it: 'No: completa la future con CancellationException. Non manda Thread.interrupt() al task in esecuzione, che deve cooperare per cancellarsi.',
        en: 'No: it completes the future with CancellationException. It does not Thread.interrupt() the running task, which must cooperate to cancel.'
      }
    },
    {
      q: {
        it: "Cos'è il work-stealing nel ForkJoinPool?",
        en: 'What is work-stealing in ForkJoinPool?'
      },
      a: {
        it: "Quando un worker finisce i task della sua deque locale, ruba task da quelle di altri worker. Massimizza l'utilizzo CPU senza coordinatore centrale.",
        en: 'When a worker finishes the tasks in its local deque, it steals tasks from other workers. Maximizes CPU usage without a central coordinator.'
      }
    },
    {
      q: {
        it: 'A cosa serve ManagedBlocker?',
        en: 'What is ManagedBlocker for?'
      },
      a: {
        it: 'Permette a un task ForkJoin di bloccarsi (lock, I/O) chiedendo al pool di creare worker temporanei di compensazione, evitando starvation.',
        en: 'Allows a ForkJoin task to block (lock, I/O) by asking the pool to spin up temporary compensating workers, avoiding starvation.'
      }
    },
    {
      q: {
        it: "Cos'è la callback hell?",
        en: 'What is callback hell?'
      },
      a: {
        it: 'Annidamento profondo di callback per operazioni in serie. CompletableFuture, Reactor o virtual thread la risolvono linearizzando il flusso.',
        en: 'Deep nesting of callbacks for serial operations. CompletableFuture, Reactor or virtual threads solve it by linearizing the flow.'
      }
    },
    {
      q: {
        it: 'Single-fire vs multi-fire callback?',
        en: 'Single-fire vs multi-fire callbacks?'
      },
      a: {
        it: 'Single-fire (download, RPC) mappano naturalmente su CompletableFuture. Multi-fire (eventi, stream) su Flow.Publisher / Flux / RxJava Observable.',
        en: 'Single-fire (download, RPC) map naturally to CompletableFuture. Multi-fire (events, streams) to Flow.Publisher / Flux / RxJava Observable.'
      }
    },
    {
      q: {
        it: 'Virtual threads vs platform threads?',
        en: 'Virtual threads vs platform threads?'
      },
      a: {
        it: 'Virtual: leggerissimi, gestiti dalla JVM, parcheggiati su blocking I/O. Platform: 1:1 con OS thread, pesanti. VT sostituiscono molti pool I/O.',
        en: 'Virtual: very lightweight, managed by the JVM, parked on blocking I/O. Platform: 1:1 with OS threads, heavy. VTs replace many I/O pools.'
      }
    },
    {
      q: {
        it: 'Quando usare parallelStream()?',
        en: 'When to use parallelStream()?'
      },
      a: {
        it: 'Dataset grande, operazione CPU-bound pura, sorgente splittabile bene (ArrayList, IntStream.range). Mai con I/O o stato condiviso non thread-safe.',
        en: 'Large dataset, pure CPU-bound operation, well-splittable source (ArrayList, IntStream.range). Never with I/O or non-thread-safe shared state.'
      }
    }
  ],

  spring: [
    {
      q: {
        it: "Cosa fa l'auto-configuration di Spring Boot?",
        en: 'What does Spring Boot auto-configuration do?'
      },
      a: {
        it: 'Carica automaticamente bean basandosi su classpath, properties e @Conditional. Definita in META-INF/spring/...AutoConfiguration.imports (>=Boot 3).',
        en: 'Automatically loads beans based on classpath, properties and @Conditional. Declared in META-INF/spring/...AutoConfiguration.imports (>=Boot 3).'
      }
    },
    {
      q: {
        it: 'Perché @Transactional può non funzionare con self-invocation?',
        en: 'Why may @Transactional fail with self-invocation?'
      },
      a: {
        it: 'Usa un proxy: invocando un metodo dello stesso bean tramite `this.metodo()` si bypassa il proxy, e quindi la transazione non viene aperta.',
        en: 'It uses a proxy: calling a method of the same bean via `this.method()` bypasses the proxy, so the transaction is not started.'
      }
    },
    {
      q: {
        it: 'Constructor vs field injection: perché preferire il primo?',
        en: 'Constructor vs field injection: why prefer the former?'
      },
      a: {
        it: 'Campi final, dipendenze esplicite, testabilità (senza Spring nei test), niente NPE da @Autowired dimenticato.',
        en: 'Final fields, explicit dependencies, testability (no Spring in tests), no NPE from a forgotten @Autowired.'
      }
    },
    {
      q: {
        it: 'Cosa fa @Lazy su un bean?',
        en: 'What does @Lazy do on a bean?'
      },
      a: {
        it: "Posticipa l'istanziazione fino al primo uso. Su un punto di iniezione: inietta un proxy che risolve il target alla prima chiamata.",
        en: 'It delays instantiation until first use. On an injection point: injects a proxy that resolves the target on first call.'
      }
    },
    {
      q: {
        it: 'Spring 2.6+ permette cicli di dipendenza?',
        en: 'Does Spring 2.6+ allow dependency cycles?'
      },
      a: {
        it: 'No, disabilitati di default. Soluzioni: redesign, @Lazy su una delle due dipendenze, oppure spring.main.allow-circular-references=true (sconsigliato).',
        en: 'No, disabled by default. Fixes: redesign, @Lazy on one of the two dependencies, or spring.main.allow-circular-references=true (not recommended).'
      }
    },
    {
      q: {
        it: "AOP: cos'è un joinpoint?",
        en: 'AOP: what is a joinpoint?'
      },
      a: {
        it: 'Un punto del programma dove un aspect può intervenire (in Spring AOP: invocazione di un metodo public di un bean).',
        en: 'A point in the program where an aspect can intervene (in Spring AOP: invocation of a public method on a bean).'
      }
    },
    {
      q: {
        it: 'Spring AOP vs AspectJ: quale intercetta self-invocation?',
        en: 'Spring AOP vs AspectJ: which intercepts self-invocation?'
      },
      a: {
        it: 'Solo AspectJ con weaving (compile/load-time). Spring AOP è basato su proxy: invocazioni interne `this.metodo()` non passano per il proxy.',
        en: 'Only AspectJ with weaving (compile/load-time). Spring AOP is proxy-based: internal `this.method()` calls do not go through the proxy.'
      }
    },
    {
      q: {
        it: 'Propagation REQUIRES_NEW: quando usarla?',
        en: 'Propagation REQUIRES_NEW: when to use it?'
      },
      a: {
        it: 'Quando vuoi una transazione separata che commit/rollback indipendentemente da quella esterna. Tipico: audit log che deve essere scritto anche se la business tx rolla.',
        en: 'When you want a separate transaction that commits/rolls back independently from the outer one. Typical: audit log that must be written even if the business tx rolls back.'
      }
    },
    {
      q: {
        it: "Cos'è il proxy CGLIB e quando viene usato?",
        en: 'What is the CGLIB proxy and when is it used?'
      },
      a: {
        it: 'Sottoclasse generata a runtime; usato da Spring quando il bean non implementa interfacce. Richiede che la classe non sia final.',
        en: 'A runtime-generated subclass; used by Spring when the bean does not implement interfaces. The class must not be final.'
      }
    },
    {
      q: {
        it: "Cos'è un BeanPostProcessor?",
        en: 'What is a BeanPostProcessor?'
      },
      a: {
        it: "Un componente che intercetta l'istanza di ogni bean prima/dopo l'inizializzazione (es. AspectJ proxy creation). Diverso da BeanFactoryPostProcessor che lavora sulle definitions.",
        en: 'A component that hooks each bean instance before/after initialization (e.g. AspectJ proxy creation). Different from BeanFactoryPostProcessor, which acts on definitions.'
      }
    },
    {
      q: {
        it: 'RestTemplate vs WebClient: differenza chiave?',
        en: 'RestTemplate vs WebClient: key difference?'
      },
      a: {
        it: 'RestTemplate è blocking/sincrono ed è in maintenance mode. WebClient è non-blocking, reattivo (Reactor), supporta backpressure e streaming.',
        en: 'RestTemplate is blocking/synchronous and in maintenance mode. WebClient is non-blocking, reactive (Reactor), supports backpressure and streaming.'
      }
    },
    {
      q: {
        it: "Cos'è la DispatcherServlet?",
        en: 'What is the DispatcherServlet?'
      },
      a: {
        it: 'Il front controller di Spring MVC: riceve le HTTP request, le mappa su HandlerMapping/HandlerAdapter e gestisce la view resolution.',
        en: 'The Spring MVC front controller: receives HTTP requests, maps them via HandlerMapping/HandlerAdapter and handles view resolution.'
      }
    },
    {
      q: {
        it: 'Filter vs Interceptor in Spring MVC?',
        en: 'Filter vs Interceptor in Spring MVC?'
      },
      a: {
        it: 'Filter: livello Servlet, prima della DispatcherServlet (security, gzip). Interceptor: dentro Spring, con accesso a HandlerMapping e modello.',
        en: 'Filter: Servlet level, before the DispatcherServlet (security, gzip). Interceptor: inside Spring, with access to HandlerMapping and the model.'
      }
    },
    {
      q: {
        it: 'Spring Cloud Config: a cosa serve?',
        en: 'Spring Cloud Config: what is it for?'
      },
      a: {
        it: 'Configurazione centralizzata (Git/Vault) per microservizi. Permette refresh dinamico con @RefreshScope e /actuator/refresh.',
        en: 'Centralized configuration (Git/Vault) for microservices. Enables dynamic refresh via @RefreshScope and /actuator/refresh.'
      }
    },
    {
      q: {
        it: "Cos'è @RefreshScope?",
        en: 'What is @RefreshScope?'
      },
      a: {
        it: 'Uno scope custom: al refresh i bean vengono distrutti e ricreati con le nuove properties. Mantiene la referenza tramite proxy nei singleton.',
        en: 'A custom scope: on refresh, beans are destroyed and recreated with new properties. References are kept via a proxy in singletons.'
      }
    },
    {
      q: {
        it: 'OpenFeign: come funziona @FeignClient?',
        en: 'OpenFeign: how does @FeignClient work?'
      },
      a: {
        it: "Spring genera al runtime un'implementazione dell'interfaccia che fa HTTP, serializza/deserializza con Jackson, applica retry/CB e load balancing.",
        en: 'Spring generates a runtime implementation of the interface that performs HTTP, serializes/deserializes with Jackson, and applies retry/CB and load balancing.'
      }
    },
    {
      q: {
        it: 'Spring Cloud Gateway: quale runtime usa?',
        en: 'Spring Cloud Gateway: which runtime does it use?'
      },
      a: {
        it: 'Netty + Reactor (reactive). Sostituisce Zuul 1. Niente blocking nei filter, pena drop del thread del loop.',
        en: 'Netty + Reactor (reactive). Replaces Zuul 1. No blocking in filters, or the event-loop thread is dropped.'
      }
    }
  ],

  quarkus: [
    {
      q: {
        it: 'Perché Quarkus parte velocemente come native image?',
        en: 'Why does Quarkus start fast as a native image?'
      },
      a: {
        it: 'Sposta a build-time tutto ciò che Spring fa a runtime (scan classpath, proxy, reflection) e poi GraalVM compila AOT in binario nativo.',
        en: 'It moves to build-time everything Spring does at runtime (classpath scan, proxies, reflection) and then GraalVM compiles AOT into a native binary.'
      }
    },
    {
      q: {
        it: 'Quarkus: build-time vs runtime properties?',
        en: 'Quarkus: build-time vs runtime properties?'
      },
      a: {
        it: 'Build-time vengono "fissate" nel binario nativo, cambiarle richiede rebuild. Runtime sono normali env vars. Distinzione documentata per ogni estensione.',
        en: 'Build-time are "baked" into the native binary; changing them requires a rebuild. Runtime are regular env vars. The distinction is documented per extension.'
      }
    },
    {
      q: {
        it: 'Quarkus dev mode: cosa offre di unico?',
        en: 'Quarkus dev mode: what is unique about it?'
      },
      a: {
        it: 'Live coding: salvi un file → ricompila e ricarica in millisecondi. Continuous testing: i test girano in background.',
        en: 'Live coding: save a file → recompile and reload in milliseconds. Continuous testing: tests run in the background.'
      }
    },
    {
      q: {
        it: 'Closed-world assumption di GraalVM: cosa significa?',
        en: 'GraalVM closed-world assumption: what does it mean?'
      },
      a: {
        it: 'Tutto il codice raggiungibile da main viene analizzato staticamente a build time. Reflection / proxy / serializzazione richiedono metadata espliciti.',
        en: 'All code reachable from main is analyzed statically at build time. Reflection / proxies / serialization require explicit metadata.'
      }
    }
  ],

  'vite-react': [
    {
      q: {
        it: 'Perché Vite è velocissimo in dev?',
        en: 'Why is Vite so fast in dev?'
      },
      a: {
        it: 'Serve i moduli ES direttamente al browser senza bundling, pre-bundla solo le dipendenze con esbuild (Go). HMR fine-grained.',
        en: 'It serves ES modules directly to the browser without bundling, pre-bundles only dependencies with esbuild (Go). Fine-grained HMR.'
      }
    },
    {
      q: {
        it: 'Vite usa lo stesso tool in dev e in build?',
        en: 'Does Vite use the same tool in dev and in build?'
      },
      a: {
        it: 'No: in dev usa esbuild + serving ESM nativo. In build usa Rollup per ottimizzazioni più mature (tree-shaking, code splitting).',
        en: 'No: in dev it uses esbuild + native ESM serving. In build it uses Rollup for more mature optimizations (tree-shaking, code splitting).'
      }
    },
    {
      q: {
        it: 'CRA → Vite: cosa cambia per le env vars?',
        en: 'CRA → Vite: what changes for env vars?'
      },
      a: {
        it: 'Le variabili passano da REACT_APP_* a VITE_*, accessibili via import.meta.env invece di process.env.',
        en: 'Variables switch from REACT_APP_* to VITE_*, accessed via import.meta.env instead of process.env.'
      }
    },
    {
      q: {
        it: 'Cosa fa il pre-bundling di Vite con esbuild?',
        en: 'What does Vite pre-bundling with esbuild do?'
      },
      a: {
        it: 'Converte dipendenze CommonJS in ESM e accorpa pacchetti con molti file (es. lodash) in pochi chunk, salvati in node_modules/.vite/.',
        en: 'Converts CommonJS dependencies to ESM and merges multi-file packages (e.g. lodash) into a few chunks, stored in node_modules/.vite/.'
      }
    },
    {
      q: {
        it: 'Manual chunks in Vite: a cosa servono?',
        en: 'Manual chunks in Vite: what are they for?'
      },
      a: {
        it: 'Splittare il bundle in più file (react, vendor, syntax...) per migliorare caching e parallel loading. Configurabile in vite.config.js rollupOptions.',
        en: 'Splitting the bundle into multiple files (react, vendor, syntax...) to improve caching and parallel loading. Configurable in vite.config.js rollupOptions.'
      }
    }
  ],

  'database-persistence': [
    {
      q: {
        it: 'Cosa significa Isolation in ACID?',
        en: 'What does Isolation mean in ACID?'
      },
      a: {
        it: 'Le transazioni concorrenti non si influenzano in modo visibile. I livelli (Read Uncommitted → Serializable) bilanciano coerenza e prestazioni.',
        en: 'Concurrent transactions do not visibly affect each other. The levels (Read Uncommitted → Serializable) trade off consistency and performance.'
      }
    },
    {
      q: {
        it: 'Quando preferire NoSQL a SQL?',
        en: 'When to prefer NoSQL over SQL?'
      },
      a: {
        it: 'Schemi flessibili, scrittura ad alto throughput, scalabilità orizzontale, dati gerarchici/documentali. Pagando meno garanzie ACID e join limitati.',
        en: 'Flexible schemas, high-throughput writes, horizontal scalability, hierarchical/document data. Paying with weaker ACID guarantees and limited joins.'
      }
    },
    {
      q: {
        it: "Cos'è un indice covering?",
        en: 'What is a covering index?'
      },
      a: {
        it: "Un indice che contiene tutte le colonne richieste dalla query, evitando l'accesso alla tabella (index-only scan). Velocizza la lettura significativamente.",
        en: 'An index that contains all the columns required by the query, avoiding table access (index-only scan). Significantly speeds up reads.'
      }
    },
    {
      q: {
        it: 'Leftmost prefix in un indice composito?',
        en: 'Leftmost prefix in a composite index?'
      },
      a: {
        it: "L'indice è utilizzabile solo se il predicato fissa le colonne da sinistra. Su (a, b, c): WHERE b = ? non lo usa, WHERE a = ? AND b = ? sì.",
        en: 'The index is only usable if the predicate fixes columns from the left. On (a, b, c): WHERE b = ? does not use it; WHERE a = ? AND b = ? does.'
      }
    },
    {
      q: {
        it: "Cos'è MVCC?",
        en: 'What is MVCC?'
      },
      a: {
        it: 'Multi-Version Concurrency Control: ogni transazione vede uno "snapshot" del DB. Le letture non bloccano le scritture e viceversa. Usato da Postgres e InnoDB.',
        en: 'Multi-Version Concurrency Control: each transaction sees a DB "snapshot". Reads do not block writes and vice versa. Used by Postgres and InnoDB.'
      }
    },
    {
      q: {
        it: 'Outbox pattern: a cosa serve?',
        en: 'Outbox pattern: what is it for?'
      },
      a: {
        it: 'Pubblicare eventi dopo un commit DB atomicamente: scrivi business + outbox nella stessa tx, un dispatcher legge outbox e pubblica. Risolve "dual write".',
        en: 'Atomically publish events after a DB commit: write business + outbox in the same tx, a dispatcher reads outbox and publishes. Solves "dual write".'
      }
    },
    {
      q: {
        it: "Cos'è il dirty checking di Hibernate?",
        en: 'What is Hibernate dirty checking?'
      },
      a: {
        it: 'Alla fine della transazione, Hibernate confronta lo stato attuale delle entity managed con lo snapshot iniziale e genera UPDATE automaticamente.',
        en: 'At transaction end, Hibernate compares the current state of managed entities with the initial snapshot and generates UPDATE statements automatically.'
      }
    },
    {
      q: {
        it: "Problema N+1 in JPA: cos'è e come si risolve?",
        en: 'N+1 problem in JPA: what is it and how to fix it?'
      },
      a: {
        it: 'Ciclo che accede a una relazione lazy → 1 query parent + N child. Soluzioni: JOIN FETCH, @EntityGraph, batch fetching (hibernate.default_batch_fetch_size).',
        en: 'A loop accessing a lazy relationship → 1 parent query + N child queries. Fixes: JOIN FETCH, @EntityGraph, batch fetching (hibernate.default_batch_fetch_size).'
      }
    },
    {
      q: {
        it: 'LazyInitializationException: quando si verifica?',
        en: 'LazyInitializationException: when does it happen?'
      },
      a: {
        it: "Quando provi ad accedere a un'associazione lazy fuori dalla sessione Hibernate (es. nella view dopo che il @Transactional è chiuso). Soluzione: DTO o JOIN FETCH.",
        en: 'When you try to access a lazy association outside the Hibernate session (e.g. in the view after @Transactional has closed). Fix: DTO or JOIN FETCH.'
      }
    },
    {
      q: {
        it: "Cos'è un Index-Only Scan (Postgres)?",
        en: 'What is an Index-Only Scan (Postgres)?'
      },
      a: {
        it: "Postgres soddisfa la query interamente dall'indice senza toccare la heap. Richiede covering index e visibility map aggiornata (VACUUM).",
        en: 'Postgres satisfies the query entirely from the index without touching the heap. Requires a covering index and an up-to-date visibility map (VACUUM).'
      }
    },
    {
      q: {
        it: 'Pagination con OFFSET: perché è cattiva su offset grandi?',
        en: 'OFFSET pagination: why is it bad with large offsets?'
      },
      a: {
        it: 'Il DB legge tutte le righe dello OFFSET prima di iniziare a contare LIMIT. Soluzione: keyset/cursor pagination con WHERE id > ? ORDER BY id LIMIT N.',
        en: 'The DB reads all OFFSET rows before starting to count LIMIT. Fix: keyset/cursor pagination with WHERE id > ? ORDER BY id LIMIT N.'
      }
    },
    {
      q: {
        it: 'Optimistic vs pessimistic locking?',
        en: 'Optimistic vs pessimistic locking?'
      },
      a: {
        it: 'Pessimistic: SELECT ... FOR UPDATE blocca le righe. Optimistic: colonna @Version, UPDATE ... WHERE version=?, fallisce se il count è 0 (concurrent modification).',
        en: 'Pessimistic: SELECT ... FOR UPDATE locks rows. Optimistic: @Version column, UPDATE ... WHERE version=?, fails if affected count is 0 (concurrent modification).'
      }
    },
    {
      q: {
        it: "Cos'è un indice BRIN?",
        en: 'What is a BRIN index?'
      },
      a: {
        it: 'Block Range INdex: memorizza min/max per blocco di pagine. Piccolissimo, ideale per tabelle enormi con dati naturalmente ordinati (time series, logs).',
        en: 'Block Range INdex: stores min/max per page block. Very small, ideal for huge tables with naturally ordered data (time series, logs).'
      }
    }
  ],

  'api-communication': [
    {
      q: {
        it: 'Tre vincoli architetturali di REST?',
        en: 'Three REST architectural constraints?'
      },
      a: {
        it: 'Stateless, uniform interface (risorse identificate da URI, manipolazione tramite rappresentazioni, HATEOAS), cacheable (più client-server, layered, code-on-demand).',
        en: 'Stateless, uniform interface (resources identified by URI, manipulation via representations, HATEOAS), cacheable (plus client-server, layered, code-on-demand).'
      }
    },
    {
      q: {
        it: "Idempotency-Key: cos'è?",
        en: 'Idempotency-Key: what is it?'
      },
      a: {
        it: 'Un header che il client invia per dire "ho già provato con questa chiave". Il server salva (key, response) e restituisce lo stesso risultato ai retry. Usato da Stripe.',
        en: 'A header the client sends to say "I already tried with this key". The server stores (key, response) and returns the same result on retries. Used by Stripe.'
      }
    },
    {
      q: {
        it: 'GraphQL: cosa risolve rispetto a REST?',
        en: 'GraphQL: what does it solve vs REST?'
      },
      a: {
        it: 'Over-fetching e under-fetching: il client chiede esattamente i campi che gli servono. Schema tipato condiviso, un solo endpoint.',
        en: 'Over-fetching and under-fetching: the client asks for exactly the fields it needs. Shared typed schema, a single endpoint.'
      }
    },
    {
      q: {
        it: 'N+1 in GraphQL: come si risolve?',
        en: 'N+1 in GraphQL: how to fix it?'
      },
      a: {
        it: 'DataLoader: batcha le richieste per lo stesso tipo di risorsa in una singola query SQL/IN. Per-request, non condiviso tra utenti.',
        en: 'DataLoader: batches requests for the same resource type into a single SQL/IN query. Per-request, not shared across users.'
      }
    },
    {
      q: {
        it: 'Persisted queries in GraphQL: vantaggi?',
        en: 'Persisted queries in GraphQL: benefits?'
      },
      a: {
        it: 'Client invia solo hash → server lookup query. Riduce payload, abilita cache HTTP GET (CDN), whitelist implicita di query.',
        en: 'The client sends only a hash → server looks up the query. Reduces payload, enables HTTP GET caching (CDN), implicit query whitelist.'
      }
    },
    {
      q: {
        it: 'gRPC vs REST: principale vantaggio di gRPC?',
        en: 'gRPC vs REST: main gRPC advantage?'
      },
      a: {
        it: 'Protobuf binario (3-10x più compatto di JSON), streaming bidirezionale, contratti tipati. Ideale per comunicazione interna ad alto throughput.',
        en: 'Binary protobuf (3-10x more compact than JSON), bidirectional streaming, typed contracts. Ideal for high-throughput internal communication.'
      }
    }
  ],

  'architecture-process': [
    {
      q: {
        it: 'Quando un microservizio è "troppo piccolo"?',
        en: 'When is a microservice "too small"?'
      },
      a: {
        it: 'Quando il costo di rete, observability, deploy e dati distribuiti supera i benefici di indipendenza. Si genera un "distributed monolith".',
        en: 'When the cost of network, observability, deploy and distributed data outweighs the benefits of independence. You end up with a "distributed monolith".'
      }
    },
    {
      q: {
        it: "Cos'è il pattern Saga?",
        en: 'What is the Saga pattern?'
      },
      a: {
        it: 'Transazione di business distribuita su più servizi: catena di tx locali + compensazioni se uno fallisce. Coreografia (eventi) o orchestrazione (Temporal, Camunda).',
        en: 'A business transaction distributed across services: chain of local txs + compensations if one fails. Choreography (events) or orchestration (Temporal, Camunda).'
      }
    },
    {
      q: {
        it: 'CQRS: pro e contro?',
        en: 'CQRS: pros and cons?'
      },
      a: {
        it: 'Pro: scaling indipendente lettura/scrittura, modelli ottimizzati. Contro: complessità, eventual consistency tra read e write side.',
        en: 'Pros: independent read/write scaling, optimized models. Cons: complexity, eventual consistency between read and write side.'
      }
    },
    {
      q: {
        it: 'DORA metrics: quali sono le 4?',
        en: 'DORA metrics: what are the 4?'
      },
      a: {
        it: 'Deployment frequency, Lead time for changes, Change failure rate, MTTR (Mean Time To Recover). Misurate trimestralmente.',
        en: 'Deployment frequency, Lead time for changes, Change failure rate, MTTR (Mean Time To Recover). Measured quarterly.'
      }
    },
    {
      q: {
        it: 'Trunk-based vs GitFlow: quale per CD moderno?',
        en: 'Trunk-based vs GitFlow: which for modern CD?'
      },
      a: {
        it: 'Trunk-based + feature flag: feature branch brevi, merge frequenti su main, deploy continuo. GitFlow è meglio per release pianificate.',
        en: 'Trunk-based + feature flags: short feature branches, frequent merges to main, continuous deploy. GitFlow is better for scheduled releases.'
      }
    },
    {
      q: {
        it: 'SLO vs SLA: differenza?',
        en: 'SLO vs SLA: difference?'
      },
      a: {
        it: 'SLO è obiettivo interno (es. p95 < 500ms al 99.5%). SLA è contratto col cliente con penali. Error budget = 100% - SLO.',
        en: 'SLO is an internal target (e.g. p95 < 500ms at 99.5%). SLA is a customer contract with penalties. Error budget = 100% - SLO.'
      }
    },
    {
      q: {
        it: 'Expand/contract per migrazioni DB?',
        en: 'Expand/contract for DB migrations?'
      },
      a: {
        it: 'Migration additiva (expand: nuova colonna nullable), backfill, codice usa la nuova, poi contract (rimuovi vecchia colonna) in release successiva. Zero downtime.',
        en: 'Additive migration (expand: new nullable column), backfill, code uses the new one, then contract (drop the old column) in a later release. Zero downtime.'
      }
    },
    {
      q: {
        it: "Cos'è il Service Mesh?",
        en: 'What is a Service Mesh?'
      },
      a: {
        it: 'Sidecar (Envoy/Linkerd) che fornisce mTLS, retry, circuit breaking, telemetry lingua-agnostico. Sostituisce molte funzioni di Spring Cloud a livello rete.',
        en: 'A sidecar (Envoy/Linkerd) that provides mTLS, retry, circuit breaking, language-agnostic telemetry. Replaces many Spring Cloud features at the network layer.'
      }
    }
  ],

  'spring-ai': [
    {
      q: {
        it: "Cos'è il RAG in Spring AI?",
        en: 'What is RAG in Spring AI?'
      },
      a: {
        it: "Retrieval-Augmented Generation: si recupera contesto (es. da un vector store) e si inietta nel prompt dell'LLM per rispondere su dati propri.",
        en: 'Retrieval-Augmented Generation: context is retrieved (e.g. from a vector store) and injected into the LLM prompt to answer based on your own data.'
      }
    },
    {
      q: {
        it: "Cos'è un VectorStore?",
        en: 'What is a VectorStore?'
      },
      a: {
        it: 'Database che indicizza embeddings (vettori) per similarity search. Esempi: PgVector, Chroma, Qdrant, Pinecone. Backbone del RAG.',
        en: 'A database that indexes embeddings (vectors) for similarity search. Examples: PgVector, Chroma, Qdrant, Pinecone. RAG backbone.'
      }
    },
    {
      q: {
        it: 'Function calling in Spring AI: come funziona?',
        en: 'Function calling in Spring AI: how does it work?'
      },
      a: {
        it: "Espone schema delle tue funzioni Java all'LLM. L'LLM decide quando chiamarle, la libreria invoca il metodo e passa il risultato all'LLM.",
        en: 'Exposes your Java function schemas to the LLM. The LLM decides when to call them; the library invokes the method and passes the result back to the LLM.'
      }
    },
    {
      q: {
        it: "Prompt injection: cos'è e come si mitiga?",
        en: 'Prompt injection: what is it and how to mitigate it?'
      },
      a: {
        it: 'Input utente che inietta istruzioni che alterano il prompt sistema. Mitigazioni: delimitatori, validazione output, sandboxing tool, spotlighting.',
        en: 'User input that injects instructions altering the system prompt. Mitigations: delimiters, output validation, tool sandboxing, spotlighting.'
      }
    },
    {
      q: {
        it: "Cos'è un embedding model?",
        en: 'What is an embedding model?'
      },
      a: {
        it: 'Trasforma testo in vettore di N dimensioni. Testi semanticamente simili → vettori vicini. Usato per similarity search nei VectorStore.',
        en: 'Turns text into an N-dimensional vector. Semantically similar texts → nearby vectors. Used for similarity search in VectorStores.'
      }
    },
    {
      q: {
        it: 'Differenza tra Spring AI e LangChain4j?',
        en: 'Difference between Spring AI and LangChain4j?'
      },
      a: {
        it: 'Spring AI: integrato in ecosistema Spring, auto-config, API uniforme tra provider. LangChain4j: più low-level, flessibile per agent e pipeline complesse.',
        en: 'Spring AI: integrated in the Spring ecosystem, auto-config, uniform API across providers. LangChain4j: more low-level, flexible for agents and complex pipelines.'
      }
    }
  ],

  'jvm-internals': [
    {
      q: {
        it: "Cos'è il JIT della JVM?",
        en: 'What is the JVM JIT?'
      },
      a: {
        it: 'Just-In-Time compiler che compila a runtime il bytecode in codice nativo per i metodi caldi. C1 veloce, C2 ottimizzato. Tiered compilation: parte interpretato → C1 → C2.',
        en: 'Just-In-Time compiler that converts bytecode into native code at runtime for hot methods. C1 fast, C2 optimized. Tiered compilation: starts interpreted → C1 → C2.'
      }
    },
    {
      q: {
        it: 'Differenza tra heap, stack e metaspace?',
        en: 'Difference between heap, stack and metaspace?'
      },
      a: {
        it: 'Heap: oggetti (new). Stack: per-thread, call frame e primitivi locali. Metaspace: metadata classi (sostituisce PermGen da Java 8). Stack è veloce, heap richiede GC.',
        en: 'Heap: objects (new). Stack: per-thread, call frames and local primitives. Metaspace: class metadata (replaces PermGen since Java 8). Stack is fast, heap requires GC.'
      }
    },
    {
      q: {
        it: "Cos'è happens-before nel JMM?",
        en: 'What is happens-before in the JMM?'
      },
      a: {
        it: 'Relazione che garantisce visibilità tra azioni di thread diversi. Esempi: unlock→lock, write volatile→read, thread.start()→azioni, costruttore→finalizer.',
        en: 'A relation that guarantees visibility between actions across threads. Examples: unlock→lock, volatile write→read, thread.start()→actions, constructor→finalizer.'
      }
    },
    {
      q: {
        it: 'Volatile vs synchronized?',
        en: 'Volatile vs synchronized?'
      },
      a: {
        it: 'volatile garantisce visibilità ma non atomicità composta (es. i++). synchronized garantisce entrambi ma con costo di lock acquisizione. AtomicLong è una via di mezzo.',
        en: 'volatile guarantees visibility but not compound atomicity (e.g. i++). synchronized guarantees both, with the cost of lock acquisition. AtomicLong is a middle ground.'
      }
    },
    {
      q: {
        it: "Cos'è l'escape analysis?",
        en: 'What is escape analysis?'
      },
      a: {
        it: 'Analisi del JIT che capisce se un oggetto "scappa" dal metodo. Se no, può allocarlo sullo stack (scalar replacement) ed eliminare lock.',
        en: 'A JIT analysis that detects whether an object "escapes" from the method. If not, it can allocate on the stack (scalar replacement) and elide locks.'
      }
    },
    {
      q: {
        it: 'Compressed oops: cosa sono?',
        en: 'Compressed oops: what are they?'
      },
      a: {
        it: 'Su JVM 64-bit con heap ≤ 32 GB, i puntatori agli oggetti sono compressi a 32 bit (shift 3). Riducono RAM consumata. Oltre 32 GB: ogni puntatore raddoppia.',
        en: 'On 64-bit JVMs with heap ≤ 32 GB, object pointers are compressed to 32 bits (shift by 3). Reduces RAM use. Above 32 GB: every pointer doubles in size.'
      }
    },
    {
      q: {
        it: 'ZGC: che caratteristiche ha?',
        en: 'ZGC: what are its features?'
      },
      a: {
        it: 'Concurrent GC con pause < 1 ms anche su heap multi-TB. Region-based, colored pointers per concurrent marking. Throughput leggermente inferiore a G1.',
        en: 'Concurrent GC with sub-1ms pauses even on multi-TB heaps. Region-based, colored pointers for concurrent marking. Throughput slightly below G1.'
      }
    },
    {
      q: {
        it: 'OutOfMemoryError "Metaspace": cosa indica?',
        en: 'OutOfMemoryError "Metaspace": what does it indicate?'
      },
      a: {
        it: 'Troppe classi caricate (es. classloader leak in webapp redeploy). Aumentare -XX:MaxMetaspaceSize o eliminare la causa del leak.',
        en: 'Too many classes loaded (e.g. classloader leak on webapp redeploy). Raise -XX:MaxMetaspaceSize or fix the leak source.'
      }
    }
  ],

  'design-patterns': [
    {
      q: {
        it: 'Differenza tra Singleton GoF e Singleton DI?',
        en: 'Difference between GoF Singleton and DI Singleton?'
      },
      a: {
        it: "GoF: classe nasconde costruttore, espone INSTANCE statico. Globale, accoppia, difficile da testare. DI (Spring): container gestisce l'unicità, testabile.",
        en: 'GoF: class hides the constructor and exposes a static INSTANCE. Global, coupling, hard to test. DI (Spring): the container handles uniqueness, testable.'
      }
    },
    {
      q: {
        it: 'Decorator vs Proxy: differenza?',
        en: 'Decorator vs Proxy: difference?'
      },
      a: {
        it: "Decorator aggiunge comportamento \"decorando\" un oggetto (es. logging). Proxy controlla l'accesso (lazy, security, remote). Strutturalmente simili, intenti diversi.",
        en: 'Decorator adds behavior by "decorating" an object (e.g. logging). Proxy controls access (lazy, security, remote). Structurally similar, different intents.'
      }
    },
    {
      q: {
        it: "Cos'è la Hexagonal Architecture?",
        en: 'What is Hexagonal Architecture?'
      },
      a: {
        it: "Dominio al centro, indipendente. Ports (interfacce) definite dal dominio. Adapters traducono al mondo esterno (DB, HTTP, broker). Dipendenze sempre verso l'interno.",
        en: 'Domain at the center, independent. Ports (interfaces) defined by the domain. Adapters translate to the outside world (DB, HTTP, broker). Dependencies always point inward.'
      }
    },
    {
      q: {
        it: 'Visitor pattern: cosa lo sostituisce in Java moderno?',
        en: 'Visitor pattern: what replaces it in modern Java?'
      },
      a: {
        it: 'Pattern matching su sealed: switch esaustivo con case per ogni tipo. Niente bisogno di accept/visit. Più sintetico e meno fragile.',
        en: 'Pattern matching on sealed: exhaustive switch with a case per type. No need for accept/visit. More concise and less fragile.'
      }
    },
    {
      q: {
        it: 'God Object: come riconoscerlo e fixarlo?',
        en: 'God Object: how to recognize and fix it?'
      },
      a: {
        it: 'Classe gigante con troppi metodi/dipendenze. Sintomo: cambi piccoli toccano sempre lei. Fix: SRP, estrai responsabilità in classi separate, refactor per layer.',
        en: 'A giant class with too many methods/dependencies. Symptom: small changes always touch it. Fix: SRP, extract responsibilities into separate classes, refactor by layer.'
      }
    },
    {
      q: {
        it: 'Strategy con lambda: vantaggio?',
        en: 'Strategy with lambdas: benefit?'
      },
      a: {
        it: 'Strategy classico = interfaccia + N classi. Con lambda = una Function<T,R> passata al volo. Meno boilerplate per strategie semplici.',
        en: 'Classic Strategy = interface + N classes. With a lambda = one Function<T,R> passed inline. Less boilerplate for simple strategies.'
      }
    },
    {
      q: {
        it: 'CQRS: pattern e contesto?',
        en: 'CQRS: pattern and context?'
      },
      a: {
        it: 'Command Query Responsibility Segregation: separa scrittura e lettura. Modelli ottimizzati per ognuno, scaling indipendente. Costo: complessità, eventual consistency.',
        en: 'Command Query Responsibility Segregation: separates write and read. Optimized models for each, independent scaling. Cost: complexity, eventual consistency.'
      }
    },
    {
      q: {
        it: 'Strutturali vs comportamentali: differenza?',
        en: 'Structural vs behavioral: difference?'
      },
      a: {
        it: 'Strutturali (Adapter, Decorator, Facade…) compongono oggetti/classi. Comportamentali (Strategy, Observer, Command…) gestiscono interazioni e responsabilità.',
        en: 'Structural (Adapter, Decorator, Facade…) compose objects/classes. Behavioral (Strategy, Observer, Command…) handle interactions and responsibilities.'
      }
    }
  ],

  curiosita: [
    {
      q: {
        it: 'Si può compilare Swift per Android?',
        en: 'Can you compile Swift for Android?'
      },
      a: {
        it: "Sì, con la toolchain Swift + Android NDK. Si compilano librerie native usate via JNI dall'app Android. Resta una nicchia, manca Foundation completa.",
        en: 'Yes, with the Swift toolchain + Android NDK. You compile native libraries used via JNI from the Android app. Still a niche; Foundation is incomplete.'
      }
    },
    {
      q: {
        it: 'Swift su Android: perché tecnicamente funziona?',
        en: 'Swift on Android: why does it technically work?'
      },
      a: {
        it: 'Swift compila via LLVM (come C++ Android). La libc Android (bionic) e i target arm/aarch64 sono supportati. La stdlib Swift viene portata per Linux/Android.',
        en: 'Swift compiles via LLVM (like Android C++). The Android libc (bionic) and arm/aarch64 targets are supported. The Swift stdlib is ported to Linux/Android.'
      }
    },
    {
      q: {
        it: 'Swift su Android: limitazioni principali?',
        en: 'Swift on Android: main limitations?'
      },
      a: {
        it: 'Foundation parziale (no URLSession completo), no UIKit/SwiftUI, build size grande (15-25 MB stdlib per arch), tooling debug/profile inesistente.',
        en: 'Partial Foundation (no full URLSession), no UIKit/SwiftUI, large build size (15-25 MB stdlib per arch), debug/profile tooling nonexistent.'
      }
    },
    {
      q: {
        it: 'Alternative serie a Swift su Android?',
        en: 'Serious alternatives to Swift on Android?'
      },
      a: {
        it: 'Kotlin Multiplatform (KMP) è la scelta moderna per condividere logica tra iOS e Android. Flutter, React Native sono alternative high-level.',
        en: 'Kotlin Multiplatform (KMP) is the modern choice to share logic between iOS and Android. Flutter and React Native are high-level alternatives.'
      }
    }
  ]
};

export function getDeck(deckId) {
  return FLASHCARDS[deckId] || [];
}

export function getAllDecks() {
  return Object.entries(FLASHCARDS).map(([id, cards]) => ({ id, cards }));
}
