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
  Chiffrez et d&eacute;chiffrez du texte simplement et en toute s&eacute;curit&eacute;, directement dans votre navigateur.
</p>

<p align="center">
  <a href="https://easycrypt.netlify.app/">
    <img src="https://img.shields.io/badge/Ouvrir%20Easy%20Crypt-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Ouvrir Easy Crypt" />
  </a>
</p>

---

## Qu'est-ce que c'est

**Easy Crypt** est une application web l&eacute;g&egrave;re et intuitive pour chiffrer et d&eacute;chiffrer du texte &agrave; l'aide d'un mot de passe. Tout le chiffrement se fait **localement dans votre navigateur** &mdash; aucune donn&eacute;e n'est jamais envoy&eacute;e &agrave; des serveurs externes.

## Fonctionnalit&eacute;s

- **Chiffrement AES-GCM 256 bits** avec d&eacute;rivation de cl&eacute; via PBKDF2
- **Chiffrer** &mdash; entrez un texte et un mot de passe, obtenez le texte chiffr&eacute;
- **D&eacute;chiffrer** &mdash; entrez le texte chiffr&eacute; et le m&ecirc;me mot de passe, obtenez le texte original
- **Coller** &mdash; collez directement depuis le presse-papiers dans le champ de saisie
- **Copier** &mdash; copiez le r&eacute;sultat dans le presse-papiers en un clic
- **Installable en PWA** &mdash; utilisez-la comme une application native sur mobile et bureau
- **Fonctionne hors ligne** &mdash; aucune connexion internet n&eacute;cessaire

## Comment utiliser

1. Tapez ou collez du texte dans le champ de saisie
2. Entrez un mot de passe
3. Appuyez sur **Chiffrer** pour obtenir le texte chiffr&eacute;, ou **D&eacute;chiffrer** pour le d&eacute;chiffrer
4. Utilisez le bouton **Copier** pour copier le r&eacute;sultat

> Pour d&eacute;chiffrer un texte, utilisez **exactement le m&ecirc;me mot de passe** utilis&eacute; pour le chiffrer.

## Installation et d&eacute;marrage

```bash
# Installer les d&eacute;pendances
npm install

# D&eacute;marrer en mode d&eacute;veloppement
npm run dev

# Build de production
npm run build

# Aper&ccedil;u du build
npm run preview
```

## Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- PWA avec [vite-plugin-pwa](https://vite-pwa-org.netlify.app)

## S&eacute;curit&eacute;

- Chiffrement **AES-GCM** avec cl&eacute; de 256 bits
- D&eacute;rivation du mot de passe avec **PBKDF2** (SHA-256, 100 000 it&eacute;rations)
- Salt et IV g&eacute;n&eacute;r&eacute;s al&eacute;atoirement pour chaque op&eacute;ration
- **Z&eacute;ro donn&eacute;es transmises** &mdash; tout reste dans votre navigateur

---

<p align="center">
  Cr&eacute;&eacute; avec amour par F.C.
</p>
