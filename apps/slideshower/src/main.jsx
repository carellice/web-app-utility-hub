import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Shrink,
  Expand,
  FolderOpen,
  Image as ImageIcon,
  ListRestart,
  MonitorPlay,
  Pause,
  Play,
  RefreshCw,
  SlidersHorizontal,
  Shuffle,
  SkipForward,
  Smartphone,
  Square,
  TimerReset,
  Video,
  X,
} from "lucide-react";
import "./styles.css";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/bmp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/ogg", "video/quicktime"]);
const IS_ANDROID = /Android/i.test(navigator.userAgent);
const IS_DESKTOP_APP = Boolean(window.slideshowerDesktop) || /Electron/i.test(navigator.userAgent);

const isMediaFile = (file) =>
  IMAGE_TYPES.has(file.type) ||
  VIDEO_TYPES.has(file.type) ||
  /\.(jpe?g|png|webp|gif|avif|bmp|mp4|webm|ogv|ogg|mov|m4v)$/i.test(file.name);

const getKind = (file) => (file.type.startsWith("video/") || /\.(mp4|webm|ogv|ogg|mov|m4v)$/i.test(file.name) ? "video" : "image");

const naturalSort = (a, b) =>
  a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: "base" });

const shuffleItems = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const reshuffleForRestart = (items) => {
  if (items.length < 2) return items;

  let shuffled = shuffleItems(items);
  const firstPath = items[0].path;
  const isSameOrder = shuffled.every((item, itemIndex) => item.path === items[itemIndex].path);

  if (isSameOrder || shuffled[0].path === firstPath) {
    shuffled = [...shuffled.slice(1), shuffled[0]];
  }

  return shuffled;
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
};

const SETTING_HELP = {
  imageSeconds: "Tempo di permanenza di ogni foto prima del passaggio automatico.",
  videoMode: "Sceglie se riprodurre ogni video fino alla fine o usare un tempo fisso.",
  videoSeconds: "Durata massima dei video quando è attiva la modalità a tempo fisso.",
  transitionMs: "Velocità della dissolvenza quando cambia foto o video.",
  order: "Ordine iniziale dei media caricati dalla cartella.",
  loop: "Quando finisce la lista, lo slideshow ricomincia dal primo media.",
  muted: "Riproduce i video senza audio.",
  captions: "Mostra in basso il nome del file attualmente in riproduzione.",
};

const SETTINGS_STORAGE_KEY = "slideshower-settings-v1";
const DEFAULT_SETTINGS = {
  imageSeconds: 6,
  videoMode: "full",
  videoSeconds: 20,
  transitionMs: 450,
  order: "name",
  loop: true,
  muted: true,
  captions: true,
};

function getInitialSettings() {
  try {
    const savedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!savedSettings) return DEFAULT_SETTINGS;

    return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function walkDirectory(handle, prefix = "") {
  const files = [];
  for await (const [name, child] of handle.entries()) {
    if (child.kind === "file") {
      const file = await child.getFile();
      if (isMediaFile(file)) {
        files.push({ file, path: `${prefix}${name}`, kind: getKind(file), url: URL.createObjectURL(file) });
      }
    }

    if (child.kind === "directory") {
      files.push(...(await walkDirectory(child, `${prefix}${name}/`)));
    }
  }
  return files;
}

function useWakeLock(isPlaying) {
  useEffect(() => {
    let lock;
    let active = true;

    async function requestLock() {
      if (!isPlaying || !("wakeLock" in navigator)) return;
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch {
        lock = undefined;
      }
    }

    requestLock();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && active) requestLock();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (lock) lock.release();
    };
  }, [isPlaying]);
}

export default function App({ logoSrc = `${import.meta.env.BASE_URL}logo.png` }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTip, setActiveTip] = useState(null);
  const [settings, setSettings] = useState(getInitialSettings);
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);
  const rafRef = useRef(null);
  const itemsRef = useRef([]);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const current = items[index];
  const imageCount = items.filter((item) => item.kind === "image").length;
  const videoCount = items.length - imageCount;
  const canUseDirectoryPicker = typeof window.showDirectoryPicker === "function";

  useWakeLock(isPlaying);

  const orderedItems = useCallback(
    (nextItems) => {
      if (settings.order === "shuffle") return shuffleItems(nextItems);
      if (settings.order === "newest") return [...nextItems].sort((a, b) => b.file.lastModified - a.file.lastModified);
      return [...nextItems].sort(naturalSort);
    },
    [settings.order],
  );

  const loadItems = useCallback(
    (nextItems) => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
      const sorted = orderedItems(nextItems);
      setItems(sorted);
      setIndex(0);
      setProgress(0);
      setIsPlaying(sorted.length > 0);
      setShowSettings(false);
    },
    [orderedItems],
  );

  const loadFromPicker = async () => {
    if (IS_ANDROID) {
      fileInputRef.current?.click();
      return;
    }

    if (!canUseDirectoryPicker) {
      folderInputRef.current?.click();
      return;
    }

    try {
      const handle = await window.showDirectoryPicker({ mode: "read" });
      loadItems(await walkDirectory(handle));
    } catch (error) {
      if (error.name !== "AbortError") folderInputRef.current?.click();
    }
  };

  const loadFromInput = (event) => {
    const files = Array.from(event.target.files || []);
    const nextItems = files.filter(isMediaFile).map((file) => ({
      file,
      path: file.webkitRelativePath || file.name,
      kind: getKind(file),
      url: URL.createObjectURL(file),
    }));
    loadItems(nextItems);
    event.target.value = "";
  };

  const goTo = useCallback(
    (nextIndex) => {
      if (items.length === 0) return;
      if (nextIndex >= items.length) {
        if (settings.loop) {
          setItems((currentItems) => reshuffleForRestart(currentItems));
          setIndex(0);
        } else {
          setIndex(items.length - 1);
          setIsPlaying(false);
        }
        return;
      }
      if (nextIndex < 0) {
        setIndex(settings.loop ? items.length - 1 : 0);
        return;
      }
      setIndex(nextIndex);
    },
    [items.length, settings.loop],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);
  const stopSlideshow = useCallback(() => {
    if (!window.confirm("Vuoi fermare lo slideshow e tornare alla home? La cartella caricata verrà rimossa dall'app.")) {
      return;
    }

    setIsPlaying(false);
    setIndex(0);
    setProgress(0);
    setShowSettings(false);
    setActiveTip(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    itemsRef.current = [];
    setItems([]);
  }, []);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage failures, for example private browsing quota restrictions.
    }
  }, [settings]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const isReloadShortcut = event.key === "F5" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "r");
      if (itemsRef.current.length > 0 && isReloadShortcut) {
        event.preventDefault();
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((value) => !value);
      }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "f") toggleFullscreen();
      if (event.key === "Escape") {
        setActiveTip(null);
        setShowSettings(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, toggleFullscreen]);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (IS_DESKTOP_APP) return;
      if (itemsRef.current.length === 0) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    startedAtRef.current = performance.now();

    if (!isPlaying || !current) return undefined;

    const isTimedVideo = current.kind === "video" && settings.videoMode === "timed";
    const duration = current.kind === "image" ? settings.imageSeconds : isTimedVideo ? settings.videoSeconds : null;

    if (duration) {
      const durationMs = duration * 1000;
      const tick = (now) => {
        setProgress(Math.min(1, (now - startedAtRef.current) / durationMs));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      timerRef.current = window.setTimeout(next, durationMs);
    }

    return () => {
      window.clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [current, isPlaying, next, settings.imageSeconds, settings.videoMode, settings.videoSeconds]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [current, isPlaying]);

  useEffect(() => {
    // Nell'hub tutte le utility condividono lo stesso origin. Registrare il
    // worker standalone qui farebbe quindi cache anche delle altre app.
    if (window.__reactUtilityHubIntegrated || !("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => () => {
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  const status = useMemo(() => {
    if (!items.length) return "Nessun media caricato";
    return `${index + 1} / ${items.length} · ${imageCount} foto · ${videoCount} video`;
  }, [imageCount, index, items.length, videoCount]);

  const updateSetting = (key, value) => setSettings((currentSettings) => ({ ...currentSettings, [key]: value }));
  const renderInfo = (key) => (
    <span className="infoWrap">
      <button
        type="button"
        className="infoButton"
        aria-label={`Info ${key}`}
        aria-expanded={activeTip === key}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setActiveTip((currentTip) => (currentTip === key ? null : key));
        }}
      >
        <CircleHelp size={15} />
      </button>
      {activeTip === key && <span className="tooltip">{SETTING_HELP[key]}</span>}
    </span>
  );

  const reshuffle = useCallback(() => {
    setItems((currentItems) => {
      return reshuffleForRestart(currentItems);
    });
    setIndex(0);
    setProgress(0);
    setIsPlaying(items.length > 0);
  }, [items.length]);

  return (
    <main className="app">
      <section className="stage" aria-label="Slideshow">
        {current ? (
          <div key={current.url} className="mediaWrap" style={{ "--transition": `${settings.transitionMs}ms` }}>
            {current.kind === "image" ? (
              <img className="media" src={current.url} alt={current.path} draggable="false" />
            ) : (
              <video
                ref={videoRef}
                className="media"
                src={current.url}
                muted={settings.muted}
                playsInline
                controls={!isPlaying}
                onEnded={() => {
                  if (settings.videoMode === "full") next();
                }}
              />
            )}
          </div>
        ) : (
          <div className="emptyState">
            <img className="appLogo" src={logoSrc} alt="Slideshower" draggable="false" />
            <h1>Slideshower</h1>
            <p>Apri una cartella locale e riproduci foto e video, incluse le sottocartelle.</p>
            <button className="primaryAction" onClick={loadFromPicker}>
              <FolderOpen size={20} />
              Scegli cartella
            </button>
          </div>
        )}

        {current && settings.captions && (
          <div className="caption">
            <span>{current.path}</span>
            <span>{current.kind === "video" ? "Video" : "Foto"}</span>
          </div>
        )}

        <div className="progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </section>

      {showSettings && <button className="panelBackdrop" onClick={() => setShowSettings(false)} aria-label="Chiudi menu" />}

      <aside className={`panel ${showSettings ? "open" : ""}`}>
        <header className="panelHeader">
          <div>
            <strong>Controlli</strong>
            <span>{status}</span>
          </div>
          <button className="iconButton" onClick={() => setShowSettings(false)} title="Chiudi menu">
            <X size={20} />
          </button>
        </header>

        <div className="actions">
          <button onClick={loadFromPicker}>
            <FolderOpen size={18} />
            Cartella
          </button>
          <button onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={18} />
            File
          </button>
        </div>

        <div className="settingsGrid">
          <label>
            <span>
              <TimerReset size={16} />
              Foto
              {renderInfo("imageSeconds")}
            </span>
            <input
              type="number"
              min="1"
              max="3600"
              value={settings.imageSeconds}
              onChange={(event) => updateSetting("imageSeconds", Number(event.target.value))}
            />
            <small>{formatTime(settings.imageSeconds)}</small>
          </label>

          <label>
            <span>
              <Video size={16} />
              Video
              {renderInfo("videoMode")}
            </span>
            <select value={settings.videoMode} onChange={(event) => updateSetting("videoMode", event.target.value)}>
              <option value="full">Durata completa</option>
              <option value="timed">Tempo fisso</option>
            </select>
          </label>

          <label className={settings.videoMode === "full" ? "disabled" : ""}>
            <span>
              <SkipForward size={16} />
              Secondi video
              {renderInfo("videoSeconds")}
            </span>
            <input
              type="number"
              min="1"
              max="3600"
              disabled={settings.videoMode === "full"}
              value={settings.videoSeconds}
              onChange={(event) => updateSetting("videoSeconds", Number(event.target.value))}
            />
            <small>{formatTime(settings.videoSeconds)}</small>
          </label>

          <label>
            <span>
              <RefreshCw size={16} />
              Transizione
              {renderInfo("transitionMs")}
            </span>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={settings.transitionMs}
              onChange={(event) => updateSetting("transitionMs", Number(event.target.value))}
            />
            <small>{settings.transitionMs} ms</small>
          </label>

          <label>
            <span>
              <Shuffle size={16} />
              Ordine
              {renderInfo("order")}
            </span>
            <select value={settings.order} onChange={(event) => updateSetting("order", event.target.value)}>
              <option value="name">Nome</option>
              <option value="newest">Più recenti</option>
              <option value="shuffle">Casuale</option>
            </select>
          </label>
        </div>

        <div className="toggles">
          <label>
            <input type="checkbox" checked={settings.loop} onChange={(event) => updateSetting("loop", event.target.checked)} />
            Ripeti alla fine
            {renderInfo("loop")}
          </label>
          <label>
            <input type="checkbox" checked={settings.muted} onChange={(event) => updateSetting("muted", event.target.checked)} />
            Video muti
            {renderInfo("muted")}
          </label>
          <label>
            <input type="checkbox" checked={settings.captions} onChange={(event) => updateSetting("captions", event.target.checked)} />
            Nome file
            {renderInfo("captions")}
          </label>
        </div>

        <div className="actions">
          <button onClick={reshuffle} disabled={!items.length}>
            <Shuffle size={18} />
            Mischia
          </button>
          <button onClick={() => setIndex(0)} disabled={!items.length}>
            <ListRestart size={18} />
            Riparti
          </button>
        </div>

        <footer className="compat">
          <span>
            <MonitorPlay size={15} />
            PC: cartelle ricorsive
          </span>
          <span>
            <Smartphone size={15} />
            Smartphone: file/media supportati dal browser
          </span>
        </footer>
      </aside>

      <button className={`menuButton ${showSettings ? "hidden" : ""}`} onClick={() => setShowSettings(true)} title="Apri controlli">
        <SlidersHorizontal size={22} />
      </button>

      <div className="playbackDock" aria-label="Controlli slideshow">
        <button className="dockButton" onClick={previous} disabled={!items.length} title="Precedente">
          <ChevronLeft size={22} />
        </button>
        <button className="dockButton primaryDockButton" onClick={() => setIsPlaying((value) => !value)} disabled={!items.length} title={isPlaying ? "Pausa" : "Play"}>
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button className="dockButton" onClick={stopSlideshow} disabled={!items.length} title="Stop">
          <Square size={18} fill="currentColor" />
        </button>
        <button className="dockButton" onClick={next} disabled={!items.length} title="Successivo">
          <ChevronRight size={22} />
        </button>
        <button className="dockButton" onClick={toggleFullscreen} title={isFullscreen ? "Esci da schermo intero" : "Schermo intero"}>
          {isFullscreen ? <Shrink size={22} /> : <Expand size={22} />}
        </button>
      </div>

      <input
        ref={folderInputRef}
        className="hiddenInput"
        type="file"
        accept="image/*,video/*"
        multiple
        webkitdirectory="true"
        onChange={loadFromInput}
      />
      <input
        ref={fileInputRef}
        className="hiddenInput"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={loadFromInput}
      />
    </main>
  );
}

if (typeof window !== "undefined" && !window.__reactUtilityHubIntegrated) {
  createRoot(document.getElementById("root")).render(<App />);
}
