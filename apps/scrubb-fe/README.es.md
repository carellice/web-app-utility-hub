# Scrubb

**Privacy-First Data Sanitizer** - Herramienta web para la sanitización de datos sensibles dentro de logs, fragmentos de código y documentos de texto.

![Scrubb Logo](./logo.png)

<p align="center">
  <a href="https://scrubb.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_Probar_Scrubb-App_en_Vivo-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Probar Scrubb en Vivo" height="40"/>
  </a>
</p>

> :it: [Italiano](./README.it.md) | :gb: [English](./README.en.md) | :fr: [Français](./README.fr.md) | :de: [Deutsch](./README.de.md)

## ¿Qué es Scrubb?

Scrubb nació de la necesidad concreta de poder compartir logs de aplicaciones, fragmentos de código y documentos de texto en canales públicos (Slack, foros, issue trackers) sin el riesgo de exponer accidentalmente información sensible como direcciones IP, claves API, tokens JWT, números de identificación fiscal o números de tarjetas de crédito.

La particularidad de Scrubb es su arquitectura **Zero-Knowledge**: todo el procesamiento se realiza localmente en el navegador del usuario. Ningún dato se envía jamás a servidores externos. Nunca.

## Funcionalidades principales

### Smart Editor

La interfaz se basa en un único editor inteligente con resaltado en tiempo real. Mientras se escribe o pega texto, Scrubb analiza el contenido y marca visualmente los datos sensibles con colores distintos para cada categoría:

- **Amarillo** para direcciones IP, MAC, URLs
- **Naranja** para emails y números de teléfono
- **Rojo** para claves API, JWT, contraseñas, claves privadas
- **Violeta** para hashes criptográficos
- **Verde** para identificaciones fiscales, matrículas, números de IVA, tarjetas sanitarias
- **Turquesa** para documentos de identidad, permisos de conducir, pasaportes
- **Cian** para IBANs y tarjetas de crédito

### Tres niveles de escaneo

| Nivel | Qué detecta | Cobertura |
|-------|-------------|-----------|
| **Red y Tecnología** | IPv4, IPv6, Dirección MAC, Email, URL/Dominios | Universal |
| **Secretos y Seguridad** | Claves API (OpenAI, AWS, Google, GitHub, GitLab, Slack, Stripe), JWT, Claves privadas RSA/SSH, Hash MD5/SHA-1/SHA-256, Contraseñas en configuraciones | Universal |
| **Documentos e Identidad** | Identificaciones fiscales (IT, US SSN, UK NIN, DE Steuer-ID, FR NIR, ES DNI/NIE), Matrículas (IT, DE, FR, ES, UK, NL, PL), Números de IVA UE (18 países), IBAN, Tarjetas de crédito (Visa, Mastercard, Amex, Discover, JCB, Diners), Números de teléfono internacionales (IT, US/CA, UK, DE, FR, ES, formato +CC), Documentos de identidad (IT CIE, DE, FR, PT), Permisos de conducir (IT, UK DVLA, US, DE, FR), Pasaportes (IT + genérico internacional), Tarjeta sanitaria IT | Internacional |

Los niveles son independientes y combinables: se pueden activar individualmente o todos juntos.

### Modos de salida

Una vez identificados los datos sensibles, el botón **"Scrubb It"** los reemplaza según el modo elegido:

- **Block**: `RSSMRA85M01H501Z` se convierte en `█████████████████` (ocultación visual)
- **Fixed**: `RSSMRA85M01H501Z` se convierte en `[REDACTED]` (placeholder estándar)
- **Semantic**: `RSSMRA85M01H501Z` se convierte en `[FISCAL_CODE]` (preserva el contexto para depuración)

### Internacionalización (i18n)

La interfaz está disponible en 5 idiomas, seleccionables desde el menú en la cabecera:

- Italiano
- English
- Français
- Deutsch
- Español

El idioma se detecta automáticamente desde el navegador en el primer acceso y se guarda en las preferencias locales.

### Lista blanca

Es posible definir una lista de excepciones — términos como "localhost", el nombre de tu empresa o direcciones internas conocidas — que nunca serán ocultados aunque coincidan con los patrones.

### Copia con un clic

Después de la sanitización, un botón dedicado copia el texto limpio al portapapeles con confirmación visual.

## Arquitectura técnica

### Stack

- **React 19** con **TypeScript** (scaffold Vite)
- **Tailwind CSS v4** para el estilo
- **Lucide React** para los iconos

### Estrategia de overlay del editor

El resaltado en tiempo real se logra mediante una técnica de superposición de dos capas:

1. Un `<textarea>` con texto transparente y cursor visible gestiona la entrada del usuario
2. Un `<div>` posicionado debajo, con el mismo texto renderizado mediante etiquetas `<mark>` coloreadas, muestra el resaltado

Las dos capas están sincronizadas en scroll, fuente, dimensiones y espaciado mediante hooks React personalizados.

### Motor de detección

El núcleo de la aplicación es un motor basado en Expresiones Regulares organizado en tres grupos de patrones independientes (~65 patrones en total). Cada grupo corresponde a un nivel de escaneo que el usuario puede activar o desactivar desde la barra lateral.

El análisis se ejecuta con un debounce de 150ms para garantizar fluidez durante la escritura, y un sistema de eliminación de solapamientos evita que el mismo fragmento de texto sea resaltado múltiples veces.

Para los documentos internacionales cuyo formato es demasiado genérico (ej. números de pasaporte, permisos de conducir), se utilizan patrones **dependientes del contexto** que requieren una palabra clave asociada (ej. "passport:", "driver's license #") para reducir los falsos positivos.

### Privacy by design

- Ninguna llamada API externa para el análisis del texto
- Ningún modelo de IA que descargar: la detección se basa completamente en pattern matching local
- `localStorage` utilizado exclusivamente para las preferencias del usuario (niveles, modo de salida, lista blanca, idioma)
- La aplicación funciona completamente offline después de la primera carga
- Bundle total inferior a 270KB

## Cómo empezar

### Prerrequisitos

- Node.js 18+
- npm

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd scrubb-fe

# Instalar las dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Build de producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`, listos para el despliegue en Netlify o cualquier hosting estático.

### Despliegue en Netlify

1. Conectar el repositorio a Netlify
2. Establecer el comando de build: `npm run build`
3. Establecer el directorio de publicación: `dist`
4. Despliegue automático en cada push

## Estructura del proyecto

```
src/
├── components/
│   ├── Header.tsx          # Barra superior con logo, estado y selector de idioma
│   ├── Sidebar.tsx         # Panel lateral con controles y tooltips
│   ├── SmartEditor.tsx     # Editor con overlay para resaltado
│   ├── ActionBar.tsx       # Barra de acciones (Scrubb It, Copiar, Restaurar)
│   └── StatusBar.tsx       # Barra de estado inferior
├── engine/
│   ├── regex.ts            # Motor de detección (~65 patrones internacionales)
│   └── scrubber.ts         # Lógica de reemplazo de texto
├── hooks/
│   ├── useLocalStorage.ts  # Persistencia de preferencias del usuario
│   ├── useDebounce.ts      # Debounce para análisis en tiempo real
│   └── useI18n.ts          # Hook para internacionalización
├── i18n/
│   └── index.ts            # Diccionarios de traducciones (IT, EN, FR, DE, ES)
├── types/
│   └── index.ts            # Definiciones TypeScript
├── utils/
│   └── cn.ts               # Utilidad para clases CSS
├── App.tsx                 # Componente principal
├── main.tsx                # Punto de entrada
└── index.css               # Estilos globales y tema
```

## Compatibilidad

- Chrome 90+
- Firefox 90+
- Edge 90+
- Safari 15+

## Licencia

Distribuido bajo licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Creado con ❤️ por F.C.
