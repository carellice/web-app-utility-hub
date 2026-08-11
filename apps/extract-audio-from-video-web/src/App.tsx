import { useMemo, useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import type { FFFSType } from '@ffmpeg/ffmpeg';
import ffmpegCoreUrl from './vendor/ffmpeg-core/ffmpeg-core.js?url';
import ffmpegWasmUrl from './vendor/ffmpeg-core/ffmpeg-core.wasm?url';

type AudioFormat = 'mp3' | 'm4a' | 'wav' | 'ogg';
type Status = 'idle' | 'loading' | 'ready' | 'working' | 'done' | 'error';

const formats: Record<
  AudioFormat,
  { label: string; extension: AudioFormat; mime: string; args: string[] }
> = {
  mp3: {
    label: 'MP3 compatibile',
    extension: 'mp3',
    mime: 'audio/mpeg',
    args: ['-vn', '-map', '0:a:0', '-c:a', 'libmp3lame', '-b:a', '192k'],
  },
  m4a: {
    label: 'M4A leggero',
    extension: 'm4a',
    mime: 'audio/mp4',
    args: ['-vn', '-map', '0:a:0', '-c:a', 'aac', '-b:a', '192k'],
  },
  wav: {
    label: 'WAV senza perdita',
    extension: 'wav',
    mime: 'audio/wav',
    args: ['-vn', '-map', '0:a:0', '-c:a', 'pcm_s16le'],
  },
  ogg: {
    label: 'OGG Vorbis',
    extension: 'ogg',
    mime: 'audio/ogg',
    args: ['-vn', '-map', '0:a:0', '-c:a', 'libvorbis', '-q:a', '5'],
  },
};

const acceptedVideoTypes = [
  '.mp4',
  '.mkv',
  '.mov',
  '.avi',
  '.webm',
  '.m4v',
  'video/mp4',
  'video/x-matroska',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-m4v',
];

function readableFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function safeBaseName(name: string) {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'audio';
}

function fileToBlobPart(data: Awaited<ReturnType<FFmpeg['readFile']>>) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export default function App({ logoSrc = '/logo.png' }: { logoSrc?: string }) {
  const ffmpegRef = useRef(new FFmpeg());
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<AudioFormat>('mp3');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('');
  const [message, setMessage] = useState('Scegli un video per iniziare.');
  const [logLines, setLogLines] = useState<string[]>([]);

  const canExtract = file && status !== 'loading' && status !== 'working';
  const selectedFormat = formats[format];
  const isLargeFile = file ? file.size > 350 * 1024 * 1024 : false;

  const inputSummary = useMemo(() => {
    if (!file) return null;
    return `${file.name} · ${readableFileSize(file.size)}`;
  }, [file]);

  async function ensureFfmpegLoaded() {
    const ffmpeg = ffmpegRef.current;
    if (ffmpeg.loaded) return;

    setMessage('Carico FFmpeg nel browser...');

    ffmpeg.on('progress', ({ progress: nextProgress }) => {
      if (Number.isFinite(nextProgress)) {
        setProgress(Math.min(99, Math.max(0, Math.round(nextProgress * 100))));
      }
    });

    ffmpeg.on('log', ({ message: nextLine }) => {
      setLogLines((current) => [...current.slice(-5), nextLine]);
    });

    await ffmpeg.load({
      coreURL: ffmpegCoreUrl,
      wasmURL: ffmpegWasmUrl,
    });
  }

  function handleFileChange(nextFile: File | null) {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setDownloadName('');
    setProgress(0);
    setLogLines([]);
    setFile(nextFile);
    setStatus(nextFile ? 'ready' : 'idle');
    setMessage(nextFile ? 'Video selezionato. Puoi estrarre l’audio.' : 'Scegli un video per iniziare.');
  }

  async function extractAudio() {
    if (!file) return;

    try {
      setStatus('working');
      setProgress(0);
      setLogLines([]);
      setMessage(ffmpegRef.current.loaded ? 'Estraggo la traccia audio...' : 'Carico FFmpeg nel browser...');

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);

      if (!ffmpegRef.current.loaded) {
        setStatus('loading');
      }
      await ensureFfmpegLoaded();
      setStatus('working');
      setMessage('Estraggo la traccia audio...');

      const mountPoint = `/input-${Date.now()}`;
      const inputPath = `${mountPoint}/${file.name}`;
      const outputName = `${safeBaseName(file.name)}.${selectedFormat.extension}`;
      const ffmpeg = ffmpegRef.current;
      let inputMounted = false;

      try {
        await ffmpeg.createDir(mountPoint);
        await ffmpeg.mount('WORKERFS' as FFFSType, { files: [file] }, mountPoint);
        inputMounted = true;

        const exitCode = await ffmpeg.exec([
          '-i',
          inputPath,
          ...selectedFormat.args,
          outputName,
        ]);

        if (exitCode !== 0) {
          throw new Error('FFmpeg non è riuscito a estrarre l’audio. Controlla i dettagli tecnici.');
        }

        const data = fileToBlobPart(await ffmpeg.readFile(outputName));
        const blob = new Blob([data], { type: selectedFormat.mime });
        const nextUrl = URL.createObjectURL(blob);

        setDownloadUrl(nextUrl);
        setDownloadName(outputName);
        setProgress(100);
        setStatus('done');
        setMessage('Audio pronto per il download.');
      } finally {
        if (inputMounted) {
          await ffmpeg.unmount(mountPoint).catch(() => undefined);
        }

        await Promise.allSettled([
          ffmpeg.deleteDir(mountPoint),
          ffmpeg.deleteFile(outputName),
        ]);
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Non sono riuscito a estrarre l’audio da questo file.',
      );
    }
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <div className="intro">
          <img className="app-logo" src={logoSrc} alt="Logo Estrai audio da video" />
          <p className="eyebrow">Locale e statico</p>
          <h1>Estrai audio da video</h1>
          <p>
            Carica un video MP4, MKV, MOV, AVI o WebM e scarica solo la traccia audio. Il file
            resta nel browser: non viene inviato a un server.
          </p>
        </div>

        <label className="drop-zone">
          <input
            type="file"
            accept={acceptedVideoTypes.join(',')}
            onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          />
          <span className="drop-title">{inputSummary ?? 'Seleziona un video'}</span>
          <span className="drop-subtitle">
            {file ? 'Puoi cambiarlo scegliendo un altro file.' : 'MP4, MKV, MOV, AVI o WebM'}
          </span>
        </label>

        {isLargeFile && (
          <p className="notice">
            File grande: verrà letto a blocchi senza caricarlo interamente in memoria. Per ridurre
            tempo e memoria, preferisci MP3 o M4A.
          </p>
        )}

        <div className="controls">
          <label>
            Formato audio
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as AudioFormat)}
              disabled={status === 'loading' || status === 'working'}
            >
              {Object.entries(formats).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button type="button" onClick={extractAudio} disabled={!canExtract}>
            {status === 'loading'
              ? 'Caricamento...'
              : status === 'working'
                ? 'Estrazione...'
                : 'Estrai audio'}
          </button>
        </div>

        {(status === 'loading' || status === 'working' || status === 'done') && (
          <div className="progress-wrap" aria-label="Avanzamento">
            <div className="progress-bar">
              <span style={{ width: `${progress}%` }} />
            </div>
            <strong>{progress}%</strong>
          </div>
        )}

        <p className={`status status-${status}`}>{message}</p>

        {downloadUrl && (
          <a className="download-button" href={downloadUrl} download={downloadName}>
            Scarica {downloadName}
          </a>
        )}

        {logLines.length > 0 && (
          <details className="logs">
            <summary>Dettagli tecnici</summary>
            <pre>{logLines.join('\n')}</pre>
          </details>
        )}
      </section>
      <footer className="page-footer">
        Creato con il ❤️ da{' '}
        <a href="https://flavioceccarelli.org" target="_blank" rel="noreferrer">
          F.C.
        </a>
      </footer>
    </main>
  );
}
