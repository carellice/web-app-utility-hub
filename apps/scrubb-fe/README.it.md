# Scrubb

**Privacy-First Data Sanitizer** - Strumento web per la sanitizzazione di dati sensibili all'interno di log, snippet di codice e documenti di testo.

![Scrubb Logo](./logo.png)

<p align="center">
  <a href="https://scrubb.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_Prova_Scrubb-App_Live-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Prova Scrubb Live" height="40"/>
  </a>
</p>

> :gb: [English](./README.en.md) | :fr: [Français](./README.fr.md) | :de: [Deutsch](./README.de.md) | :es: [Español](./README.es.md)

## Cos'e' Scrubb?

Scrubb nasce dall'esigenza concreta di poter condividere log applicativi, frammenti di codice e documenti testuali su canali pubblici (Slack, forum, issue tracker) senza il rischio di esporre accidentalmente informazioni riservate come indirizzi IP, chiavi API, token JWT, codici fiscali o numeri di carta di credito.

La particolarita' di Scrubb e' la sua architettura **Zero-Knowledge**: l'intera elaborazione avviene localmente nel browser dell'utente. Nessun dato viene mai inviato a server esterni. Mai.

## Funzionalita' principali

### Smart Editor

L'interfaccia si basa su un singolo editor intelligente con evidenziazione in tempo reale. Mentre si digita o incolla del testo, Scrubb analizza il contenuto e marca visivamente i dati sensibili con colori distinti per ogni categoria:

- **Giallo** per indirizzi IP, MAC, URL
- **Arancione** per email e numeri di telefono
- **Rosso** per API keys, JWT, password, chiavi private
- **Viola** per hash crittografici
- **Verde** per codici fiscali, targhe, partite IVA, tessere sanitarie
- **Teal** per carte d'identita', patenti, passaporti
- **Ciano** per IBAN e carte di credito

### Tre livelli di scansione

| Livello | Cosa rileva | Copertura |
|---------|-------------|-----------|
| **Network & Tech** | IPv4, IPv6, MAC Address, Email, URL/Domini | Universale |
| **Secrets & Security** | API Keys (OpenAI, AWS, Google, GitHub, GitLab, Slack, Stripe), JWT, Private Keys RSA/SSH, Hash MD5/SHA-1/SHA-256, Password in configurazioni | Universale |
| **Documents & Identity** | Codici fiscali e Tax ID (IT, US SSN, UK NIN, DE Steuer-ID, FR NIR, ES DNI/NIE), Targhe auto/moto (IT, DE, FR, ES, UK, NL, PL), Partite IVA EU (18 paesi), IBAN, Carte di credito (Visa, Mastercard, Amex, Discover, JCB, Diners), Numeri di telefono internazionali (IT, US/CA, UK, DE, FR, ES, formato +CC), Carte d'identita' (IT CIE, DE, FR, PT), Patenti (IT, UK DVLA, US, DE, FR), Passaporti (IT + generico internazionale), Tessera Sanitaria IT | Internazionale |

I livelli sono indipendenti e combinabili: si possono attivare singolarmente o tutti insieme.

### Modalita' di output

Una volta identificati i dati sensibili, il pulsante **"Scrubb It"** li sostituisce secondo la modalita' scelta:

- **Block**: `RSSMRA85M01H501Z` diventa `█████████████████` (oscuramento visivo)
- **Fixed**: `RSSMRA85M01H501Z` diventa `[REDACTED]` (placeholder standard)
- **Semantic**: `RSSMRA85M01H501Z` diventa `[FISCAL_CODE]` (preserva il contesto per il debug)

### Internazionalizzazione (i18n)

L'interfaccia e' disponibile in 5 lingue, selezionabili dal menu nell'header:

- Italiano
- English
- Français
- Deutsch
- Español

La lingua viene rilevata automaticamente dal browser al primo accesso e salvata nelle preferenze locali.

### Whitelist

E' possibile definire una lista di eccezioni — termini come "localhost", il nome della propria azienda o indirizzi interni noti — che non verranno mai censurati anche se corrispondono ai pattern.

### Copia con un click

Dopo la sanitizzazione, un pulsante dedicato copia il testo pulito negli appunti con feedback visivo di conferma.

## Architettura tecnica

### Stack

- **React 19** con **TypeScript** (scaffold Vite)
- **Tailwind CSS v4** per lo styling
- **Lucide React** per le icone

### Overlay Strategy dell'editor

L'evidenziazione in tempo reale si ottiene con una tecnica a due livelli sovrapposti:

1. Una `<textarea>` con testo trasparente e cursore visibile gestisce l'input utente
2. Un `<div>` posizionato sotto, con lo stesso testo renderizzato tramite tag `<mark>` colorati, mostra l'evidenziazione

I due layer sono sincronizzati in scroll, font, dimensioni e padding tramite hook React personalizzati.

### Motore di rilevamento

Il cuore dell'applicazione e' un motore basato su Espressioni Regolari organizzato in tre gruppi di pattern indipendenti (~65 pattern totali). Ogni gruppo corrisponde a un livello di scansione che l'utente puo' attivare o disattivare dalla sidebar.

L'analisi viene eseguita con un debounce di 150ms per garantire fluidita' durante la digitazione, e un sistema di rimozione overlap evita che lo stesso frammento di testo venga evidenziato piu' volte.

Per i documenti internazionali il cui formato e' troppo generico (es. numeri di passaporto, patenti), vengono usati pattern **context-dependent** che richiedono una keyword associata (es. "passport:", "driver's license #") per ridurre i falsi positivi.

### Privacy by design

- Nessuna chiamata API esterna per l'analisi del testo
- Nessun modello AI da scaricare: il rilevamento e' interamente basato su pattern matching locale
- `localStorage` usato esclusivamente per le preferenze utente (livelli, modalita' output, whitelist, lingua)
- L'applicazione funziona completamente offline dopo il primo caricamento
- Bundle totale inferiore a 270KB

## Come avviare il progetto

### Prerequisiti

- Node.js 18+
- npm

### Installazione

```bash
# Clona il repository
git clone <url-del-repo>
cd scrubb-fe

# Installa le dipendenze
npm install

# Avvia in modalita' sviluppo
npm run dev
```

L'applicazione sara' disponibile su `http://localhost:5173`.

### Build di produzione

```bash
npm run build
```

I file statici verranno generati nella cartella `dist/`, pronti per il deploy su Netlify o qualsiasi hosting statico.

### Deploy su Netlify

1. Collegare il repository a Netlify
2. Impostare il comando di build: `npm run build`
3. Impostare la directory di pubblicazione: `dist`
4. Deploy automatico ad ogni push

## Struttura del progetto

```
src/
├── components/
│   ├── Header.tsx          # Barra superiore con logo, stato e selettore lingua
│   ├── Sidebar.tsx         # Pannello laterale con controlli e tooltip
│   ├── SmartEditor.tsx     # Editor con overlay per highlighting
│   ├── ActionBar.tsx       # Barra azioni (Scrubb It, Copia, Ripristina)
│   └── StatusBar.tsx       # Barra di stato inferiore
├── engine/
│   ├── regex.ts            # Motore di rilevamento (~65 pattern internazionali)
│   └── scrubber.ts         # Logica di sostituzione testo
├── hooks/
│   ├── useLocalStorage.ts  # Persistenza preferenze utente
│   ├── useDebounce.ts      # Debounce per l'analisi in tempo reale
│   └── useI18n.ts          # Hook per internazionalizzazione
├── i18n/
│   └── index.ts            # Dizionari traduzioni (IT, EN, FR, DE, ES)
├── types/
│   └── index.ts            # Definizioni TypeScript
├── utils/
│   └── cn.ts               # Utility per classi CSS
├── App.tsx                 # Componente principale
├── main.tsx                # Entry point
└── index.css               # Stili globali e tema
```

## Compatibilita'

- Chrome 90+
- Firefox 90+
- Edge 90+
- Safari 15+

## Licenza

Distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

---

Creato con il ❤️ da F.C.
