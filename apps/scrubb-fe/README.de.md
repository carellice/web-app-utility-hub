# Scrubb

**Privacy-First Data Sanitizer** - Web-Tool zur Bereinigung sensibler Daten in Logs, Code-Snippets und Textdokumenten.

![Scrubb Logo](./logo.png)

<p align="center">
  <a href="https://scrubb.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_Scrubb_Testen-Live_App-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Scrubb Testen" height="40"/>
  </a>
</p>

> :it: [Italiano](./README.it.md) | :gb: [English](./README.en.md) | :fr: [Français](./README.fr.md) | :es: [Español](./README.es.md)

## Was ist Scrubb?

Scrubb entstand aus dem konkreten Bedarf, Anwendungslogs, Code-Fragmente und Textdokumente auf öffentlichen Kanälen (Slack, Foren, Issue-Tracker) teilen zu können, ohne das Risiko einzugehen, versehentlich vertrauliche Informationen wie IP-Adressen, API-Schlüssel, JWT-Tokens, Steuer-IDs oder Kreditkartennummern preiszugeben.

Das Besondere an Scrubb ist seine **Zero-Knowledge**-Architektur: Die gesamte Verarbeitung erfolgt lokal im Browser des Benutzers. Es werden niemals Daten an externe Server gesendet. Niemals.

## Hauptfunktionen

### Smart Editor

Die Oberfläche basiert auf einem einzelnen intelligenten Editor mit Echtzeit-Hervorhebung. Während der Eingabe oder beim Einfügen von Text analysiert Scrubb den Inhalt und markiert sensible Daten visuell mit unterschiedlichen Farben für jede Kategorie:

- **Gelb** für IP-Adressen, MAC, URLs
- **Orange** für E-Mails und Telefonnummern
- **Rot** für API-Schlüssel, JWT, Passwörter, private Schlüssel
- **Violett** für kryptografische Hashes
- **Grün** für Steuer-IDs, Kennzeichen, USt-Nummern, Gesundheitskarten
- **Petrol** für Personalausweise, Führerscheine, Reisepässe
- **Cyan** für IBANs und Kreditkarten

### Drei Scan-Stufen

| Stufe | Was erkannt wird | Abdeckung |
|-------|-----------------|-----------|
| **Netzwerk & Technik** | IPv4, IPv6, MAC-Adresse, E-Mail, URL/Domains | Universal |
| **Geheimnisse & Sicherheit** | API-Schlüssel (OpenAI, AWS, Google, GitHub, GitLab, Slack, Stripe), JWT, Private Keys RSA/SSH, Hash MD5/SHA-1/SHA-256, Passwörter in Konfigurationen | Universal |
| **Dokumente & Identität** | Steuer-IDs (IT, US SSN, UK NIN, DE Steuer-ID, FR NIR, ES DNI/NIE), Kennzeichen (IT, DE, FR, ES, UK, NL, PL), EU-USt-Nummern (18 Länder), IBAN, Kreditkarten (Visa, Mastercard, Amex, Discover, JCB, Diners), Internationale Telefonnummern (IT, US/CA, UK, DE, FR, ES, +CC-Format), Personalausweise (IT CIE, DE, FR, PT), Führerscheine (IT, UK DVLA, US, DE, FR), Reisepässe (IT + generisch international), IT-Gesundheitskarte | International |

Die Stufen sind unabhängig und kombinierbar: Sie können einzeln oder alle zusammen aktiviert werden.

### Ausgabemodi

Sobald sensible Daten identifiziert wurden, ersetzt die Schaltfläche **"Scrubb It"** diese gemäß dem gewählten Modus:

- **Block**: `RSSMRA85M01H501Z` wird zu `█████████████████` (visuelle Schwärzung)
- **Fixed**: `RSSMRA85M01H501Z` wird zu `[REDACTED]` (Standard-Platzhalter)
- **Semantic**: `RSSMRA85M01H501Z` wird zu `[FISCAL_CODE]` (bewahrt den Kontext für das Debugging)

### Internationalisierung (i18n)

Die Oberfläche ist in 5 Sprachen verfügbar, auswählbar über das Menü in der Kopfzeile:

- Italiano
- English
- Français
- Deutsch
- Español

Die Sprache wird beim ersten Zugriff automatisch vom Browser erkannt und in den lokalen Einstellungen gespeichert.

### Whitelist

Es ist möglich, eine Ausnahmeliste zu definieren — Begriffe wie "localhost", der Name Ihres Unternehmens oder bekannte interne Adressen — die niemals geschwärzt werden, auch wenn sie den Mustern entsprechen.

### Kopieren mit einem Klick

Nach der Bereinigung kopiert eine dedizierte Schaltfläche den sauberen Text in die Zwischenablage mit visueller Bestätigung.

## Technische Architektur

### Stack

- **React 19** mit **TypeScript** (Vite-Scaffold)
- **Tailwind CSS v4** für das Styling
- **Lucide React** für Icons

### Overlay-Strategie des Editors

Die Echtzeit-Hervorhebung wird durch eine Zwei-Schichten-Overlay-Technik erreicht:

1. Ein `<textarea>` mit transparentem Text und sichtbarem Cursor verarbeitet die Benutzereingabe
2. Ein darunter positioniertes `<div>`, mit demselben Text durch farbige `<mark>`-Tags gerendert, zeigt die Hervorhebung an

Die beiden Schichten werden in Scroll, Schriftart, Abmessungen und Abstanden über benutzerdefinierte React-Hooks synchronisiert.

### Erkennungs-Engine

Das Herzstück der Anwendung ist eine auf regulären Ausdrücken basierende Engine, organisiert in drei unabhängigen Pattern-Gruppen (~65 Patterns insgesamt). Jede Gruppe entspricht einer Scan-Stufe, die der Benutzer in der Seitenleiste aktivieren oder deaktivieren kann.

Die Analyse wird mit einem Debounce von 150ms durchgeführt, um flüssiges Tippen zu gewährleisten, und ein Overlap-Entfernungssystem verhindert, dass dasselbe Textfragment mehrfach hervorgehoben wird.

Für internationale Dokumente, deren Format zu generisch ist (z.B. Passnummern, Führerscheine), werden **kontextabhängige** Patterns verwendet, die ein zugehöriges Schlüsselwort erfordern (z.B. "passport:", "driver's license #"), um Fehlalarme zu reduzieren.

### Privacy by Design

- Keine externen API-Aufrufe für die Textanalyse
- Kein KI-Modell zum Herunterladen: Die Erkennung basiert vollständig auf lokalem Pattern Matching
- `localStorage` wird ausschließlich für Benutzereinstellungen verwendet (Stufen, Ausgabemodus, Whitelist, Sprache)
- Die Anwendung funktioniert nach dem ersten Laden vollständig offline
- Gesamtes Bundle unter 270KB

## Erste Schritte

### Voraussetzungen

- Node.js 18+
- npm

### Installation

```bash
# Repository klonen
git clone <repo-url>
cd scrubb-fe

# Abhängigkeiten installieren
npm install

# Im Entwicklungsmodus starten
npm run dev
```

Die Anwendung ist unter `http://localhost:5173` verfügbar.

### Produktions-Build

```bash
npm run build
```

Die statischen Dateien werden im Ordner `dist/` generiert, bereit für das Deployment auf Netlify oder jedem statischen Hosting.

### Deployment auf Netlify

1. Repository mit Netlify verbinden
2. Build-Befehl festlegen: `npm run build`
3. Veröffentlichungsverzeichnis festlegen: `dist`
4. Automatisches Deployment bei jedem Push

## Projektstruktur

```
src/
├── components/
│   ├── Header.tsx          # Kopfleiste mit Logo, Status und Sprachauswahl
│   ├── Sidebar.tsx         # Seitenleiste mit Steuerungen und Tooltips
│   ├── SmartEditor.tsx     # Editor mit Overlay für Hervorhebung
│   ├── ActionBar.tsx       # Aktionsleiste (Scrubb It, Kopieren, Wiederherstellen)
│   └── StatusBar.tsx       # Untere Statusleiste
├── engine/
│   ├── regex.ts            # Erkennungs-Engine (~65 internationale Patterns)
│   └── scrubber.ts         # Textersetzungslogik
├── hooks/
│   ├── useLocalStorage.ts  # Persistenz der Benutzereinstellungen
│   ├── useDebounce.ts      # Debounce für Echtzeitanalyse
│   └── useI18n.ts          # Internationalisierungs-Hook
├── i18n/
│   └── index.ts            # Übersetzungswörterbücher (IT, EN, FR, DE, ES)
├── types/
│   └── index.ts            # TypeScript-Definitionen
├── utils/
│   └── cn.ts               # CSS-Klassen-Utility
├── App.tsx                 # Hauptkomponente
├── main.tsx                # Einstiegspunkt
└── index.css               # Globale Stile und Theme
```

## Kompatibilität

- Chrome 90+
- Firefox 90+
- Edge 90+
- Safari 15+

## Lizenz

Verteilt unter der MIT-Lizenz. Siehe die Datei `LICENSE` für weitere Details.

---

Erstellt mit ❤️ von F.C.
