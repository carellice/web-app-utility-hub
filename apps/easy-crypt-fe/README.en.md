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
  Encrypt and decrypt text easily and securely, right in your browser.
</p>

<p align="center">
  <a href="https://easycrypt.netlify.app/">
    <img src="https://img.shields.io/badge/Open%20Easy%20Crypt-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Open Easy Crypt" />
  </a>
</p>

---

## What is it

**Easy Crypt** is a lightweight and intuitive web app for encrypting and decrypting text using a password. All encryption happens **locally in your browser** — no data is ever sent to external servers.

## Features

- **AES-GCM 256-bit encryption** with key derivation via PBKDF2
- **Encrypt** — enter text and a password, get the encrypted text
- **Decrypt** — enter the encrypted text and the same password, get the original text
- **Paste** — paste directly from the clipboard into the input field
- **Copy** — copy the result to the clipboard with one click
- **Installable as PWA** — use it as a native app on mobile and desktop
- **Works offline** — no internet connection required

## How to use

1. Type or paste text into the input field
2. Enter a password
3. Press **Encrypt** to get the encrypted text, or **Decrypt** to decrypt it
4. Use the **Copy** button to copy the result

> To decrypt text, use **the exact same password** used to encrypt it.

## Installation and setup

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Production build
npm run build

# Preview the build
npm run preview
```

## Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- PWA with [vite-plugin-pwa](https://vite-pwa-org.netlify.app)

## Security

- **AES-GCM** encryption with 256-bit key
- Password derivation with **PBKDF2** (SHA-256, 100,000 iterations)
- Randomly generated salt and IV for each operation
- **Zero data transmitted** — everything stays in your browser

---

<p align="center">
  Made with love by F.C.
</p>
