<p align="center">
  <img src="public/logo.png" alt="Logo Estrai audio da video" width="96" height="96" />
</p>

# Estrai audio da video

Applicazione web statica per estrarre l'audio da video MP4, MKV, MOV, AVI e WebM direttamente nel browser.

## Uso locale

```bash
npm install
npm run dev
```

Poi apri l'URL mostrato da Vite.

## Build per Netlify

```bash
npm run build
```

Su Netlify:

- build command: `npm run build`
- publish directory: `dist`

Il progetto include `netlify.toml`, quindi Netlify dovrebbe rilevare questi valori automaticamente.
L'HTML non viene conservato nella cache del browser, mentre gli asset generati da Vite usano nomi
versionati tramite hash e possono essere memorizzati a lungo in sicurezza.

## Note

- L'elaborazione avviene nel browser con FFmpeg WebAssembly.
- Nessun file viene caricato su un server.
- I video vengono letti direttamente dal file locale, senza essere caricati interamente in memoria.
- File video molto grandi possono comunque richiedere più tempo; per questi file sono consigliati MP3 o M4A.
- Il formato MP3 è il default perché è il più comodo da riprodurre e condividere.
