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
  Cifra y descifra texto de forma sencilla y segura, directamente en tu navegador.
</p>

<p align="center">
  <a href="https://easycrypt.netlify.app/">
    <img src="https://img.shields.io/badge/Abrir%20Easy%20Crypt-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Abrir Easy Crypt" />
  </a>
</p>

---

## Qu&eacute; es

**Easy Crypt** es una aplicaci&oacute;n web ligera e intuitiva para cifrar y descifrar texto usando una contrase&ntilde;a. Todo el cifrado ocurre **localmente en tu navegador** &mdash; ning&uacute;n dato se env&iacute;a a servidores externos.

## Funcionalidades

- **Cifrado AES-GCM de 256 bits** con derivaci&oacute;n de clave mediante PBKDF2
- **Cifrar** &mdash; introduce un texto y una contrase&ntilde;a, obt&eacute;n el texto cifrado
- **Descifrar** &mdash; introduce el texto cifrado y la misma contrase&ntilde;a, obt&eacute;n el texto original
- **Pegar** &mdash; pega directamente desde el portapapeles en el campo de entrada
- **Copiar** &mdash; copia el resultado al portapapeles con un clic
- **Instalable como PWA** &mdash; &uacute;sala como una app nativa en m&oacute;vil y escritorio
- **Funciona sin conexi&oacute;n** &mdash; no se necesita internet

## C&oacute;mo usar

1. Escribe o pega texto en el campo de entrada
2. Introduce una contrase&ntilde;a
3. Pulsa **Cifrar** para obtener el texto cifrado, o **Descifrar** para descifrarlo
4. Usa el bot&oacute;n **Copiar** para copiar el resultado

> Para descifrar un texto, usa **exactamente la misma contrase&ntilde;a** usada para cifrarlo.

## Instalaci&oacute;n e inicio

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Build de producci&oacute;n
npm run build

# Vista previa del build
npm run preview
```

## Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- PWA con [vite-plugin-pwa](https://vite-pwa-org.netlify.app)

## Seguridad

- Cifrado **AES-GCM** con clave de 256 bits
- Derivaci&oacute;n de contrase&ntilde;a con **PBKDF2** (SHA-256, 100.000 iteraciones)
- Salt e IV generados aleatoriamente para cada operaci&oacute;n
- **Cero datos transmitidos** &mdash; todo permanece en tu navegador

---

<p align="center">
  Creado con amor por F.C.
</p>
