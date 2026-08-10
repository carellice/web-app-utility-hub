# Scrubb

**Privacy-First Data Sanitizer** - A web tool for sanitizing sensitive data within logs, code snippets, and text documents.

![Scrubb Logo](./logo.png)

<p align="center">
  <a href="https://scrubb.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_Try_Scrubb-Live_App-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Try Scrubb Live" height="40"/>
  </a>
</p>

> :it: [Italiano](./README.it.md) | :fr: [Français](./README.fr.md) | :de: [Deutsch](./README.de.md) | :es: [Español](./README.es.md)

## What is Scrubb?

Scrubb was born from the real need to share application logs, code fragments, and text documents on public channels (Slack, forums, issue trackers) without the risk of accidentally exposing sensitive information such as IP addresses, API keys, JWT tokens, tax IDs, or credit card numbers.

What makes Scrubb special is its **Zero-Knowledge** architecture: all processing happens locally in the user's browser. No data is ever sent to external servers. Ever.

## Key Features

### Smart Editor

The interface is built around a single intelligent editor with real-time highlighting. As you type or paste text, Scrubb analyzes the content and visually marks sensitive data with distinct colors for each category:

- **Yellow** for IP addresses, MAC, URLs
- **Orange** for emails and phone numbers
- **Red** for API keys, JWT, passwords, private keys
- **Purple** for cryptographic hashes
- **Green** for tax IDs, license plates, VAT numbers, health cards
- **Teal** for ID cards, driver's licenses, passports
- **Cyan** for IBANs and credit cards

### Three Scan Levels

| Level | What it detects | Coverage |
|-------|----------------|----------|
| **Network & Tech** | IPv4, IPv6, MAC Address, Email, URL/Domains | Universal |
| **Secrets & Security** | API Keys (OpenAI, AWS, Google, GitHub, GitLab, Slack, Stripe), JWT, Private Keys RSA/SSH, Hash MD5/SHA-1/SHA-256, Passwords in configs | Universal |
| **Documents & Identity** | Tax IDs (IT, US SSN, UK NIN, DE Steuer-ID, FR NIR, ES DNI/NIE), License plates (IT, DE, FR, ES, UK, NL, PL), EU VAT numbers (18 countries), IBAN, Credit cards (Visa, Mastercard, Amex, Discover, JCB, Diners), International phone numbers (IT, US/CA, UK, DE, FR, ES, +CC format), ID cards (IT CIE, DE, FR, PT), Driver's licenses (IT, UK DVLA, US, DE, FR), Passports (IT + generic international), IT Health Card | International |

Levels are independent and combinable: they can be activated individually or all together.

### Output Modes

Once sensitive data is identified, the **"Scrubb It"** button replaces it according to the chosen mode:

- **Block**: `RSSMRA85M01H501Z` becomes `█████████████████` (visual redaction)
- **Fixed**: `RSSMRA85M01H501Z` becomes `[REDACTED]` (standard placeholder)
- **Semantic**: `RSSMRA85M01H501Z` becomes `[FISCAL_CODE]` (preserves context for debugging)

### Internationalization (i18n)

The interface is available in 5 languages, selectable from the header menu:

- Italiano
- English
- Français
- Deutsch
- Español

The language is automatically detected from the browser on first visit and saved in local preferences.

### Whitelist

You can define a list of exceptions — terms like "localhost", your company name, or known internal addresses — that will never be redacted even if they match the patterns.

### One-Click Copy

After sanitization, a dedicated button copies the clean text to the clipboard with visual confirmation feedback.

## Technical Architecture

### Stack

- **React 19** with **TypeScript** (Vite scaffold)
- **Tailwind CSS v4** for styling
- **Lucide React** for icons

### Editor Overlay Strategy

Real-time highlighting is achieved using a dual-layer overlay technique:

1. A `<textarea>` with transparent text and visible cursor handles user input
2. A `<div>` positioned beneath, with the same text rendered using colored `<mark>` tags, displays the highlighting

The two layers are synchronized in scroll, font, dimensions, and padding via custom React hooks.

### Detection Engine

The core of the application is a Regex-based engine organized into three independent pattern groups (~65 total patterns). Each group corresponds to a scan level that the user can enable or disable from the sidebar.

Analysis is performed with a 150ms debounce to ensure smooth typing, and an overlap removal system prevents the same text fragment from being highlighted multiple times.

For international documents whose format is too generic (e.g., passport numbers, driver's licenses), **context-dependent** patterns are used that require an associated keyword (e.g., "passport:", "driver's license #") to reduce false positives.

### Privacy by Design

- No external API calls for text analysis
- No AI model to download: detection is entirely based on local pattern matching
- `localStorage` used exclusively for user preferences (levels, output mode, whitelist, language)
- The application works completely offline after initial load
- Total bundle under 270KB

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd scrubb-fe

# Install dependencies
npm install

# Start in development mode
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Static files will be generated in the `dist/` folder, ready for deployment on Netlify or any static hosting.

### Deploy on Netlify

1. Connect the repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Automatic deploy on every push

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Top bar with logo, status and language selector
│   ├── Sidebar.tsx         # Side panel with controls and tooltips
│   ├── SmartEditor.tsx     # Editor with overlay for highlighting
│   ├── ActionBar.tsx       # Action bar (Scrubb It, Copy, Reset)
│   └── StatusBar.tsx       # Bottom status bar
├── engine/
│   ├── regex.ts            # Detection engine (~65 international patterns)
│   └── scrubber.ts         # Text replacement logic
├── hooks/
│   ├── useLocalStorage.ts  # User preferences persistence
│   ├── useDebounce.ts      # Debounce for real-time analysis
│   └── useI18n.ts          # Internationalization hook
├── i18n/
│   └── index.ts            # Translation dictionaries (IT, EN, FR, DE, ES)
├── types/
│   └── index.ts            # TypeScript definitions
├── utils/
│   └── cn.ts               # CSS class utility
├── App.tsx                 # Main component
├── main.tsx                # Entry point
└── index.css               # Global styles and theme
```

## Compatibility

- Chrome 90+
- Firefox 90+
- Edge 90+
- Safari 15+

## License

Distributed under the MIT License. See the `LICENSE` file for more details.

---

Created with ❤️ by F.C.
