<p align="center">
  <img src="./public/logo.png" alt="Slideshower logo" width="140" />
</p>

<h1 align="center">Slideshower</h1>

<p align="center">
  A local-first slideshow app for photos and videos.
</p>

<p align="center">
  <a href="#italiano">Italiano</a> · <a href="#english">English</a>
</p>

---

## Italiano

Slideshower è un'app local-first per creare slideshow di foto e video partendo da una cartella locale. Selezioni una cartella, incluse eventuali sottocartelle, e l'app riproduce tutti i media supportati in un viewer pulito, personalizzabile e adatto allo schermo intero.

Nasce come PWA, ma può essere pacchettizzata anche come app desktop e Android.

### Funzionalità

- Slideshow da cartella locale con foto e video
- Scansione ricorsiva delle sottocartelle
- Gestione local-first: i file non vengono caricati online
- Foto e video mostrati sempre interamente, senza crop
- Durata foto, modalità video, transizione, ordine, loop, mute e nome file personalizzabili
- Mischia manuale e rimescolamento automatico quando lo slideshow ricomincia
- Dock con precedente, play/pausa, stop, successivo e schermo intero
- Impostazioni salvate in `localStorage`
- PWA installabile
- Packaging desktop con Electron
- Packaging Android con Capacitor

### Download

Le versioni installabili per Android, Windows e macOS saranno disponibili nella pagina GitHub Releases:

[Scarica da GitHub Releases](../../releases)

Puoi anche usare la versione web senza installare nulla:

[Apri Slideshower Web](https://slideshowerweb.netlify.app)

### Installazione

#### macOS

1. Scarica il file `.dmg` dalla pagina GitHub Releases.
2. Apri il DMG.
3. Trascina `Slideshower.app` nella cartella `Applications`.
4. Apri l'app da `Applications`.

Le build macOS pubblicate in questo repository possono essere non firmate e non notarizzate da Apple. Se macOS mostra un messaggio come "`Slideshower` è danneggiata e non può essere aperta", di solito il file non è realmente danneggiato: è Gatekeeper che blocca un'app scaricata da Internet perché non è firmata/notarizzata.

Per provare l'app su un Mac personale, puoi rimuovere manualmente l'attributo di quarantena dopo aver copiato l'app in `Applications`:

```bash
xattr -dr com.apple.quarantine /Applications/Slideshower.app
```

Usa questo comando solo se ti fidi della build che hai scaricato. Per una distribuzione pubblica senza avvisi di sicurezza serve una build firmata con Apple Developer ID e notarizzata da Apple.

#### Windows

1. Scarica il file `.exe` dalla pagina GitHub Releases.
2. Avvia l'installer.
3. Segui la procedura guidata e scegli la cartella di installazione, se richiesto.
4. Apri Slideshower dal menu Start o dal collegamento sul desktop.

Se Windows SmartScreen mostra un avviso, significa che l'installer non ha ancora una reputazione consolidata o non è firmato con un certificato riconosciuto. Procedi solo se ti fidi della release.

#### Android

1. Scarica il file `.apk` dalla pagina GitHub Releases.
2. Aprilo sul dispositivo Android.
3. Se richiesto, abilita l'installazione da sorgenti sconosciute per l'app con cui hai aperto l'APK.
4. Completa l'installazione e apri Slideshower.

L'APK generato da questo progetto è pensato per test manuali. Per una distribuzione pubblica è consigliato creare una release firmata e distribuirla tramite Play Store o un canale Android affidabile.

### Privacy

Slideshower legge i file locali tramite il browser o il runtime dell'app pacchettizzata.

I media non vengono caricati su server, copiati dentro l'app o salvati in `localStorage`. L'app crea URL locali temporanei mentre lo slideshow è attivo e li libera quando premi stop, carichi un'altra cartella o chiudi l'app.

Solo le impostazioni utente vengono salvate localmente.

### Avvio Rapido

Installa le dipendenze:

```bash
npm install
```

Avvia l'app in sviluppo:

```bash
npm run dev
```

Apri:

```text
http://localhost:5173/
```

Build web/PWA:

```bash
npm run build
```

Preview della build:

```bash
npm run preview
```

### Utilizzo

1. Apri l'app.
2. Clicca `Scegli cartella`.
3. Seleziona una cartella con foto e video.
4. Usa la dock in basso a destra per controllare lo slideshow.
5. Apri il pannello controlli con il pulsante in alto a destra.

Su browser desktop, la selezione cartella può includere sottocartelle. Su mobile, l'accesso alle cartelle dipende dal supporto del browser.

### Packaging

Genera il DMG macOS:

```bash
npm run package:mac
```

Genera l'EXE Windows:

```bash
npm run package:win
```

Genera l'APK Android:

```bash
npm run android:init
npm run package:android
```

Pulisci installer e pacchetti generati:

```bash
npm run clean:packages
```

Le istruzioni complete sono in [PACKAGING.md](./PACKAGING.md).

### Script

```text
npm run dev              Avvia il dev server Vite
npm run build            Crea la build web
npm run preview          Mostra la build di produzione
npm run desktop          Avvia l'app Electron localmente
npm run package:mac      Genera un DMG macOS
npm run package:win      Genera un EXE Windows
npm run package:android  Genera un APK debug Android
npm run package:all      Prova tutti i target di packaging
npm run clean:packages   Rimuove DMG/EXE/APK generati
```

### Tech Stack

- React
- Vite
- PWA manifest e service worker
- Electron
- Electron Builder
- Capacitor
- Lucide React icons

---

## English

Slideshower is a local-first slideshow app for photos and videos. Pick a local folder, including nested subfolders, and the app plays every supported media file in a clean, customizable, full-screen friendly viewer.

It started as a PWA, but it can also be packaged as a desktop app and Android app.

### Features

- Folder-based slideshow for photos and videos
- Recursive folder scan, including subfolders
- Local-first media handling: files are not uploaded anywhere
- Photos and videos are always shown fully, without cropping
- Custom photo duration, video mode, transition speed, ordering, loop, mute, and captions
- Manual shuffle and automatic reshuffle when looping
- Playback dock with previous, play/pause, stop, next, and fullscreen
- Settings saved in `localStorage`
- Installable PWA
- Desktop packaging with Electron
- Android packaging with Capacitor

### Download

Installable builds for Android, Windows, and macOS will be available on the GitHub Releases page:

[Download from GitHub Releases](../../releases)

You can also use the web version without installing anything:

[Open Slideshower Web](https://slideshowerweb.netlify.app)

### Installation

#### macOS

1. Download the `.dmg` file from GitHub Releases.
2. Open the DMG.
3. Drag `Slideshower.app` into the `Applications` folder.
4. Open the app from `Applications`.

The macOS builds published in this repository may be unsigned and not notarized by Apple. If macOS says "`Slideshower` is damaged and can't be opened", the file is usually not actually damaged: Gatekeeper is blocking an app downloaded from the Internet because it is not signed/notarized.

To try the app on your own Mac, you can remove the quarantine attribute after copying the app to `Applications`:

```bash
xattr -dr com.apple.quarantine /Applications/Slideshower.app
```

Only use this command if you trust the downloaded build. Public macOS distribution without security warnings requires signing with an Apple Developer ID certificate and Apple notarization.

#### Windows

1. Download the `.exe` file from GitHub Releases.
2. Run the installer.
3. Follow the setup wizard and choose an install folder if prompted.
4. Open Slideshower from the Start menu or desktop shortcut.

If Windows SmartScreen shows a warning, it means the installer does not yet have established reputation or is not signed with a recognized certificate. Continue only if you trust the release.

#### Android

1. Download the `.apk` file from GitHub Releases.
2. Open it on your Android device.
3. If prompted, allow installing unknown apps for the app you used to open the APK.
4. Finish the installation and open Slideshower.

The APK generated by this project is intended for manual testing. For public distribution, create a signed release build and distribute it through the Play Store or another trusted Android channel.

### Privacy

Slideshower reads local files through your browser or packaged app runtime.

Media files are not uploaded to a server, copied into the app, or stored in `localStorage`. The app creates temporary local object URLs while the slideshow is running, then releases them when you stop, load another folder, or close the app.

Only user settings are saved locally.

### Quick Start

Install dependencies:

```bash
npm install
```

Run the app in development:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

Build the web/PWA version:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Usage

1. Open the app.
2. Click `Scegli cartella`.
3. Select a folder containing photos and videos.
4. Use the playback dock in the bottom-right corner.
5. Open the controls panel with the top-right button.

On desktop browsers, folder selection can include subfolders. On mobile browsers, folder access depends on browser support.

### Packaging

macOS DMG:

```bash
npm run package:mac
```

Windows EXE:

```bash
npm run package:win
```

Android APK:

```bash
npm run android:init
npm run package:android
```

Clean generated installers/packages:

```bash
npm run clean:packages
```

Detailed packaging instructions are in [PACKAGING.md](./PACKAGING.md).

### Scripts

```text
npm run dev              Start Vite dev server
npm run build            Build the web app
npm run preview          Preview the production build
npm run desktop          Run the Electron app locally
npm run package:mac      Build a macOS DMG
npm run package:win      Build a Windows EXE
npm run package:android  Build an Android debug APK
npm run package:all      Try all package targets
npm run clean:packages   Remove generated DMG/EXE/APK files
```

### Tech Stack

- React
- Vite
- PWA manifest and service worker
- Electron
- Electron Builder
- Capacitor
- Lucide React icons

## Project Structure

```text
src/                 React app
public/              PWA assets, logo, manifest, service worker
electron/            Electron main/preload files
android/             Capacitor Android project
scripts/             Packaging and cleanup scripts
dist/                Web build output
release/             Desktop installer output
PACKAGING.md         Build and release notes
```

## License

Add your preferred license before publishing the project publicly.
