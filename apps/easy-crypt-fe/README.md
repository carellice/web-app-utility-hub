<p align="center">
  <a href="README.md">Italiano</a> |
  <a href="README.en.md">English</a> |
  <a href="README.fr.md">Fran&ccedil;ais</a> |
  <a href="README.es.md">Espa&ntilde;ol</a> |
  <a href="README.de.md">Deutsch</a>
</p>

<p align="center">
  <img src="public/logo.svg" alt="Easy Crypt" width="120" />
</p>

<h1 align="center">Easy Crypt</h1>

<p align="center">
  Cripta e decripta testo in modo semplice e sicuro, direttamente nel browser.
</p>

<p align="center">
  <a href="https://easycrypt.netlify.app/">
    <img src="https://img.shields.io/badge/Apri%20Easy%20Crypt-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Apri Easy Crypt" />
  </a>
</p>

---

## Cos'è

**Easy Crypt** è una web app leggera e intuitiva per criptare e decriptare testo usando una password. Tutta la crittografia avviene **localmente nel browser** — nessun dato viene mai inviato a server esterni.

## Funzionalità

- **Crittografia AES-GCM 256-bit** con derivazione della chiave tramite PBKDF2
- **Cripta** — inserisci un testo e una password, ottieni il testo cifrato
- **Decripta** — inserisci il testo cifrato e la stessa password, ottieni il testo originale
- **Incolla** — incolla direttamente dagli appunti nel campo di input
- **Copia** — copia il risultato negli appunti con un click
- **Installabile come PWA** — usala come un'app nativa su mobile e desktop
- **Funziona offline** — non serve connessione internet

## Come si usa

1. Scrivi o incolla il testo nel campo di input
2. Inserisci una password
3. Premi **Cripta** per ottenere il testo cifrato, oppure **Decripta** per decifrarlo
4. Usa il bottone **Copia** per copiare il risultato

> Per decriptare un testo, usa **la stessa identica password** usata per criptarlo.

## Installazione e avvio

```bash
# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Build di produzione
npm run build

# Anteprima della build
npm run preview
```

## Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- PWA con [vite-plugin-pwa](https://vite-pwa-org.netlify.app)

## Sicurezza

- Crittografia **AES-GCM** con chiave a 256 bit
- Derivazione della password con **PBKDF2** (SHA-256, 100.000 iterazioni)
- Salt e IV generati casualmente per ogni operazione
- **Zero dati trasmessi** — tutto resta nel tuo browser

---

<p align="center">
  Creata con il ❤️ da F.C.
</p>
