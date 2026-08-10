<p align="center">
  <img src="public/favicon.svg" width="132" alt="Logo Web App Utility Hub">
</p>

<h1 align="center">Web App Utility Hub</h1>

<p align="center"><strong>Una dashboard, sette strumenti web.</strong><br>
Apri le tue utility preferite senza avviare un server per ognuna.</p>

---

## Cos'è

Web App Utility Hub è la casa delle tue utility web locali. Ogni strumento è integrato come schermata interna dell'hub, con la propria identità visiva e senza interrompere il tuo flusso di lavoro.

L'hub usa un solo server locale e ripulisce automaticamente worker e cache obsolete all'apertura. Questo evita i problemi delle vecchie sessioni e assicura che ogni utility carichi la versione corrente.

## Le app incluse

| App | Per cosa usarla |
| --- | --- |
| **Easy Crypt** | Cifrare e decifrare testi con una password, direttamente nel browser. |
| **Estrai audio da video** | Estrarre la traccia audio dai video senza inviare file a un server. |
| **PIDIEFFE** | Riordinare, annotare e modificare PDF mantenendo i file sul dispositivo. |
| **Scrubb** | Riconoscere e oscurare dati sensibili in testi, log e snippet di codice. |
| **Slideshower** | Creare slideshow locali di foto e video, anche a schermo intero. |
| **DevDex** | Studiare concetti di sviluppo con quiz e flashcard locali. |
| **MutuoStep** | Pianificare l'acquisto della prima casa con budget, roadmap e checklist. |

## Per iniziare

Su macOS fai doppio clic su `Avvia Web App Utility Hub.command`.

Su Windows fai doppio clic su `Avvia Web App Utility Hub.bat`.

L'hub prepara le dipendenze mancanti e si apre automaticamente su `http://127.0.0.1:5173`. Da lì basta scegliere una scheda per entrare nell'app desiderata.

In alternativa, dal terminale nella cartella del progetto:

```bash
npm run dev
```

Per creare una build pronta alla distribuzione:

```bash
npm run build
```

## Privacy e semplicità

- Un solo server locale per tutte le utility.
- File e dati restano sul tuo computer o nel browser.
- Le app sono caricate solo quando le apri, per mantenere l'hub reattivo.

---

Creato con il ❤️ da F.C.
