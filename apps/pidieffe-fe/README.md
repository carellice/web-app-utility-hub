<p align="center">
  <img src="public/logo.png" alt="PIDIEFFE" width="120" />
</p>

<h1 align="center">PIDIEFFE</h1>

<p align="center">
  Manipola i tuoi PDF direttamente nel browser, senza server.
</p>

<p align="center">
  <a href="https://pidieffe.netlify.app">
    <img src="https://img.shields.io/badge/Apri_PIDIEFFE-E8553D?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="Apri PIDIEFFE" />
  </a>
</p>

---

## Cos'è PIDIEFFE?

PIDIEFFE è un'applicazione web open source per manipolare file PDF interamente lato client. Nessun dato viene inviato a server esterni: tutto rimane nel tuo browser.

### Funzionalità principali

- **Upload PDF** — Trascina o seleziona un file PDF per iniziare
- **Griglia pagine** — Visualizza tutte le pagine in una griglia con drag & drop per riordinarle
- **Editor pagina** — Clicca su una pagina per aprire l'editor con gli strumenti di annotazione
- **Annotazioni testo** — Aggiungi testo libero con font, dimensione e colore personalizzabili
- **Annotazioni immagine** — Inserisci immagini (firme, loghi, timbri) sulle pagine
- **Timbri salvati** — Salva immagini in locale per riutilizzarle velocemente senza ricaricarle ogni volta
- **Rotazione pagine** — Ruota le singole pagine a 90°, 180°, 270°
- **Eliminazione pagine** — Rimuovi le pagine che non servono
- **Copia/Incolla annotazioni** — Ctrl/Cmd+C e Ctrl/Cmd+V per duplicare annotazioni
- **Esportazione PDF** — Scarica il PDF modificato con tutte le annotazioni incorporate
- **PWA** — Installabile come app nativa su desktop e mobile, funziona anche offline

## Tech Stack

- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) 4
- [pdf-lib](https://pdf-lib.js.org) — generazione e modifica PDF
- [react-pdf](https://github.com/wojtekmaj/react-pdf) — rendering pagine PDF
- [@dnd-kit](https://dndkit.com) — drag & drop per il riordino pagine
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) — supporto Progressive Web App

## Getting Started

### Prerequisiti

- [Node.js](https://nodejs.org) >= 18
- npm (incluso con Node.js)

### Installazione

```bash
git clone https://github.com/user/pidieffe-fe.git
cd pidieffe-fe
npm install
```

### Sviluppo

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

### Build di produzione

```bash
npm run build
```

I file compilati saranno nella cartella `dist/`.

### Anteprima build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Struttura del progetto

```
src/
├── components/
│   ├── common/        # Componenti riutilizzabili (Button, Modal, IconButton, ...)
│   ├── editor/        # Editor pagina (AnnotationLayer, ToolPanel, ImageAnnotation, ...)
│   ├── grid/          # Griglia pagine (PageGrid, PageThumbnail, ...)
│   ├── layout/        # Layout generale (Header, MainLayout)
│   └── upload/        # Zona di upload (UploadZone)
├── constants/         # Costanti dell'app
├── context/           # React Context (DocumentContext, UiContext)
├── hooks/             # Custom hooks (usePdfLoader, useExportPdf, useSavedImages, ...)
├── lib/               # Utility (fileUtils, ...)
└── types/             # Tipi TypeScript
```

## Privacy

PIDIEFFE non invia alcun dato a server esterni. I file PDF vengono elaborati interamente nel browser tramite le Web API. Le immagini salvate come timbri vengono memorizzate nel `localStorage` del browser e non lasciano mai il tuo dispositivo.

## Licenza

MIT

## Contribuire

Le pull request sono benvenute! Per modifiche importanti, apri prima una issue per discutere cosa vorresti cambiare.

1. Forka il repository
2. Crea il tuo branch (`git checkout -b feature/la-mia-feature`)
3. Committa le modifiche (`git commit -m 'Aggiungi la mia feature'`)
4. Pusha il branch (`git push origin feature/la-mia-feature`)
5. Apri una Pull Request
