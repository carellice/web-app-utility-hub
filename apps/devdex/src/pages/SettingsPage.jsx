import { useRef, useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  Database as DbIcon,
  CheckCircle2,
  AlertTriangle,
  Languages
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { LANG_LABELS } from '../data/translations.js';
import { CATEGORIES, GROUPS, getTotalEntries } from '../data/catalog.js';

const TOTAL_LEVELS = CATEGORIES.reduce(
  (s, c) => s + c.topics.reduce((ts, t) => ts + t.levels.length, 0),
  0
);

function formatBytes(n) {
  if (!n) return '0 B';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function estimateLocalStorageUsage() {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    const v = window.localStorage.getItem(k) || '';
    total += k.length + v.length;
  }
  // localStorage memorizza in UTF-16 → 2 byte per char
  return total * 2;
}

export default function SettingsPage() {
  const { mode, setMode, effective } = useTheme();
  const { prefs, setPref } = usePreferences();
  const { state, reset, exportData, importData } = useProgress();
  const { lang, setLang, supported, t } = useLanguage();
  const fileRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [working, setWorking] = useState(false);

  function notify(kind, message) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 3500);
  }

  /* ----- export ----- */
  function handleExport() {
    try {
      const payload = exportData();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `devdex-progress-${date}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify('ok', t('settings.toast.exported'));
    } catch (e) {
      notify('err', t('settings.toast.exportFailed', { error: e.message }));
    }
  }

  /* ----- import ----- */
  function handleImportClick() {
    fileRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target.result));
        importData(parsed);
        notify('ok', t('settings.toast.imported'));
      } catch (err) {
        notify('err', t('settings.toast.importFailed', { error: err.message }));
      } finally {
        e.target.value = '';
      }
    };
    reader.onerror = () => notify('err', t('settings.toast.fileReadError'));
    reader.readAsText(file);
  }

  /* ----- reset ----- */
  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    reset();
    setConfirmReset(false);
    notify('ok', t('settings.toast.reset'));
  }

  /* ----- cache PWA ----- */
  async function handleClearCache() {
    setWorking(true);
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      notify('ok', t('settings.toast.cacheCleared'));
    } catch (e) {
      notify('err', t('settings.toast.cacheFailed', { error: e.message }));
    } finally {
      setWorking(false);
    }
  }

  /* ----- metriche progresso ----- */
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const quizCount = Object.keys(state.quizScores).length;
  const storageBytes = estimateLocalStorageUsage();
  const effectiveLabel =
    effective === 'dark'
      ? t('settings.theme.effective.dark')
      : t('settings.theme.effective.light');

  return (
    <>
      <h1 className="page-title" style={{ marginTop: 0 }}>
        <Settings size={26} aria-hidden /> {t('settings.title')}
      </h1>
      <p className="muted" style={{ marginTop: -6 }}>
        {t('settings.lead')}
      </p>

      {toast && (
        <div className={`settings-toast settings-toast--${toast.kind}`}>
          {toast.kind === 'ok' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ===== Aspetto ===== */}
      <section className="settings-card">
        <header className="settings-card__head">
          <h2>{t('settings.appearance.title')}</h2>
          <p>{t('settings.appearance.lead')}</p>
        </header>
        <div className="settings-card__body">
          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.theme.label')}</span>
              <span className="muted">
                {t('settings.theme.activeNow')}{' '}
                <strong>{effectiveLabel}</strong>
              </span>
            </div>
            <div
              className="segmented"
              role="radiogroup"
              aria-label={t('settings.theme.aria')}
            >
              <button
                type="button"
                className={`segmented__btn ${mode === 'auto' ? 'segmented__btn--active' : ''}`}
                onClick={() => setMode('auto')}
                role="radio"
                aria-checked={mode === 'auto'}
              >
                <Monitor size={14} /> {t('settings.theme.auto')}
              </button>
              <button
                type="button"
                className={`segmented__btn ${mode === 'light' ? 'segmented__btn--active' : ''}`}
                onClick={() => setMode('light')}
                role="radio"
                aria-checked={mode === 'light'}
              >
                <Sun size={14} /> {t('settings.theme.light')}
              </button>
              <button
                type="button"
                className={`segmented__btn ${mode === 'dark' ? 'segmented__btn--active' : ''}`}
                onClick={() => setMode('dark')}
                role="radio"
                aria-checked={mode === 'dark'}
              >
                <Moon size={14} /> {t('settings.theme.dark')}
              </button>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.reduceMotion.label')}</span>
              <span className="muted">
                {t('settings.reduceMotion.lead')}
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={prefs.reduceMotion}
                onChange={(e) => setPref('reduceMotion', e.target.checked)}
              />
              <span className="switch__track">
                <span className="switch__thumb" />
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* ===== Lingua ===== */}
      <section className="settings-card">
        <header className="settings-card__head">
          <h2>{t('settings.language.title')}</h2>
          <p>{t('settings.language.lead')}</p>
        </header>
        <div className="settings-card__body">
          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.language.label')}</span>
            </div>
            <div
              className="segmented"
              role="radiogroup"
              aria-label={t('settings.language.aria')}
            >
              {supported.map((code) => {
                const meta = LANG_LABELS[code];
                const active = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    className={`segmented__btn ${active ? 'segmented__btn--active' : ''}`}
                    onClick={() => setLang(code)}
                    role="radio"
                    aria-checked={active}
                  >
                    <Languages size={14} /> {meta?.native || code.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Dati & Progressi ===== */}
      <section className="settings-card">
        <header className="settings-card__head">
          <h2>{t('settings.data.title')}</h2>
          <p>{t('settings.data.lead')}</p>
        </header>
        <div className="settings-card__body">
          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.data.export.label')}</span>
              <span className="muted">{t('settings.data.export.lead')}</span>
            </div>
            <button className="btn btn--ghost" onClick={handleExport}>
              <Download size={16} /> {t('settings.data.export.cta')}
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.data.import.label')}</span>
              <span className="muted">{t('settings.data.import.lead')}</span>
            </div>
            <button className="btn btn--ghost" onClick={handleImportClick}>
              <Upload size={16} /> {t('settings.data.import.cta')}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleFile}
            />
          </div>

          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.data.reset.label')}</span>
              <span className="muted">{t('settings.data.reset.lead')}</span>
            </div>
            <button
              className={`btn ${confirmReset ? 'btn--primary btn--danger-active' : 'btn--ghost btn--danger'}`}
              onClick={handleReset}
            >
              <Trash2 size={16} />{' '}
              {confirmReset
                ? t('settings.data.reset.confirmCta')
                : t('settings.data.reset.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* ===== Cache PWA ===== */}
      <section className="settings-card">
        <header className="settings-card__head">
          <h2>{t('settings.cache.title')}</h2>
          <p>{t('settings.cache.lead')}</p>
        </header>
        <div className="settings-card__body">
          <div className="setting-row">
            <div className="setting-row__label">
              <span>{t('settings.cache.clear.label')}</span>
              <span className="muted">{t('settings.cache.clear.lead')}</span>
            </div>
            <button
              className="btn btn--ghost"
              onClick={handleClearCache}
              disabled={working}
            >
              <RefreshCw size={16} className={working ? 'spin' : ''} />{' '}
              {t('settings.cache.clear.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* ===== Info ===== */}
      <section className="settings-card">
        <header className="settings-card__head">
          <h2>{t('settings.info.title')}</h2>
          <p>{t('settings.info.lead')}</p>
        </header>
        <div className="settings-card__body">
          <dl className="info-grid">
            <div>
              <dt><Sparkles size={13} /> {t('settings.info.areas')}</dt>
              <dd>{GROUPS.length}</dd>
            </div>
            <div>
              <dt><DbIcon size={13} /> {t('settings.info.topics')}</dt>
              <dd>{getTotalEntries()}</dd>
            </div>
            <div>
              <dt><DbIcon size={13} /> {t('settings.info.totalLevels')}</dt>
              <dd>{TOTAL_LEVELS}</dd>
            </div>
            <div>
              <dt><CheckCircle2 size={13} /> {t('settings.info.completed')}</dt>
              <dd>{completedCount} / {TOTAL_LEVELS}</dd>
            </div>
            <div>
              <dt><Info size={13} /> {t('settings.info.quizCount')}</dt>
              <dd>{quizCount}</dd>
            </div>
            <div>
              <dt><DbIcon size={13} /> {t('settings.info.storage')}</dt>
              <dd>{formatBytes(storageBytes)}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
