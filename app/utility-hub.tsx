"use client";

import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

declare global {
  interface Window {
    __reactUtilityHubIntegrated?: boolean;
  }
}

const applications = [
  {
    id: "easy-crypt",
    name: "Easy Crypt",
    description: "Cripta e decripta testi con una password, direttamente nel browser.",
    icon: "/app-icons/easy-crypt.svg",
    category: "Privacy",
    accent: "mint",
  },
  {
    id: "extract-audio",
    name: "Estrai audio da video",
    description: "Estrai l'audio dai video senza caricare file su un server.",
    icon: "/app-icons/extract-audio.png",
    category: "Audio",
    accent: "violet",
  },
  {
    id: "pidieffe",
    name: "PIDIEFFE",
    description: "Riordina, annota e modifica PDF mantenendo i file sul tuo dispositivo.",
    icon: "/app-icons/pidieffe.png",
    category: "Documenti",
    accent: "coral",
  },
  {
    id: "scrubb",
    name: "Scrubb",
    description: "Riconosci e oscura dati sensibili in testi, log e snippet di codice.",
    icon: "/app-icons/scrubb.png",
    category: "Sicurezza",
    accent: "blue",
  },
  {
    id: "slideshower",
    name: "Slideshower",
    description: "Crea slideshow locali di foto e video, anche a schermo intero.",
    icon: "/app-icons/slideshower.png",
    category: "Media",
    accent: "amber",
  },
  {
    id: "devdex",
    name: "DevDex",
    description: "Studia concetti di sviluppo, quiz e flashcard in un'enciclopedia locale.",
    icon: "/app-icons/devdex.png",
    category: "Studio",
    accent: "indigo",
  },
  {
    id: "mutuostep",
    name: "MutuoStep",
    description: "Pianifica l'acquisto della prima casa con budget, roadmap e checklist locali.",
    icon: "/mutuostep/icons/icon-512.png",
    category: "Finanze",
    accent: "mint",
  },
] as const;

type ApplicationId = (typeof applications)[number]["id"];
type IntegratedApplicationLoader = () => Promise<{ default: ComponentType }>;

// Manteniamo un parametro di revisione negli URL interni: oltre a rendere
// inequivocabile la versione caricata, evita che un vecchio documento del
// browser riapra una schermata con lo stesso URL di una build precedente.
const HUB_REVISION = "2026-08-10.1";

function hubHref(applicationId?: ApplicationId) {
  const parameters = new URLSearchParams();
  if (applicationId) parameters.set("app", applicationId);
  parameters.set("hub", HUB_REVISION);

  return `/?${parameters.toString()}`;
}

function lazyWithCacheRecovery(load: IntegratedApplicationLoader) {
  return lazy(async () => {
    const retryKey =
      typeof window === "undefined"
        ? ""
        : `web-app-utility-hub:stale-module:${window.location.pathname}${window.location.search}`;

    try {
      const module = await load();
      if (retryKey) window.sessionStorage.removeItem(retryKey);
      return module;
    } catch (error) {
      // Dopo un aggiornamento, un vecchio documento può ancora puntare a un
      // chunk che non esiste più. Ricarichiamo una sola volta per ottenere
      // l'HTML e i moduli attuali, evitando qualsiasi ciclo di refresh.
      if (retryKey && !window.sessionStorage.getItem(retryKey)) {
        window.sessionStorage.setItem(retryKey, "1");
        window.location.reload();
        return new Promise<never>(() => undefined);
      }

      throw error;
    }
  });
}

const integratedApplications: Record<ApplicationId, LazyExoticComponent<ComponentType>> = {
  "easy-crypt": lazyWithCacheRecovery(() => import("./integrated/easy-crypt")),
  "extract-audio": lazyWithCacheRecovery(() => import("./integrated/extract-audio")),
  pidieffe: lazyWithCacheRecovery(() => import("./integrated/pidieffe")),
  scrubb: lazyWithCacheRecovery(() => import("./integrated/scrubb")),
  slideshower: lazyWithCacheRecovery(async () => {
    if (typeof window !== "undefined") window.__reactUtilityHubIntegrated = true;
    return import("./integrated/slideshower");
  }),
  devdex: lazyWithCacheRecovery(() => import("./integrated/devdex")),
  mutuostep: lazyWithCacheRecovery(() => import("./integrated/mutuostep")),
};

function isApplicationId(value: string | undefined): value is ApplicationId {
  return applications.some((application) => application.id === value);
}

function LoadingApplication() {
  return <div className="application-loader">Caricamento utility…</div>;
}

function ApplicationScreen({ applicationId }: { applicationId: ApplicationId }) {
  const Application = integratedApplications[applicationId];
  const [hasMounted, setHasMounted] = useState(false);

  // Le app importate sono nate come applicazioni standalone: alcune leggono
  // lingua, storage o API del browser già al primo render. Renderizzarle solo
  // dopo l'idratazione mantiene identico l'HTML iniziale e impedisce che un
  // errore di hydration blocchi la schermata.
  useEffect(() => {
    // MutuoStep viene eseguita in un iframe dello stesso host. Il flag viene
    // impostato prima che l'iframe venga creato, così la sua PWA non registra
    // un service worker separato né una cache persistente dell'hub.
    window.__reactUtilityHubIntegrated = true;
    setHasMounted(true);
  }, []);

  return (
    <div className={`integrated-application integrated-${applicationId}`}>
      <a
        aria-label="Torna a tutte le utility"
        className="back-to-hub"
        href={hubHref()}
        title="Torna a tutte le utility"
      >
        <span aria-hidden="true" className="back-to-hub__icon">←</span>
        <span className="back-to-hub__label">Tutte le utility</span>
      </a>
      {hasMounted ? (
        <Suspense fallback={<LoadingApplication />}>
          <Application />
        </Suspense>
      ) : (
        <LoadingApplication />
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <main className="dashboard">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Le mie app locali</p>
          <h1 id="page-title">Web App Utility Hub</h1>
          <p className="hero-copy">
            Un unico punto di partenza per i tuoi strumenti web. Scegli un&apos;app per
            usarla direttamente qui, senza aprire altri server.
          </p>
        </div>
        <div className="app-count" aria-label="Sette applicazioni disponibili">
          <strong>7</strong>
          <span>app disponibili</span>
        </div>
      </section>

      <section className="application-grid" aria-label="Applicazioni disponibili">
        {applications.map((application) => (
          <a
            className={`application-card accent-${application.accent}`}
            href={hubHref(application.id)}
            key={application.id}
          >
            <div className="card-topline">
              <div className="icon-wrap">
                <img alt="" height="72" src={application.icon} width="72" />
              </div>
              <span className="category">{application.category}</span>
            </div>
            <div className="card-content">
              <h2>{application.name}</h2>
              <p>{application.description}</p>
            </div>
            <div className="card-footer">
              <span>Integrata nell&apos;hub</span>
              <span className="open-action">Apri <span aria-hidden="true">→</span></span>
            </div>
          </a>
        ))}
      </section>

      <aside className="local-note">
        <span className="status-dot" aria-hidden="true" />
        <p>Un solo server locale: file e dati restano sul tuo computer.</p>
      </aside>
    </main>
  );
}

export function UtilityHub({ requestedApp }: { requestedApp?: string }) {
  useEffect(() => {
    // Una versione precedente di Slideshower poteva registrare /sw.js per
    // l'intero host dell'hub. Quel worker serviva risorse obsolete soltanto
    // nelle sessioni normali (in incognito non esisteva), perciò rimuoviamo
    // ogni worker e Cache Storage dell'host ad ogni arrivo nell'app.
    const clearLegacyBrowserCache = async () => {
      const tasks: Promise<unknown>[] = [];

      if ("serviceWorker" in navigator) {
        tasks.push(
          navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())),)
        );
      }

      if ("caches" in window) {
        tasks.push(caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))));
      }

      await Promise.allSettled(tasks);
    };

    void clearLegacyBrowserCache();
  }, []);

  return isApplicationId(requestedApp) ? <ApplicationScreen applicationId={requestedApp} /> : <Dashboard />;
}
