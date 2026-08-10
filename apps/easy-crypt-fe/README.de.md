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
  Text einfach und sicher verschl&uuml;sseln und entschl&uuml;sseln, direkt im Browser.
</p>

<p align="center">
  <a href="https://easycrypt.netlify.app/">
    <img src="https://img.shields.io/badge/Easy%20Crypt%20%C3%B6ffnen-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Easy Crypt &ouml;ffnen" />
  </a>
</p>

---

## Was ist das

**Easy Crypt** ist eine leichte und intuitive Web-App zum Verschl&uuml;sseln und Entschl&uuml;sseln von Text mit einem Passwort. Die gesamte Verschl&uuml;sselung erfolgt **lokal in deinem Browser** &mdash; es werden keine Daten an externe Server gesendet.

## Funktionen

- **AES-GCM 256-Bit-Verschl&uuml;sselung** mit Schl&uuml;sselableitung &uuml;ber PBKDF2
- **Verschl&uuml;sseln** &mdash; gib einen Text und ein Passwort ein, erhalte den verschl&uuml;sselten Text
- **Entschl&uuml;sseln** &mdash; gib den verschl&uuml;sselten Text und dasselbe Passwort ein, erhalte den Originaltext
- **Einf&uuml;gen** &mdash; f&uuml;ge direkt aus der Zwischenablage in das Eingabefeld ein
- **Kopieren** &mdash; kopiere das Ergebnis mit einem Klick in die Zwischenablage
- **Als PWA installierbar** &mdash; nutze sie wie eine native App auf Mobilger&auml;ten und Desktop
- **Funktioniert offline** &mdash; keine Internetverbindung erforderlich

## Verwendung

1. Tippe oder f&uuml;ge Text in das Eingabefeld ein
2. Gib ein Passwort ein
3. Dr&uuml;cke **Verschl&uuml;sseln** um den verschl&uuml;sselten Text zu erhalten, oder **Entschl&uuml;sseln** um ihn zu entschl&uuml;sseln
4. Verwende den **Kopieren**-Button um das Ergebnis zu kopieren

> Um einen Text zu entschl&uuml;sseln, verwende **genau dasselbe Passwort**, das zum Verschl&uuml;sseln verwendet wurde.

## Installation und Start

```bash
# Abh&auml;ngigkeiten installieren
npm install

# Im Entwicklungsmodus starten
npm run dev

# Produktions-Build
npm run build

# Build-Vorschau
npm run preview
```

## Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- PWA mit [vite-plugin-pwa](https://vite-pwa-org.netlify.app)

## Sicherheit

- **AES-GCM**-Verschl&uuml;sselung mit 256-Bit-Schl&uuml;ssel
- Passwortableitung mit **PBKDF2** (SHA-256, 100.000 Iterationen)
- Zuf&auml;llig generierte Salt- und IV-Werte f&uuml;r jede Operation
- **Keine Daten&uuml;bertragung** &mdash; alles bleibt in deinem Browser

---

<p align="center">
  Mit Liebe erstellt von F.C.
</p>
