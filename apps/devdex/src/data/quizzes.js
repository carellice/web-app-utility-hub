/**
 * Quiz a risposta multipla, per categoria.
 * answer = indice della risposta corretta (0-based).
 *
 * Ogni `q`, `option` e `explanation` è un oggetto { it, en } risolto a
 * runtime da useTc().
 */
export const QUIZZES = {
  java: [
    {
      q: {
        it: 'Quale di queste affermazioni su `String` in Java è corretta?',
        en: 'Which statement about `String` in Java is correct?'
      },
      options: [
        {
          it: 'È mutabile e thread-safe',
          en: 'It is mutable and thread-safe'
        },
        {
          it: 'È immutabile e i suoi metodi restituiscono nuove istanze',
          en: 'It is immutable and its methods return new instances'
        },
        {
          it: 'È mutabile solo se contiene caratteri ASCII',
          en: 'It is mutable only if it contains ASCII characters'
        },
        {
          it: 'È immutabile ma `replace()` modifica la stringa in place',
          en: 'It is immutable but `replace()` modifies the string in place'
        }
      ],
      answer: 1,
      explanation: {
        it: 'String è immutabile: ogni operazione restituisce una nuova String. Per costruire stringhe in modo efficiente si usa StringBuilder.',
        en: 'String is immutable: every operation returns a new String. To build strings efficiently use StringBuilder.'
      }
    },
    {
      q: {
        it: '`String...` come parametro è equivalente a:',
        en: '`String...` as a parameter is equivalent to:'
      },
      options: [
        { it: 'List<String>', en: 'List<String>' },
        { it: 'String[]', en: 'String[]' },
        { it: 'Iterable<String>', en: 'Iterable<String>' },
        { it: 'Optional<String>', en: 'Optional<String>' }
      ],
      answer: 1,
      explanation: {
        it: 'Le varargs sono zucchero sintattico per un array dello stesso tipo.',
        en: 'Varargs are syntactic sugar for an array of the same type.'
      }
    },
    {
      q: {
        it: 'Qual è il principio fondamentale della "composition over inheritance"?',
        en: 'What is the core principle of "composition over inheritance"?'
      },
      options: [
        {
          it: "L'ereditarietà è più veloce della composizione",
          en: 'Inheritance is faster than composition'
        },
        {
          it: 'La composizione evita il fragile base class problem ed è più flessibile',
          en: 'Composition avoids the fragile base class problem and is more flexible'
        },
        {
          it: "L'ereditarietà non funziona in Java",
          en: 'Inheritance does not work in Java'
        },
        {
          it: 'La composizione è obbligatoria con i record',
          en: 'Composition is required with records'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Composizione: la classe contiene collaboratori invece di ereditarli. Più flessibile, meno accoppiata, immune al fragile base class problem.',
        en: 'Composition: the class contains collaborators instead of inheriting them. More flexible, less coupled, immune to the fragile base class problem.'
      }
    },
    {
      q: {
        it: 'In Java, quale costrutto NON viola Liskov Substitution Principle?',
        en: 'In Java, which construct does NOT violate the Liskov Substitution Principle?'
      },
      options: [
        {
          it: 'Square extends Rectangle con setWidth/setHeight collegati',
          en: 'Square extends Rectangle with linked setWidth/setHeight'
        },
        {
          it: 'Una sottoclasse che restringe il dominio dei parametri accettati',
          en: 'A subclass that narrows the accepted parameter domain'
        },
        {
          it: 'Una sottoclasse che amplia il tipo di ritorno (covariant return)',
          en: 'A subclass that widens the return type (covariant return)'
        },
        {
          it: 'Una sottoclasse che lancia eccezioni unchecked aggiuntive non documentate',
          en: 'A subclass that throws additional undocumented unchecked exceptions'
        }
      ],
      answer: 2,
      explanation: {
        it: 'Covariant return è LSP-compatibile: restringe il tipo di ritorno, non viola il contratto del supertipo.',
        en: 'Covariant return is LSP-compatible: it narrows the return type and does not violate the supertype contract.'
      }
    },
    {
      q: {
        it: 'Sealed interface in Java 17+: principale vantaggio?',
        en: 'Sealed interface in Java 17+: main advantage?'
      },
      options: [
        { it: 'Esecuzione più veloce a runtime', en: 'Faster runtime execution' },
        {
          it: 'Switch esaustivo con pattern matching senza default',
          en: 'Exhaustive switch with pattern matching, no default needed'
        },
        { it: 'Permette ereditarietà multipla', en: 'Enables multiple inheritance' },
        { it: 'Disabilita il garbage collector', en: 'Disables the garbage collector' }
      ],
      answer: 1,
      explanation: {
        it: 'Le sealed limitano chi può implementarle, abilitando switch esaustivi: il compilatore verifica che tutti i casi siano coperti.',
        en: 'Sealed types restrict who can implement them, enabling exhaustive switches: the compiler verifies all cases are covered.'
      }
    },
    {
      q: {
        it: 'PECS dei generics: cosa significa?',
        en: 'Generics PECS: what does it mean?'
      },
      options: [
        { it: 'Producer-Extends, Consumer-Super', en: 'Producer-Extends, Consumer-Super' },
        { it: 'Public-Encapsulated, Concrete-Static', en: 'Public-Encapsulated, Concrete-Static' },
        { it: 'Private-Exception, Constant-Synchronized', en: 'Private-Exception, Constant-Synchronized' },
        { it: 'Pattern-Equals, Class-Subtype', en: 'Pattern-Equals, Class-Subtype' }
      ],
      answer: 0,
      explanation: {
        it: 'Producer (sorgente di T) → ? extends T per leggere. Consumer (destinazione di T) → ? super T per scrivere.',
        en: 'Producer (source of T) → ? extends T to read. Consumer (destination of T) → ? super T to write.'
      }
    },
    {
      q: {
        it: 'Quale executor usa per default uno Stream `.parallel()`?',
        en: 'Which executor does a `.parallel()` Stream use by default?'
      },
      options: [
        { it: 'Un nuovo ThreadPoolExecutor', en: 'A new ThreadPoolExecutor' },
        { it: 'Il ForkJoinPool.commonPool()', en: 'The ForkJoinPool.commonPool()' },
        { it: 'Il main thread', en: 'The main thread' },
        { it: 'Un VirtualThread executor', en: 'A VirtualThread executor' }
      ],
      answer: 1,
      explanation: {
        it: 'Gli stream paralleli usano il commonPool() del ForkJoinPool, condiviso dalla JVM.',
        en: 'Parallel streams use the ForkJoinPool commonPool(), shared by the JVM.'
      }
    },
    {
      q: {
        it: 'Tra queste, quale NON è una vera differenza tra Future e CompletableFuture?',
        en: 'Among these, which is NOT a real difference between Future and CompletableFuture?'
      },
      options: [
        {
          it: 'CompletableFuture supporta callback (thenApply, thenAccept)',
          en: 'CompletableFuture supports callbacks (thenApply, thenAccept)'
        },
        {
          it: 'CompletableFuture si può completare manualmente',
          en: 'CompletableFuture can be completed manually'
        },
        {
          it: 'Future supporta la composizione con thenCompose',
          en: 'Future supports composition with thenCompose'
        },
        {
          it: 'CompletableFuture implementa CompletionStage',
          en: 'CompletableFuture implements CompletionStage'
        }
      ],
      answer: 2,
      explanation: {
        it: 'thenCompose è di CompletableFuture (via CompletionStage). Future ha solo get/cancel.',
        en: 'thenCompose belongs to CompletableFuture (via CompletionStage). Future only has get/cancel.'
      }
    },
    {
      q: {
        it: 'In una CompletableFuture, dove vanno le eccezioni lanciate da un thenApply?',
        en: 'In a CompletableFuture, where do exceptions thrown by thenApply go?'
      },
      options: [
        { it: 'Direttamente al main thread', en: 'Directly to the main thread' },
        { it: 'Vengono ignorate', en: 'They are ignored' },
        {
          it: 'Avvolte in CompletionException e propagate lungo la catena',
          en: 'Wrapped in CompletionException and propagated along the chain'
        },
        {
          it: 'Su System.err automaticamente',
          en: 'Printed to System.err automatically'
        }
      ],
      answer: 2,
      explanation: {
        it: 'Le eccezioni nella pipeline vengono wrappate in CompletionException. exceptionally/handle le intercettano; senza terminator si perdono silenziosamente.',
        en: 'Exceptions in the pipeline are wrapped in CompletionException. exceptionally/handle catches them; without a terminator they are silently lost.'
      }
    },
    {
      q: {
        it: 'Quale è la principale tecnica di bilanciamento del ForkJoinPool?',
        en: 'What is the main balancing technique of ForkJoinPool?'
      },
      options: [
        { it: 'Round-robin centralizzato', en: 'Centralized round-robin' },
        {
          it: 'Work-stealing tra deque dei worker',
          en: 'Work-stealing across worker deques'
        },
        { it: 'Code FIFO globali', en: 'Global FIFO queues' },
        { it: 'Priority queue per task', en: 'Priority queue for tasks' }
      ],
      answer: 1,
      explanation: {
        it: 'Ogni worker ha la sua deque locale; chi finisce ruba task da quelle altrui. Massimizza locality e minimizza contesa.',
        en: 'Each worker has its own local deque; idle workers steal tasks from others. Maximizes locality and minimizes contention.'
      }
    },
    {
      q: {
        it: 'A cosa serve ManagedBlocker in ForkJoinPool?',
        en: 'What is ManagedBlocker for in ForkJoinPool?'
      },
      options: [
        {
          it: "Bloccare l'esecuzione di un task",
          en: 'Blocking the execution of a task'
        },
        {
          it: 'Indicare al pool che un task sta per bloccare, così crea worker di compensazione',
          en: 'Telling the pool that a task is about to block so it can spin up compensating workers'
        },
        {
          it: 'Sospendere indefinitamente il pool',
          en: 'Suspending the pool indefinitely'
        },
        {
          it: 'Limitare il numero di task concorrenti',
          en: 'Limiting the number of concurrent tasks'
        }
      ],
      answer: 1,
      explanation: {
        it: 'ManagedBlocker dichiara un blocco "compensabile": il pool può aggiungere worker temporanei per non scendere sotto il parallelismo target.',
        en: 'ManagedBlocker declares a "compensable" block: the pool can add temporary workers to keep the parallelism target.'
      }
    },
    {
      q: {
        it: 'Quale è il modo Java 21+ per trasformare codice asincrono in sincrono semplice?',
        en: 'What is the Java 21+ way to turn async code into simple synchronous code?'
      },
      options: [
        { it: 'Annotazione @Async di Spring', en: 'Spring @Async annotation' },
        { it: 'Virtual Threads (Project Loom)', en: 'Virtual Threads (Project Loom)' },
        { it: 'Aspect AOP custom', en: 'A custom AOP aspect' },
        { it: 'Setter injection', en: 'Setter injection' }
      ],
      answer: 1,
      explanation: {
        it: 'I virtual thread permettono codice imperativo bloccante senza occupare carrier OS thread durante I/O. Sostituiscono molti pattern async.',
        en: 'Virtual threads allow blocking imperative code without holding a carrier OS thread during I/O. They replace many async patterns.'
      }
    },
    {
      q: {
        it: 'Quale tra questi NON è uno stile di callback comune in Java?',
        en: 'Which of these is NOT a common callback style in Java?'
      },
      options: [
        {
          it: 'Listener / Observer interface',
          en: 'Listener / Observer interface'
        },
        {
          it: 'Functional interface (Consumer<T>, Function<T,R>)',
          en: 'Functional interface (Consumer<T>, Function<T,R>)'
        },
        {
          it: 'Lambda passata come parametro',
          en: 'Lambda passed as a parameter'
        },
        {
          it: 'Goto label-based handler',
          en: 'Goto label-based handler'
        }
      ],
      answer: 3,
      explanation: {
        it: 'Java non ha goto. Gli altri tre sono pattern di callback standard.',
        en: 'Java has no goto. The other three are standard callback patterns.'
      }
    }
  ],

  spring: [
    {
      q: {
        it: "Perché un'annotazione `@Transactional` su un metodo `private` non funziona?",
        en: 'Why does `@Transactional` on a `private` method not work?'
      },
      options: [
        {
          it: 'Perché Spring vede solo metodi annotati con @Bean',
          en: 'Because Spring only sees methods annotated with @Bean'
        },
        {
          it: 'Perché il proxy AOP intercetta solo metodi public dello stesso bean',
          en: 'Because the AOP proxy intercepts only public methods of the same bean'
        },
        {
          it: 'Perché i metodi private sono final',
          en: 'Because private methods are final'
        },
        {
          it: 'Perché @Transactional richiede @Component',
          en: 'Because @Transactional requires @Component'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Il proxy CGLIB/JDK intercetta solo invocazioni esterne ai metodi public (o protected con CGLIB). Sui private non passa nulla.',
        en: 'The CGLIB/JDK proxy only intercepts external invocations on public methods (or protected with CGLIB). Nothing routes through it for private methods.'
      }
    },
    {
      q: {
        it: 'Cosa fa `@Lazy` su un punto di iniezione?',
        en: 'What does `@Lazy` do on an injection point?'
      },
      options: [
        { it: 'Lo trasforma in prototype', en: 'Turns it into a prototype' },
        {
          it: 'Inietta un proxy che risolve il bean reale alla prima invocazione',
          en: 'Injects a proxy that resolves the real bean on first call'
        },
        { it: 'Disabilita le sue dipendenze', en: 'Disables its dependencies' },
        { it: 'Lo registra come @Configuration', en: 'Registers it as @Configuration' }
      ],
      answer: 1,
      explanation: {
        it: "Sul punto di iniezione, @Lazy genera un proxy che, al primo metodo chiamato, risolve dal BeanFactory l'istanza target.",
        en: 'On an injection point, @Lazy generates a proxy that, on the first method call, resolves the target from the BeanFactory.'
      }
    },
    {
      q: {
        it: 'Quale meccanismo abilita le auto-configuration in Spring Boot 3?',
        en: 'Which mechanism enables auto-configurations in Spring Boot 3?'
      },
      options: [
        { it: 'spring.factories nel META-INF', en: 'spring.factories in META-INF' },
        {
          it: 'AutoConfiguration.imports nel META-INF/spring/',
          en: 'AutoConfiguration.imports in META-INF/spring/'
        },
        {
          it: 'Reflection sulle classi @Configuration',
          en: 'Reflection on @Configuration classes'
        },
        { it: 'XML application-context.xml', en: 'XML application-context.xml' }
      ],
      answer: 1,
      explanation: {
        it: 'Da Boot 3.0 le auto-config sono dichiarate in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. spring.factories è legacy.',
        en: 'Since Boot 3.0, auto-configs are declared in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. spring.factories is legacy.'
      }
    },
    {
      q: {
        it: 'Quale forma di iniezione è raccomandata in Spring moderno?',
        en: 'Which form of injection is recommended in modern Spring?'
      },
      options: [
        {
          it: 'Field injection con @Autowired',
          en: 'Field injection with @Autowired'
        },
        { it: 'Constructor injection', en: 'Constructor injection' },
        { it: 'Setter injection', en: 'Setter injection' },
        {
          it: 'Lookup statico via ApplicationContextHolder',
          en: 'Static lookup via ApplicationContextHolder'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Constructor injection: campi final, testabilità (senza Spring nei test), dipendenze esplicite, niente NPE.',
        en: 'Constructor injection: final fields, testability (no Spring in tests), explicit dependencies, no NPEs.'
      }
    },
    {
      q: {
        it: "Cos'è un BeanPostProcessor?",
        en: 'What is a BeanPostProcessor?'
      },
      options: [
        {
          it: 'Un componente che modifica BeanDefinition prima della creazione',
          en: 'A component that modifies BeanDefinitions before creation'
        },
        {
          it: "Un componente che intercetta l'istanza prima/dopo l'inizializzazione di ogni bean",
          en: 'A component that hooks each bean instance before/after initialization'
        },
        {
          it: 'Un equivalente di @Component',
          en: 'An equivalent of @Component'
        },
        {
          it: 'Un tipo di repository Spring Data',
          en: 'A type of Spring Data repository'
        }
      ],
      answer: 1,
      explanation: {
        it: 'BeanPostProcessor lavora sulle istanze (es. AspectJ proxy creation). BeanFactoryPostProcessor lavora sulle definitions.',
        en: 'BeanPostProcessor operates on instances (e.g. AspectJ proxy creation). BeanFactoryPostProcessor operates on definitions.'
      }
    },
    {
      q: {
        it: "In AOP Spring, cos'è un pointcut?",
        en: 'In Spring AOP, what is a pointcut?'
      },
      options: [
        {
          it: "Il codice eseguito dall'aspect",
          en: 'The code executed by the aspect'
        },
        {
          it: "L'espressione che seleziona quali joinpoint intercettare",
          en: 'The expression that selects which joinpoints to intercept'
        },
        {
          it: "Un'annotazione obbligatoria su ogni bean",
          en: 'A required annotation on every bean'
        },
        { it: 'Il proxy CGLIB generato', en: 'The generated CGLIB proxy' }
      ],
      answer: 1,
      explanation: {
        it: "Pointcut = predicato sui joinpoint (es. `execution(* com.example..*Service.*(..))`). L'advice è il codice. L'aspect contiene entrambi.",
        en: 'Pointcut = predicate over joinpoints (e.g. `execution(* com.example..*Service.*(..))`). The advice is the code. The aspect contains both.'
      }
    },
    {
      q: {
        it: 'Propagation REQUIRES_NEW: quando ha senso?',
        en: 'Propagation REQUIRES_NEW: when does it make sense?'
      },
      options: [
        {
          it: 'Per ogni metodo public di un service',
          en: 'For every public method of a service'
        },
        {
          it: 'Per audit log o operazioni che devono committare anche se la tx esterna rolla',
          en: 'For audit logs or operations that must commit even if the outer tx rolls back'
        },
        { it: 'Per operazioni read-only', en: 'For read-only operations' },
        { it: 'Solo nei test', en: 'Only in tests' }
      ],
      answer: 1,
      explanation: {
        it: 'REQUIRES_NEW sospende la transazione corrente e ne apre una nuova: commit/rollback indipendente dalla esterna.',
        en: 'REQUIRES_NEW suspends the current transaction and opens a new one: commit/rollback is independent from the outer one.'
      }
    },
    {
      q: {
        it: 'Quale è la principale differenza tra RestTemplate e WebClient?',
        en: 'What is the main difference between RestTemplate and WebClient?'
      },
      options: [
        {
          it: 'WebClient è solo per WebSocket',
          en: 'WebClient is only for WebSocket'
        },
        {
          it: 'WebClient è non-blocking e reattivo, RestTemplate è blocking',
          en: 'WebClient is non-blocking and reactive, RestTemplate is blocking'
        },
        {
          it: 'RestTemplate supporta HTTP/3, WebClient no',
          en: 'RestTemplate supports HTTP/3, WebClient does not'
        },
        {
          it: 'Sono identici, WebClient è un alias',
          en: 'They are identical, WebClient is an alias'
        }
      ],
      answer: 1,
      explanation: {
        it: 'WebClient è basato su Reactor (Mono/Flux) ed è non-blocking. RestTemplate è in maintenance mode.',
        en: 'WebClient is built on Reactor (Mono/Flux) and is non-blocking. RestTemplate is in maintenance mode.'
      }
    },
    {
      q: {
        it: 'Cosa fa la DispatcherServlet quando arriva una request?',
        en: 'What does the DispatcherServlet do when a request comes in?'
      },
      options: [
        {
          it: 'Esegue tutti i bean @Component sincronicamente',
          en: 'Runs every @Component bean synchronously'
        },
        {
          it: 'Trova un HandlerMapping → HandlerAdapter → controller, poi serializza la response',
          en: 'Finds a HandlerMapping → HandlerAdapter → controller, then serializes the response'
        },
        {
          it: 'Scrive il body direttamente sul socket senza middleware',
          en: 'Writes the body directly to the socket with no middleware'
        },
        {
          it: 'Inizializza il container Spring',
          en: 'Initializes the Spring container'
        }
      ],
      answer: 1,
      explanation: {
        it: "È il front controller MVC: instrada la request all'handler giusto, invoca il metodo controller, gestisce conversione e response.",
        en: 'It is the MVC front controller: routes the request to the proper handler, invokes the controller method, handles conversion and response.'
      }
    },
    {
      q: {
        it: 'Filter vs Interceptor in Spring MVC: differenza chiave?',
        en: 'Filter vs Interceptor in Spring MVC: key difference?'
      },
      options: [
        {
          it: 'Filter agisce dentro Spring, Interceptor a livello container',
          en: 'Filter acts inside Spring, Interceptor at container level'
        },
        {
          it: 'Filter è a livello Servlet (container), Interceptor a livello Spring MVC',
          en: 'Filter is at the Servlet (container) level, Interceptor at the Spring MVC level'
        },
        { it: 'Sono sinonimi', en: 'They are synonyms' },
        {
          it: 'Filter funziona solo con WebFlux',
          en: 'Filter only works with WebFlux'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Filter vive nel container Servlet (prima/dopo la DispatcherServlet). Interceptor vive dentro Spring MVC con accesso al modello.',
        en: 'Filter lives in the Servlet container (before/after the DispatcherServlet). Interceptor lives inside Spring MVC with access to the model.'
      }
    },
    {
      q: {
        it: 'A cosa serve @RefreshScope in Spring Cloud?',
        en: 'What is @RefreshScope for in Spring Cloud?'
      },
      options: [
        {
          it: 'Aggiornare automaticamente le entity JPA',
          en: 'Auto-update JPA entities'
        },
        {
          it: 'Distruggere e ricostruire bean al refresh delle properties',
          en: 'Destroy and rebuild beans on a properties refresh'
        },
        { it: 'Rinfrescare la cache HTTP', en: 'Refresh the HTTP cache' },
        {
          it: "Riavviare l'intera applicazione",
          en: 'Restart the whole application'
        }
      ],
      answer: 1,
      explanation: {
        it: 'I bean @RefreshScope vivono in uno scope custom: a /actuator/refresh vengono distrutti e ricreati alla prossima richiesta.',
        en: 'Beans in @RefreshScope live in a custom scope: at /actuator/refresh they are destroyed and recreated on the next request.'
      }
    },
    {
      q: {
        it: 'Cosa fa @FeignClient?',
        en: 'What does @FeignClient do?'
      },
      options: [
        {
          it: "Genera un client HTTP a runtime da un'interfaccia dichiarativa",
          en: 'Generates an HTTP client at runtime from a declarative interface'
        },
        { it: 'Crea un endpoint server-side', en: 'Creates a server-side endpoint' },
        {
          it: 'Fa il proxy di un repository JPA',
          en: 'Proxies a JPA repository'
        },
        { it: 'Connette a un broker Kafka', en: 'Connects to a Kafka broker' }
      ],
      answer: 0,
      explanation: {
        it: "Spring crea al runtime un proxy dell'interfaccia che esegue HTTP, gestisce serializzazione, retry, circuit breaker e load balancing.",
        en: 'Spring creates a runtime proxy of the interface that performs HTTP, handles serialization, retry, circuit breaker and load balancing.'
      }
    },
    {
      q: {
        it: 'Spring Cloud Gateway è basato su:',
        en: 'Spring Cloud Gateway is built on:'
      },
      options: [
        { it: 'Tomcat sincrono', en: 'Synchronous Tomcat' },
        {
          it: 'Netty + Reactor (reactive)',
          en: 'Netty + Reactor (reactive)'
        },
        { it: 'Apache HttpClient', en: 'Apache HttpClient' },
        { it: 'Jetty + Servlet 3', en: 'Jetty + Servlet 3' }
      ],
      answer: 1,
      explanation: {
        it: 'Gateway è reactive: ogni filter è Mono-friendly. Non bloccare nei filter o si droppa il thread del loop event.',
        en: 'Gateway is reactive: every filter is Mono-friendly. Do not block in filters or you drop the event-loop thread.'
      }
    }
  ],

  quarkus: [
    {
      q: {
        it: 'Perché Quarkus è "supersonic, subatomic"?',
        en: 'Why is Quarkus "supersonic, subatomic"?'
      },
      options: [
        { it: 'Usa solo virtual thread', en: 'It uses only virtual threads' },
        {
          it: 'Sposta il lavoro a build-time e compila AOT con GraalVM',
          en: 'It moves work to build-time and compiles AOT with GraalVM'
        },
        {
          it: 'Sostituisce la JVM con WebAssembly',
          en: 'It replaces the JVM with WebAssembly'
        },
        { it: 'Non usa il classpath', en: 'It does not use the classpath' }
      ],
      answer: 1,
      explanation: {
        it: 'A build-time elabora reflection/proxy/scan, poi GraalVM produce un eseguibile nativo con startup di millisecondi.',
        en: 'At build-time it processes reflection/proxies/scans, then GraalVM produces a native executable with millisecond startup.'
      }
    },
    {
      q: {
        it: 'In Quarkus, cosa NON puoi cambiare a runtime?',
        en: 'In Quarkus, what can you NOT change at runtime?'
      },
      options: [
        { it: 'Le proprietà runtime', en: 'Runtime properties' },
        {
          it: 'Le proprietà build-time (fissate nel binario)',
          en: 'Build-time properties (baked into the binary)'
        },
        { it: 'Le env vars', en: 'Env vars' },
        { it: 'Le system properties', en: 'System properties' }
      ],
      answer: 1,
      explanation: {
        it: 'Quarkus distingue: le build-time properties sono "cottе" nel binario nativo, cambiarle richiede rebuild.',
        en: 'Quarkus distinguishes: build-time properties are "baked" into the native binary; changing them requires a rebuild.'
      }
    },
    {
      q: {
        it: 'Closed-world assumption di GraalVM significa che:',
        en: 'GraalVM closed-world assumption means that:'
      },
      options: [
        {
          it: 'La JVM non accetta nuovi classloader',
          en: 'The JVM does not accept new classloaders'
        },
        {
          it: 'Tutto il codice raggiungibile da main è analizzato staticamente a build-time',
          en: 'All code reachable from main is analyzed statically at build-time'
        },
        { it: 'Il classpath è cifrato', en: 'The classpath is encrypted' },
        {
          it: 'I package privati sono nascosti',
          en: 'Private packages are hidden'
        }
      ],
      answer: 1,
      explanation: {
        it: "Il binario nativo contiene solo classi/metodi raggiungibili da main. Reflection / proxy / serialization richiedono metadati espliciti (`@RegisterForReflection`).",
        en: 'The native binary contains only classes/methods reachable from main. Reflection / proxies / serialization require explicit metadata (`@RegisterForReflection`).'
      }
    }
  ],

  'vite-react': [
    {
      q: {
        it: 'Perché Vite è più veloce di Webpack in dev?',
        en: 'Why is Vite faster than Webpack in dev?'
      },
      options: [
        {
          it: 'Bundla tutto in un singolo file',
          en: 'It bundles everything into a single file'
        },
        {
          it: 'Serve i moduli ES direttamente al browser senza bundling',
          en: 'It serves ES modules directly to the browser without bundling'
        },
        { it: 'Usa Java come compiler', en: 'It uses Java as a compiler' },
        { it: 'Disabilita il source map', en: 'It disables source maps' }
      ],
      answer: 1,
      explanation: {
        it: 'In dev Vite usa il supporto ESM nativo dei browser e pre-bundla solo le dipendenze con esbuild. HMR fine-grained.',
        en: 'In dev Vite uses native browser ESM support and pre-bundles only the dependencies with esbuild. Fine-grained HMR.'
      }
    },
    {
      q: {
        it: 'In Vite, dove si dichiarano le environment variables esposte al client?',
        en: 'In Vite, where do you declare environment variables exposed to the client?'
      },
      options: [
        { it: 'Con prefisso REACT_APP_', en: 'With the REACT_APP_ prefix' },
        {
          it: 'Con prefisso VITE_, accessibili da import.meta.env',
          en: 'With the VITE_ prefix, accessible via import.meta.env'
        },
        {
          it: 'Tutte le variabili sono automaticamente esposte',
          en: 'All variables are automatically exposed'
        },
        {
          it: 'Vanno scritte in vite.config.js',
          en: 'They are written in vite.config.js'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Solo `VITE_*` viene esposto al client per evitare leak. Accessibili come `import.meta.env.VITE_X`.',
        en: 'Only `VITE_*` is exposed to the client to avoid leaks. Accessed via `import.meta.env.VITE_X`.'
      }
    },
    {
      q: {
        it: 'Quale bundler usa Vite per la build di produzione?',
        en: 'Which bundler does Vite use for production build?'
      },
      options: [
        { it: 'Webpack', en: 'Webpack' },
        { it: 'esbuild', en: 'esbuild' },
        { it: 'Rollup', en: 'Rollup' },
        { it: 'Parcel', en: 'Parcel' }
      ],
      answer: 2,
      explanation: {
        it: 'Vite usa Rollup per la build (più maturo per tree-shaking/code-splitting), mentre in dev usa esbuild + ESM nativo.',
        en: 'Vite uses Rollup for the build (more mature for tree-shaking/code-splitting), while in dev it uses esbuild + native ESM.'
      }
    },
    {
      q: {
        it: 'Cosa fa il pre-bundling di Vite?',
        en: 'What does Vite pre-bundling do?'
      },
      options: [
        { it: 'Compila Java in JS', en: 'Compiles Java to JS' },
        {
          it: 'Converte dipendenze CJS in ESM e fonde quelle con molti file, salvando in node_modules/.vite/',
          en: 'Converts CJS dependencies to ESM and merges multi-file ones, stored in node_modules/.vite/'
        },
        { it: 'Serve static asset', en: 'Serves static assets' },
        { it: 'Genera service worker', en: 'Generates a service worker' }
      ],
      answer: 1,
      explanation: {
        it: 'Pre-bundling con esbuild risolve due problemi: dipendenze CommonJS legacy e pacchetti tipo lodash che importerebbero centinaia di file.',
        en: 'Pre-bundling with esbuild solves two problems: legacy CommonJS dependencies and lodash-like packages that would otherwise import hundreds of files.'
      }
    }
  ],

  'database-persistence': [
    {
      q: {
        it: 'Quale livello di isolamento previene il "phantom read"?',
        en: 'Which isolation level prevents "phantom read"?'
      },
      options: [
        { it: 'Read Uncommitted', en: 'Read Uncommitted' },
        { it: 'Read Committed', en: 'Read Committed' },
        { it: 'Repeatable Read', en: 'Repeatable Read' },
        { it: 'Serializable', en: 'Serializable' }
      ],
      answer: 3,
      explanation: {
        it: 'Solo Serializable previene tutti i fenomeni inclusi i phantom. Repeatable Read previene non-repeatable read ma in genere non i phantom (eccetto MySQL InnoDB con gap lock).',
        en: 'Only Serializable prevents all phenomena including phantoms. Repeatable Read prevents non-repeatable reads but generally not phantoms (except MySQL InnoDB with gap locks).'
      }
    },
    {
      q: {
        it: "In un'app con schema rigido, transazioni complesse e join multipli, conviene:",
        en: 'In an app with rigid schema, complex transactions and multiple joins, you should use:'
      },
      options: [
        { it: 'MongoDB', en: 'MongoDB' },
        { it: 'Redis', en: 'Redis' },
        {
          it: 'Un RDBMS (es. MySQL, PostgreSQL)',
          en: 'An RDBMS (e.g. MySQL, PostgreSQL)'
        },
        { it: 'Un file CSV', en: 'A CSV file' }
      ],
      answer: 2,
      explanation: {
        it: 'Gli RDBMS sono pensati per schemi normalizzati, transazioni ACID e join — esattamente questo scenario.',
        en: 'RDBMSs are designed for normalized schemas, ACID transactions and joins — exactly this scenario.'
      }
    },
    {
      q: {
        it: 'Un indice su `(a, b, c)` è efficacemente utilizzabile da una query con WHERE…',
        en: 'An index on `(a, b, c)` is effectively usable by a query with WHERE…'
      },
      options: [
        { it: 'WHERE b = ?', en: 'WHERE b = ?' },
        { it: 'WHERE a = ? AND b = ?', en: 'WHERE a = ? AND b = ?' },
        { it: 'WHERE c = ?', en: 'WHERE c = ?' },
        { it: 'WHERE b = ? AND c = ?', en: 'WHERE b = ? AND c = ?' }
      ],
      answer: 1,
      explanation: {
        it: 'Gli indici compositi seguono il principio del "leftmost prefix": serve almeno la colonna più a sinistra (a).',
        en: 'Composite indexes follow the "leftmost prefix" rule: at least the leftmost column (a) is required.'
      }
    },
    {
      q: {
        it: "Cos'è un Index-Only Scan in Postgres?",
        en: 'What is an Index-Only Scan in Postgres?'
      },
      options: [
        {
          it: 'Una scansione che usa solo la heap',
          en: 'A scan that uses only the heap'
        },
        {
          it: "Una scansione soddisfatta interamente dall'indice (covering + visibility map)",
          en: 'A scan satisfied entirely from the index (covering + visibility map)'
        },
        { it: 'Una scansione parallela', en: 'A parallel scan' },
        {
          it: 'Una scansione che salta tutti gli indici',
          en: 'A scan that skips all indexes'
        }
      ],
      answer: 1,
      explanation: {
        it: "L'indice contiene tutte le colonne richieste e la visibility map dice \"tutte le tuple visibili\": niente fetch heap.",
        en: 'The index contains all required columns and the visibility map says "all tuples visible": no heap fetch.'
      }
    },
    {
      q: {
        it: 'Per pagine profonde su tabelle grandi, qual è il pattern raccomandato?',
        en: 'For deep pagination on large tables, what is the recommended pattern?'
      },
      options: [
        { it: 'OFFSET grande', en: 'Large OFFSET' },
        {
          it: 'Cursor / keyset pagination (WHERE id < $cursor ORDER BY id DESC LIMIT N)',
          en: 'Cursor / keyset pagination (WHERE id < $cursor ORDER BY id DESC LIMIT N)'
        },
        {
          it: 'Caricare tutto e paginare in app',
          en: 'Load everything and paginate in the app'
        },
        {
          it: 'Materializzare la query intera',
          en: 'Materialize the entire query'
        }
      ],
      answer: 1,
      explanation: {
        it: "OFFSET enorme costringe il DB a leggere e scartare migliaia di righe. La keyset pagination è O(log N) sull'indice.",
        en: 'Huge OFFSET forces the DB to read and discard thousands of rows. Keyset pagination is O(log N) on the index.'
      }
    },
    {
      q: {
        it: "Cos'è il problema N+1 in JPA/Hibernate?",
        en: 'What is the N+1 problem in JPA/Hibernate?'
      },
      options: [
        {
          it: 'Mancano N+1 indici sul DB',
          en: 'N+1 indexes are missing on the DB'
        },
        {
          it: 'Una query per il parent + N query per i child accessibili via lazy loading',
          en: 'One query for the parent + N queries for the children accessed via lazy loading'
        },
        {
          it: 'Un bug di concorrenza tra N+1 thread',
          en: 'A concurrency bug between N+1 threads'
        },
        {
          it: 'Una limitazione del pool di connessioni',
          en: 'A connection-pool limitation'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Iterando una lista di parent e accedendo alla relazione lazy, si generano N query in più. Soluzioni: JOIN FETCH, @EntityGraph, batch fetching.',
        en: 'Iterating a list of parents and accessing the lazy relationship generates N extra queries. Fixes: JOIN FETCH, @EntityGraph, batch fetching.'
      }
    },
    {
      q: {
        it: 'Cosa è il dirty checking di Hibernate?',
        en: 'What is Hibernate dirty checking?'
      },
      options: [
        {
          it: 'Validazione di costanti @Dirty',
          en: 'Validation of @Dirty constants'
        },
        {
          it: 'Confronto entity-managed vs snapshot iniziale per generare UPDATE automatici',
          en: 'Comparison of managed entity vs initial snapshot to generate automatic UPDATEs'
        },
        { it: 'Pulizia dei dati in import batch', en: 'Data cleanup in batch imports' },
        { it: 'Un sistema di rollback', en: 'A rollback system' }
      ],
      answer: 1,
      explanation: {
        it: 'Hibernate tiene uno snapshot dei dati al load. Al flush, confronta e genera UPDATE solo per i campi cambiati (con @DynamicUpdate).',
        en: 'Hibernate keeps a snapshot of data at load. On flush it diffs and generates UPDATEs only for the changed fields (with @DynamicUpdate).'
      }
    },
    {
      q: {
        it: 'Quale tipo di indice è ottimale per query "contains" su JSONB Postgres?',
        en: 'Which index type is optimal for "contains" queries on Postgres JSONB?'
      },
      options: [
        { it: 'B-tree', en: 'B-tree' },
        { it: 'Hash', en: 'Hash' },
        { it: 'GIN', en: 'GIN' },
        { it: 'BRIN', en: 'BRIN' }
      ],
      answer: 2,
      explanation: {
        it: 'GIN (Generalized Inverted Index) è progettato per array, JSON, full-text. Per @>, jsonb_path_ops è la variante più compatta.',
        en: 'GIN (Generalized Inverted Index) is designed for arrays, JSON, full-text. For @>, jsonb_path_ops is the more compact variant.'
      }
    },
    {
      q: {
        it: "L'outbox pattern risolve principalmente quale problema?",
        en: 'Which problem does the outbox pattern primarily solve?'
      },
      options: [
        {
          it: "Single point of failure di un'API gateway",
          en: 'Single point of failure of an API gateway'
        },
        {
          it: 'Pubblicazione atomica di eventi dopo un commit DB (dual write)',
          en: 'Atomic event publishing after a DB commit (dual write)'
        },
        {
          it: 'Connessioni esauste nel pool',
          en: 'Pool connection exhaustion'
        },
        { it: 'SQL injection', en: 'SQL injection' }
      ],
      answer: 1,
      explanation: {
        it: "In un'unica tx scrivi business + outbox; un dispatcher legge outbox e pubblica. Risolve l'inconsistenza tra DB e broker.",
        en: 'In a single tx you write business + outbox; a dispatcher reads outbox and publishes. Solves DB-to-broker inconsistency.'
      }
    },
    {
      q: {
        it: "Cos'è il optimistic locking in JPA?",
        en: 'What is optimistic locking in JPA?'
      },
      options: [
        {
          it: 'Un SELECT FOR UPDATE su tutta la tabella',
          en: 'A SELECT FOR UPDATE on the whole table'
        },
        {
          it: 'Una colonna @Version: UPDATE ... WHERE version=?, fallisce in caso di conflitto',
          en: 'A @Version column: UPDATE ... WHERE version=?, fails on conflict'
        },
        { it: 'Un lock distribuito Redis', en: 'A Redis distributed lock' },
        {
          it: 'Una transazione READ_UNCOMMITTED',
          en: 'A READ_UNCOMMITTED transaction'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Optimistic: niente lock fisico. La concorrenza è rilevata in commit (rows affected = 0 → OptimisticLockException).',
        en: 'Optimistic: no physical lock. Concurrency is detected at commit (rows affected = 0 → OptimisticLockException).'
      }
    }
  ],

  'api-communication': [
    {
      q: {
        it: 'Quale è un vincolo fondamentale di REST?',
        en: 'Which is a core REST constraint?'
      },
      options: [
        {
          it: 'Statefulness lato server',
          en: 'Server-side statefulness'
        },
        {
          it: 'Stateless: ogni richiesta contiene il contesto',
          en: 'Stateless: every request carries the context'
        },
        {
          it: 'Trasporto solo TCP grezzo',
          en: 'Raw TCP transport only'
        },
        {
          it: 'Schema XML obbligatorio',
          en: 'Mandatory XML schema'
        }
      ],
      answer: 1,
      explanation: {
        it: 'REST richiede che il server NON conservi stato di sessione tra le richieste — lo stato sta nel client o nelle risorse.',
        en: 'REST requires the server NOT to keep session state between requests — state lives in the client or in resources.'
      }
    },
    {
      q: {
        it: 'GraphQL risolve principalmente quale problema rispetto a REST?',
        en: 'Which problem does GraphQL primarily solve vs REST?'
      },
      options: [
        { it: 'Sicurezza CORS', en: 'CORS security' },
        {
          it: 'Over-fetching e under-fetching',
          en: 'Over-fetching and under-fetching'
        },
        { it: 'Caching HTTP', en: 'HTTP caching' },
        { it: 'Latenza TCP', en: 'TCP latency' }
      ],
      answer: 1,
      explanation: {
        it: 'Con GraphQL il client chiede esattamente i campi che gli servono, evitando endpoint multipli o payload sovradimensionati.',
        en: 'With GraphQL the client asks for exactly the fields it needs, avoiding multiple endpoints or oversized payloads.'
      }
    },
    {
      q: {
        it: 'In GraphQL, come si risolve il problema N+1?',
        en: 'In GraphQL, how is the N+1 problem fixed?'
      },
      options: [
        {
          it: 'Eseguendo le query in parallelo',
          en: 'Running queries in parallel'
        },
        {
          it: 'Usando DataLoader: batching delle richieste per tipo entro la stessa request',
          en: 'Using DataLoader: batching requests by type within the same request'
        },
        {
          it: "Forzando l'uso di JOIN SQL",
          en: 'Forcing the use of SQL JOINs'
        },
        { it: 'Disabilitando la cache', en: 'Disabling the cache' }
      ],
      answer: 1,
      explanation: {
        it: "DataLoader accumula gli ID richiesti in un batch e li carica con un'unica query. Per-request, non condiviso tra utenti.",
        en: 'DataLoader accumulates requested IDs into a batch and loads them with a single query. Per-request, not shared across users.'
      }
    },
    {
      q: {
        it: 'Idempotency-Key viene usato per:',
        en: 'Idempotency-Key is used to:'
      },
      options: [
        { it: 'Cifrare il payload', en: 'Encrypt the payload' },
        {
          it: 'Permettere al client di ritentare un POST senza duplicare side effect',
          en: 'Let the client retry a POST without duplicating side effects'
        },
        { it: 'Comprimere la response', en: 'Compress the response' },
        { it: 'Autenticare con OAuth', en: 'Authenticate via OAuth' }
      ],
      answer: 1,
      explanation: {
        it: 'Il server salva (key → response). Al retry con stessa key, restituisce la stessa risposta. Usato da Stripe.',
        en: 'The server stores (key → response). On retry with the same key, it returns the same response. Used by Stripe.'
      }
    },
    {
      q: {
        it: 'gRPC vs REST: vantaggio chiave di gRPC?',
        en: 'gRPC vs REST: gRPC key advantage?'
      },
      options: [
        {
          it: 'Funziona meglio nei browser',
          en: 'Works better in browsers'
        },
        {
          it: 'Protobuf binario + HTTP/2 multiplexing + streaming bidirezionale',
          en: 'Binary protobuf + HTTP/2 multiplexing + bidirectional streaming'
        },
        { it: 'Non richiede schema', en: 'Does not require a schema' },
        {
          it: 'È più semplice da debuggare',
          en: 'Easier to debug'
        }
      ],
      answer: 1,
      explanation: {
        it: 'gRPC sfrutta protobuf compatto e HTTP/2. Ideale per comunicazione interna ad alto throughput. Browser → gRPC-Web.',
        en: 'gRPC leverages compact protobuf and HTTP/2. Ideal for high-throughput internal comms. Browser → gRPC-Web.'
      }
    }
  ],

  'architecture-process': [
    {
      q: {
        it: 'Quale di queste è una delle DORA metrics?',
        en: 'Which of these is one of the DORA metrics?'
      },
      options: [
        { it: 'Average commit size', en: 'Average commit size' },
        { it: 'Lead time for changes', en: 'Lead time for changes' },
        { it: 'Numero di developer', en: 'Number of developers' },
        { it: 'Linee di codice totali', en: 'Total lines of code' }
      ],
      answer: 1,
      explanation: {
        it: 'Le 4 DORA metrics: deployment frequency, lead time, change failure rate, MTTR. Sono misure di salute DevOps.',
        en: 'The 4 DORA metrics: deployment frequency, lead time, change failure rate, MTTR. They are DevOps health measures.'
      }
    },
    {
      q: {
        it: 'In una saga distribuita, cosa accade se uno step intermedio fallisce?',
        en: 'In a distributed saga, what happens if an intermediate step fails?'
      },
      options: [
        {
          it: "L'intero database viene rollato indietro con 2PC",
          en: 'The whole database is rolled back with 2PC'
        },
        {
          it: 'Vengono eseguite le compensazioni degli step precedenti',
          en: 'Compensations for previous steps are executed'
        },
        { it: 'Si ignora e si prosegue', en: 'It is ignored and we move on' },
        {
          it: 'Il broker invalida tutti i messaggi della giornata',
          en: 'The broker invalidates all messages for the day'
        }
      ],
      answer: 1,
      explanation: {
        it: "Saga = transazioni locali + compensazioni. Niente XA: ogni servizio rolla con un'azione compensatoria.",
        en: 'Saga = local transactions + compensations. No XA: each service rolls back with a compensating action.'
      }
    },
    {
      q: {
        it: "Cos'è l'expand/contract per migrazioni DB?",
        en: 'What is expand/contract for DB migrations?'
      },
      options: [
        {
          it: 'Una metrica di crescita del DB',
          en: 'A DB growth metric'
        },
        {
          it: 'Pattern: prima aggiungi (additivo), poi rimuovi in una release successiva. Zero downtime',
          en: 'Pattern: first add (additive), then remove in a later release. Zero downtime'
        },
        { it: 'Un trigger di backup', en: 'A backup trigger' },
        {
          it: 'Una variante di OFFSET pagination',
          en: 'A variant of OFFSET pagination'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Expand: nuova colonna nullable + backfill. Codice migra. Contract: rimuovi la vecchia. Permette deploy continuo senza downtime.',
        en: 'Expand: new nullable column + backfill. Code migrates. Contract: drop the old one. Enables continuous deploy with no downtime.'
      }
    },
    {
      q: {
        it: "Cos'è un BFF (Backend For Frontend)?",
        en: 'What is a BFF (Backend For Frontend)?'
      },
      options: [
        { it: 'Un load balancer', en: 'A load balancer' },
        {
          it: 'Un backend dedicato a uno specifico frontend (web, mobile), che aggrega altre API',
          en: 'A backend dedicated to a specific frontend (web, mobile) that aggregates other APIs'
        },
        { it: 'Un database NoSQL', en: 'A NoSQL database' },
        {
          it: 'Un servizio di autenticazione',
          en: 'An authentication service'
        }
      ],
      answer: 1,
      explanation: {
        it: 'BFF è un servizio "gateway" specifico per un client, ottimizzato per le sue esigenze (es. payload mobile compatto vs web).',
        en: 'BFF is a client-specific "gateway" service, optimized for that client (e.g. compact mobile payload vs web).'
      }
    },
    {
      q: {
        it: 'Trunk-based development vs GitFlow per CD moderno?',
        en: 'Trunk-based development vs GitFlow for modern CD?'
      },
      options: [
        {
          it: 'GitFlow è più adatto a release continue',
          en: 'GitFlow is better suited to continuous releases'
        },
        {
          it: 'Trunk-based + feature flag favorisce CD: branch brevi, integrazione frequente, feature off finché non pronte',
          en: 'Trunk-based + feature flags favors CD: short branches, frequent integration, features off until ready'
        },
        { it: 'Sono equivalenti', en: 'They are equivalent' },
        {
          it: 'Trunk-based richiede sempre release notes manuali',
          en: 'Trunk-based always requires manual release notes'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Trunk-based + feature flag disaccoppia deploy da release. GitFlow è progettato per release pianificate, troppo pesante per CD.',
        en: 'Trunk-based + feature flags decouples deploy from release. GitFlow is designed for scheduled releases, too heavy for CD.'
      }
    },
    {
      q: {
        it: 'Quando un microservizio è "troppo piccolo"?',
        en: 'When is a microservice "too small"?'
      },
      options: [
        {
          it: 'Quando ha meno di 100 endpoint',
          en: 'When it has fewer than 100 endpoints'
        },
        {
          it: 'Quando il costo di rete/observability/deploy supera i benefici di indipendenza',
          en: 'When the cost of network/observability/deploy outweighs the benefits of independence'
        },
        {
          it: 'Mai: più piccoli sono, meglio è',
          en: 'Never: the smaller the better'
        },
        {
          it: 'Quando il team è composto da più di 2 persone',
          en: 'When the team has more than 2 people'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Servizi nano-piccoli portano a "distributed monolith": deployati sempre insieme, paghi rete senza benefici.',
        en: 'Nano services lead to a "distributed monolith": always deployed together, you pay for network with no benefit.'
      }
    },
    {
      q: {
        it: 'SLO vs SLA: principale differenza?',
        en: 'SLO vs SLA: main difference?'
      },
      options: [
        { it: 'Sono sinonimi', en: 'They are synonyms' },
        {
          it: 'SLO obiettivo interno (es. p95 < 500ms); SLA contratto col cliente con penali',
          en: 'SLO internal target (e.g. p95 < 500ms); SLA customer contract with penalties'
        },
        {
          it: 'SLO è sempre più alto di SLA',
          en: 'SLO is always higher than SLA'
        },
        {
          it: 'SLA si misura, SLO no',
          en: 'SLA is measured, SLO is not'
        }
      ],
      answer: 1,
      explanation: {
        it: 'SLI=indicatore, SLO=obiettivo interno, SLA=contratto. Error budget = 100% - SLO consente gestire ritmo di release.',
        en: 'SLI=indicator, SLO=internal target, SLA=contract. Error budget = 100% - SLO governs the release pace.'
      }
    }
  ],

  'spring-ai': [
    {
      q: {
        it: 'In Spring AI, cosa fa un `VectorStore`?',
        en: 'In Spring AI, what does a `VectorStore` do?'
      },
      options: [
        {
          it: 'Memorizza prompt cifrati',
          en: 'Stores encrypted prompts'
        },
        {
          it: 'Salva embeddings per ricerca semantica',
          en: 'Stores embeddings for semantic search'
        },
        {
          it: 'Tiene cache delle risposte LLM',
          en: 'Caches LLM responses'
        },
        {
          it: 'Persiste i log delle chat',
          en: 'Persists chat logs'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Un VectorStore indicizza embeddings di documenti per fare similarity search e supportare RAG.',
        en: 'A VectorStore indexes document embeddings for similarity search and to power RAG.'
      }
    },
    {
      q: {
        it: 'Cos\'è il "function calling" in Spring AI?',
        en: 'What is "function calling" in Spring AI?'
      },
      options: [
        { it: 'Una callback HTTP', en: 'An HTTP callback' },
        {
          it: "L'LLM decide quando invocare funzioni Java esposte come tool",
          en: 'The LLM decides when to invoke Java functions exposed as tools'
        },
        { it: 'Una chiamata RPC', en: 'An RPC call' },
        { it: 'Un evento Kafka', en: 'A Kafka event' }
      ],
      answer: 1,
      explanation: {
        it: "Spring AI espone le tue funzioni come \"tool\". L'LLM decide quali chiamare in base al prompt, la libreria invoca e passa il risultato.",
        en: 'Spring AI exposes your functions as "tools". The LLM decides which to call based on the prompt; the library invokes and passes the result back.'
      }
    },
    {
      q: {
        it: 'Quale è una mitigation contro la prompt injection?',
        en: 'Which is a mitigation against prompt injection?'
      },
      options: [
        {
          it: 'Cifrare il database',
          en: 'Encrypt the database'
        },
        {
          it: "Delimitare il contesto utente, validare l'output, sandboxing dei tool",
          en: 'Delimit user context, validate output, sandbox the tools'
        },
        {
          it: 'Disabilitare le funzioni Java',
          en: 'Disable Java functions'
        },
        {
          it: "Aumentare la temperature dell'LLM",
          en: "Raise the LLM's temperature"
        }
      ],
      answer: 1,
      explanation: {
        it: 'Prompt injection: input utente che altera istruzioni sistema. Mitigazioni: spotlighting, delimitatori, validazione output, sandbox tool.',
        en: 'Prompt injection: user input altering system instructions. Mitigations: spotlighting, delimiters, output validation, tool sandboxing.'
      }
    },
    {
      q: {
        it: 'Cosa significa RAG (Retrieval-Augmented Generation)?',
        en: 'What does RAG (Retrieval-Augmented Generation) mean?'
      },
      options: [
        {
          it: 'Generare codice random',
          en: 'Generate random code'
        },
        {
          it: "Recuperare contesto da un knowledge base e iniettarlo nel prompt dell'LLM",
          en: 'Retrieve context from a knowledge base and inject it into the LLM prompt'
        },
        {
          it: 'Cifrare il prompt prima di inviarlo',
          en: 'Encrypt the prompt before sending'
        },
        {
          it: 'Rinforzare il modello con reinforcement learning',
          en: 'Reinforce the model with reinforcement learning'
        }
      ],
      answer: 1,
      explanation: {
        it: "RAG combina similarity search (su un VectorStore) + generazione: l'LLM risponde su dati propri senza fine-tuning.",
        en: 'RAG combines similarity search (over a VectorStore) + generation: the LLM answers over your data without fine-tuning.'
      }
    },
    {
      q: {
        it: 'Quale di questi NON è un VectorStore comune?',
        en: 'Which of these is NOT a common VectorStore?'
      },
      options: [
        { it: 'Pinecone', en: 'Pinecone' },
        { it: 'Chroma', en: 'Chroma' },
        { it: 'MariaDB', en: 'MariaDB' },
        { it: 'PgVector', en: 'PgVector' }
      ],
      answer: 2,
      explanation: {
        it: 'MariaDB non ha un VectorStore nativo standard. Pinecone, Chroma, Qdrant, PgVector, Weaviate sono i più usati per RAG.',
        en: 'MariaDB has no standard native VectorStore. Pinecone, Chroma, Qdrant, PgVector, Weaviate are the most used ones for RAG.'
      }
    }
  ],

  'jvm-internals': [
    {
      q: {
        it: 'Cosa fa il JIT compiler della JVM?',
        en: 'What does the JVM JIT compiler do?'
      },
      options: [
        {
          it: 'Compila il codice Java in bytecode',
          en: 'Compiles Java code to bytecode'
        },
        {
          it: 'Compila a runtime il bytecode in codice nativo per i metodi caldi',
          en: 'Compiles bytecode to native code at runtime for hot methods'
        },
        {
          it: 'Carica le classi dal classpath',
          en: 'Loads classes from the classpath'
        },
        {
          it: 'Esegue il garbage collection',
          en: 'Runs garbage collection'
        }
      ],
      answer: 1,
      explanation: {
        it: 'JIT (Just-In-Time): converte bytecode in codice nativo per i metodi hot. Tiered: C1 veloce, C2 più ottimizzato.',
        en: 'JIT (Just-In-Time): converts bytecode to native code for hot methods. Tiered: C1 fast, C2 more optimized.'
      }
    },
    {
      q: {
        it: 'Dove vive un oggetto allocato con `new` in Java?',
        en: 'Where does an object allocated with `new` live in Java?'
      },
      options: [
        { it: 'Stack', en: 'Stack' },
        { it: 'Heap', en: 'Heap' },
        { it: 'Metaspace', en: 'Metaspace' },
        {
          it: 'Sempre in memoria nativa',
          en: 'Always in native memory'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Tutti gli oggetti `new` vivono sulla heap. Lo stack tiene call frame e primitivi locali. Il JIT può però fare scalar replacement con escape analysis.',
        en: 'All `new` objects live on the heap. The stack keeps call frames and local primitives. The JIT can do scalar replacement via escape analysis.'
      }
    },
    {
      q: {
        it: 'Quale di queste NON è una garanzia del JMM (Java Memory Model)?',
        en: 'Which is NOT a guarantee of the JMM (Java Memory Model)?'
      },
      options: [
        {
          it: 'happens-before tra unlock e lock successivo dello stesso monitor',
          en: 'happens-before between unlock and a subsequent lock on the same monitor'
        },
        {
          it: 'happens-before tra write e read di una variabile volatile',
          en: 'happens-before between write and read of a volatile variable'
        },
        {
          it: 'Visibilità automatica tra thread senza alcuna sincronizzazione',
          en: 'Automatic visibility across threads without any synchronization'
        },
        {
          it: 'happens-before tra azioni in un singolo thread (program order)',
          en: 'happens-before between actions in a single thread (program order)'
        }
      ],
      answer: 2,
      explanation: {
        it: 'Senza sincronizzazione, niente garanzia di visibilità tra thread. CPU e cache reorder. Servono volatile, lock, atomic.',
        en: 'Without synchronization there is no cross-thread visibility guarantee. CPUs and caches reorder. You need volatile, locks, atomics.'
      }
    },
    {
      q: {
        it: 'Cosa garantisce `volatile` su una variabile?',
        en: 'What does `volatile` guarantee on a variable?'
      },
      options: [
        {
          it: 'Atomicità di operazioni composte (i++)',
          en: 'Atomicity of compound operations (i++)'
        },
        {
          it: 'Visibilità tra thread, ma non atomicità di operazioni composte',
          en: 'Cross-thread visibility, but not compound-operation atomicity'
        },
        {
          it: 'Atomicità ma non visibilità',
          en: 'Atomicity but not visibility'
        },
        {
          it: 'Lock implicito su tutta la classe',
          en: 'Implicit class-wide lock'
        }
      ],
      answer: 1,
      explanation: {
        it: 'volatile garantisce solo visibilità (e ordering). Per atomicità di i++ servono AtomicLong o synchronized.',
        en: 'volatile guarantees visibility (and ordering) only. For i++ atomicity, use AtomicLong or synchronized.'
      }
    },
    {
      q: {
        it: "Cos'è l'escape analysis del JIT?",
        en: 'What is JIT escape analysis?'
      },
      options: [
        {
          it: 'Una tecnica per uscire da loop infiniti',
          en: 'A technique to exit infinite loops'
        },
        {
          it: 'Analisi che capisce se un oggetto "scappa" dal metodo: se no, può allocarlo sullo stack',
          en: 'An analysis that detects whether an object "escapes" the method: if not, it can allocate on the stack'
        },
        { it: 'Un GC algorithm', en: 'A GC algorithm' },
        {
          it: 'Un meccanismo di sicurezza',
          en: 'A security mechanism'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Oggetto non-escaping: scalar replacement (campi in registri), niente allocazione heap, lock elision.',
        en: 'Non-escaping object: scalar replacement (fields in registers), no heap allocation, lock elision.'
      }
    },
    {
      q: {
        it: 'Compressed oops: in che situazione hanno effetto?',
        en: 'Compressed oops: in what situation do they take effect?'
      },
      options: [
        { it: 'Heap > 32 GB', en: 'Heap > 32 GB' },
        {
          it: 'JVM 64-bit con heap ≤ 32 GB',
          en: '64-bit JVM with heap ≤ 32 GB'
        },
        { it: 'JVM 32-bit', en: '32-bit JVM' },
        { it: 'Solo con ZGC', en: 'Only with ZGC' }
      ],
      answer: 1,
      explanation: {
        it: 'Con heap ≤ 32 GB i puntatori sono 32-bit (shift 3 per indirizzare blocchi da 8 byte). Risparmio di memoria significativo.',
        en: 'With heap ≤ 32 GB, pointers are 32-bit (shift by 3 to address 8-byte blocks). Significant memory saving.'
      }
    },
    {
      q: {
        it: 'Virtual threads (Java 21+) vs platform threads:',
        en: 'Virtual threads (Java 21+) vs platform threads:'
      },
      options: [
        {
          it: 'Sono identici, solo nome diverso',
          en: 'Identical, just a different name'
        },
        {
          it: 'Virtual sono leggerissimi, parcheggiati su blocking I/O; platform sono 1:1 con OS thread',
          en: 'Virtual are very lightweight, parked on blocking I/O; platform are 1:1 with OS threads'
        },
        {
          it: 'Virtual usano più memoria',
          en: 'Virtual use more memory'
        },
        {
          it: 'Virtual sono solo per Android',
          en: 'Virtual are Android-only'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Virtual thread: KB di memoria, gestiti dalla JVM. Su I/O bloccante non occupano carrier thread. Sostituiscono molti pattern async.',
        en: 'Virtual thread: KBs of memory, managed by the JVM. On blocking I/O they free the carrier thread. They replace many async patterns.'
      }
    }
  ],

  'design-patterns': [
    {
      q: {
        it: 'In Java moderno, quale soluzione spesso sostituisce il Visitor pattern?',
        en: 'In modern Java, which solution often replaces the Visitor pattern?'
      },
      options: [
        { it: 'Singleton', en: 'Singleton' },
        {
          it: 'Pattern matching su sealed interface + switch',
          en: 'Pattern matching on a sealed interface + switch'
        },
        { it: 'Factory Method', en: 'Factory Method' },
        { it: 'Builder', en: 'Builder' }
      ],
      answer: 1,
      explanation: {
        it: 'Sealed interface + switch esaustivo con pattern matching: niente accept/visit, più conciso, type-safe esaustivo.',
        en: 'Sealed interface + exhaustive switch with pattern matching: no accept/visit, more concise, type-safe exhaustive.'
      }
    },
    {
      q: {
        it: 'Cos\'è il "fragile base class problem"?',
        en: 'What is the "fragile base class problem"?'
      },
      options: [
        {
          it: 'Una classe astratta che non compila',
          en: 'An abstract class that does not compile'
        },
        {
          it: 'Modificare una superclasse rischia di rompere sottoclassi sconosciute',
          en: 'Changing a superclass risks breaking unknown subclasses'
        },
        {
          it: 'Una classe che lancia troppe eccezioni',
          en: 'A class that throws too many exceptions'
        },
        {
          it: 'Un anti-pattern legato a final',
          en: 'An anti-pattern tied to final'
        }
      ],
      answer: 1,
      explanation: {
        it: "L'ereditarietà accoppia rigidamente: cambiare la base può rompere figli che fanno assunzioni implicite. Composition over inheritance lo evita.",
        en: 'Inheritance is a rigid coupling: changing the base can break children that make implicit assumptions. Composition over inheritance avoids it.'
      }
    },
    {
      q: {
        it: 'In Hexagonal Architecture, la regola fondamentale è:',
        en: 'In Hexagonal Architecture, the core rule is:'
      },
      options: [
        {
          it: 'Il database al centro',
          en: 'The database at the center'
        },
        {
          it: "Le dipendenze puntano sempre verso l'esterno",
          en: 'Dependencies always point outward'
        },
        {
          it: "Le dipendenze puntano sempre verso l'interno (dominio puro)",
          en: 'Dependencies always point inward (pure domain)'
        },
        {
          it: 'Nessuna interfaccia, solo classi concrete',
          en: 'No interfaces, only concrete classes'
        }
      ],
      answer: 2,
      explanation: {
        it: 'Dominio al centro, indipendente da framework/infrastruttura. Adapter dipendono dal dominio, mai il contrario.',
        en: 'Domain at the center, independent of framework/infrastructure. Adapters depend on the domain, never the other way.'
      }
    },
    {
      q: {
        it: 'Decorator pattern: quale è il suo intent?',
        en: 'Decorator pattern: what is its intent?'
      },
      options: [
        {
          it: "Controllare l'accesso a un oggetto",
          en: 'Control access to an object'
        },
        {
          it: 'Aggiungere comportamento a un oggetto senza ereditarietà',
          en: 'Add behavior to an object without inheritance'
        },
        { it: 'Creare singleton', en: 'Create singletons' },
        {
          it: 'Definire una famiglia di algoritmi',
          en: 'Define a family of algorithms'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Decorator wrap un oggetto delegando + aggiungendo logica (es. LoggingClient → BaseClient). Composizione runtime di funzionalità.',
        en: 'Decorator wraps an object by delegating + adding logic (e.g. LoggingClient → BaseClient). Runtime composition of features.'
      }
    },
    {
      q: {
        it: 'Strategy + lambda: cosa cambia rispetto al Strategy classico?',
        en: 'Strategy + lambda: what changes vs classic Strategy?'
      },
      options: [
        { it: 'Niente, sono identici', en: 'Nothing, they are identical' },
        {
          it: 'Lambda evita di creare N classi per N strategie. Si passa Function<T,R> direttamente.',
          en: 'Lambda avoids creating N classes for N strategies. You pass a Function<T,R> directly.'
        },
        { it: 'La lambda è più veloce', en: 'The lambda is faster' },
        {
          it: 'Strategy non funziona con lambda',
          en: 'Strategy does not work with lambdas'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Per strategie semplici, una lambda sostituisce N classi che implementano la stessa interfaccia. Meno boilerplate.',
        en: 'For simple strategies, a lambda replaces N classes that implement the same interface. Less boilerplate.'
      }
    },
    {
      q: {
        it: 'CQRS è:',
        en: 'CQRS is:'
      },
      options: [
        {
          it: 'Un linguaggio di query',
          en: 'A query language'
        },
        {
          it: 'Un pattern che separa scrittura (Command) e lettura (Query) con modelli ottimizzati',
          en: 'A pattern that separates write (Command) and read (Query) with optimized models'
        },
        {
          it: 'Una tecnica di compressione',
          en: 'A compression technique'
        },
        {
          it: 'Una variante di Singleton',
          en: 'A Singleton variant'
        }
      ],
      answer: 1,
      explanation: {
        it: 'CQRS = Command Query Responsibility Segregation. Spesso accoppiato a event sourcing. Costo: eventual consistency.',
        en: 'CQRS = Command Query Responsibility Segregation. Often paired with event sourcing. Cost: eventual consistency.'
      }
    }
  ],

  curiosita: [
    {
      q: {
        it: 'Per compilare Swift su Android serve principalmente:',
        en: 'To compile Swift on Android you mainly need:'
      },
      options: [
        { it: 'Il Play Store CLI', en: 'The Play Store CLI' },
        {
          it: 'La Swift toolchain + Android NDK',
          en: 'The Swift toolchain + Android NDK'
        },
        {
          it: 'Solo Kotlin Multiplatform',
          en: 'Only Kotlin Multiplatform'
        },
        {
          it: 'Rust come compilatore',
          en: 'Rust as the compiler'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Si usa una toolchain Swift cross-compilata con il NDK per produrre librerie native usate poi via JNI.',
        en: 'You use a Swift toolchain cross-compiled with the NDK to produce native libraries used via JNI.'
      }
    },
    {
      q: {
        it: 'Perché tecnicamente Swift può girare su Android?',
        en: 'Why can Swift technically run on Android?'
      },
      options: [
        {
          it: "Apple ha rilasciato un'app Android",
          en: 'Apple released an Android app'
        },
        {
          it: 'Swift compila via LLVM e la libc Android (bionic) è target supportato',
          en: 'Swift compiles via LLVM and Android libc (bionic) is a supported target'
        },
        {
          it: 'Java traduce Swift al volo',
          en: 'Java translates Swift on the fly'
        },
        {
          it: 'Android usa Mach-O come iOS',
          en: 'Android uses Mach-O like iOS'
        }
      ],
      answer: 1,
      explanation: {
        it: 'Swift è LLVM-based. La stdlib portata + Android NDK permette di emettere binari .so per arm/aarch64-android.',
        en: 'Swift is LLVM-based. The ported stdlib + Android NDK allow emitting .so binaries for arm/aarch64-android.'
      }
    },
    {
      q: {
        it: 'Limite pratico maggiore di Swift su Android nel 2025-2026?',
        en: 'Biggest practical limit of Swift on Android in 2025-2026?'
      },
      options: [
        {
          it: 'Nessuno, è la scelta standard',
          en: 'None, it is the standard choice'
        },
        {
          it: 'Foundation parziale, niente UIKit/SwiftUI, build pesante, tooling debug inesistente',
          en: 'Partial Foundation, no UIKit/SwiftUI, heavy build, no debug tooling'
        },
        {
          it: 'Non supporta async/await',
          en: 'Does not support async/await'
        },
        {
          it: 'È più lento di Kotlin',
          en: 'Slower than Kotlin'
        }
      ],
      answer: 1,
      explanation: {
        it: "Foundation incompleta (no URLSession completo), niente UI Apple-only, stdlib pesante (15-25 MB per arch). Tooling minimo.",
        en: 'Incomplete Foundation (no full URLSession), no Apple-only UI, heavy stdlib (15-25 MB per arch). Minimal tooling.'
      }
    },
    {
      q: {
        it: 'Alternativa raccomandata per condividere codice tra iOS e Android nel 2026?',
        en: 'Recommended alternative to share code between iOS and Android in 2026?'
      },
      options: [
        {
          it: 'Swift su Android',
          en: 'Swift on Android'
        },
        {
          it: 'Kotlin Multiplatform (KMP)',
          en: 'Kotlin Multiplatform (KMP)'
        },
        {
          it: 'C++ ovunque',
          en: 'C++ everywhere'
        },
        {
          it: 'JavaScript via WebView',
          en: 'JavaScript via WebView'
        }
      ],
      answer: 1,
      explanation: {
        it: 'KMP è la scelta moderna: condivide logica business (domain, networking) e lascia UI nativa per piattaforma.',
        en: 'KMP is the modern choice: shares business logic (domain, networking) and leaves UI native per platform.'
      }
    }
  ]
};

export function getQuiz(quizId) {
  return QUIZZES[quizId] || [];
}

export function getAllQuizzes() {
  return Object.entries(QUIZZES).map(([id, qs]) => ({ id, questions: qs }));
}
