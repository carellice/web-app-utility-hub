# Scrubb

**Privacy-First Data Sanitizer** - Outil web pour l'assainissement de données sensibles dans les logs, extraits de code et documents textuels.

![Scrubb Logo](./logo.png)

<p align="center">
  <a href="https://scrubb.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_Essayer_Scrubb-App_Live-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Essayer Scrubb Live" height="40"/>
  </a>
</p>

> :it: [Italiano](./README.it.md) | :gb: [English](./README.en.md) | :de: [Deutsch](./README.de.md) | :es: [Español](./README.es.md)

## Qu'est-ce que Scrubb ?

Scrubb est né du besoin concret de pouvoir partager des logs applicatifs, des fragments de code et des documents textuels sur des canaux publics (Slack, forums, issue trackers) sans risquer d'exposer accidentellement des informations sensibles telles que des adresses IP, des clés API, des tokens JWT, des numéros fiscaux ou des numéros de carte de crédit.

La particularité de Scrubb est son architecture **Zero-Knowledge** : l'intégralité du traitement s'effectue localement dans le navigateur de l'utilisateur. Aucune donnée n'est jamais envoyée vers des serveurs externes. Jamais.

## Fonctionnalités principales

### Smart Editor

L'interface repose sur un éditeur intelligent unique avec mise en surbrillance en temps réel. Pendant la saisie ou le collage de texte, Scrubb analyse le contenu et marque visuellement les données sensibles avec des couleurs distinctes pour chaque catégorie :

- **Jaune** pour les adresses IP, MAC, URL
- **Orange** pour les emails et numéros de téléphone
- **Rouge** pour les clés API, JWT, mots de passe, clés privées
- **Violet** pour les hash cryptographiques
- **Vert** pour les numéros fiscaux, plaques d'immatriculation, numéros de TVA, cartes de santé
- **Sarcelle** pour les cartes d'identité, permis de conduire, passeports
- **Cyan** pour les IBAN et cartes de crédit

### Trois niveaux de scan

| Niveau | Ce qu'il détecte | Couverture |
|--------|------------------|------------|
| **Réseau & Tech** | IPv4, IPv6, Adresse MAC, Email, URL/Domaines | Universelle |
| **Secrets & Sécurité** | Clés API (OpenAI, AWS, Google, GitHub, GitLab, Slack, Stripe), JWT, Clés privées RSA/SSH, Hash MD5/SHA-1/SHA-256, Mots de passe dans les configurations | Universelle |
| **Documents & Identité** | Numéros fiscaux (IT, US SSN, UK NIN, DE Steuer-ID, FR NIR, ES DNI/NIE), Plaques d'immatriculation (IT, DE, FR, ES, UK, NL, PL), Numéros de TVA UE (18 pays), IBAN, Cartes de crédit (Visa, Mastercard, Amex, Discover, JCB, Diners), Numéros de téléphone internationaux (IT, US/CA, UK, DE, FR, ES, format +CC), Cartes d'identité (IT CIE, DE, FR, PT), Permis de conduire (IT, UK DVLA, US, DE, FR), Passeports (IT + générique international), Carte de santé IT | Internationale |

Les niveaux sont indépendants et combinables : ils peuvent être activés individuellement ou tous ensemble.

### Modes de sortie

Une fois les données sensibles identifiées, le bouton **"Scrubb It"** les remplace selon le mode choisi :

- **Block** : `RSSMRA85M01H501Z` devient `█████████████████` (masquage visuel)
- **Fixed** : `RSSMRA85M01H501Z` devient `[REDACTED]` (placeholder standard)
- **Semantic** : `RSSMRA85M01H501Z` devient `[FISCAL_CODE]` (préserve le contexte pour le débogage)

### Internationalisation (i18n)

L'interface est disponible en 5 langues, sélectionnables depuis le menu dans l'en-tête :

- Italiano
- English
- Français
- Deutsch
- Español

La langue est automatiquement détectée depuis le navigateur lors du premier accès et sauvegardée dans les préférences locales.

### Liste blanche

Il est possible de définir une liste d'exceptions — des termes comme "localhost", le nom de votre entreprise ou des adresses internes connues — qui ne seront jamais masqués même s'ils correspondent aux patterns.

### Copie en un clic

Après l'assainissement, un bouton dédié copie le texte nettoyé dans le presse-papiers avec un retour visuel de confirmation.

## Architecture technique

### Stack

- **React 19** avec **TypeScript** (scaffold Vite)
- **Tailwind CSS v4** pour le style
- **Lucide React** pour les icônes

### Stratégie d'overlay de l'éditeur

La mise en surbrillance en temps réel est obtenue grâce à une technique de superposition à deux couches :

1. Un `<textarea>` avec texte transparent et curseur visible gère la saisie utilisateur
2. Un `<div>` positionné en dessous, avec le même texte rendu via des balises `<mark>` colorées, affiche la mise en surbrillance

Les deux couches sont synchronisées en défilement, police, dimensions et espacement via des hooks React personnalisés.

### Moteur de détection

Le cœur de l'application est un moteur basé sur les Expressions Régulières, organisé en trois groupes de patterns indépendants (~65 patterns au total). Chaque groupe correspond à un niveau de scan que l'utilisateur peut activer ou désactiver depuis la barre latérale.

L'analyse est effectuée avec un debounce de 150ms pour garantir la fluidité pendant la saisie, et un système de suppression de chevauchements évite qu'un même fragment de texte soit surligné plusieurs fois.

Pour les documents internationaux dont le format est trop générique (ex. numéros de passeport, permis de conduire), des patterns **dépendants du contexte** sont utilisés, nécessitant un mot-clé associé (ex. "passport:", "driver's license #") pour réduire les faux positifs.

### Privacy by design

- Aucun appel API externe pour l'analyse du texte
- Aucun modèle IA à télécharger : la détection repose entièrement sur le pattern matching local
- `localStorage` utilisé exclusivement pour les préférences utilisateur (niveaux, mode de sortie, liste blanche, langue)
- L'application fonctionne entièrement hors ligne après le premier chargement
- Bundle total inférieur à 270 Ko

## Démarrage rapide

### Prérequis

- Node.js 18+
- npm

### Installation

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd scrubb-fe

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
```

Les fichiers statiques seront générés dans le dossier `dist/`, prêts pour le déploiement sur Netlify ou tout hébergement statique.

### Déploiement sur Netlify

1. Connecter le dépôt à Netlify
2. Définir la commande de build : `npm run build`
3. Définir le répertoire de publication : `dist`
4. Déploiement automatique à chaque push

## Structure du projet

```
src/
├── components/
│   ├── Header.tsx          # Barre supérieure avec logo, état et sélecteur de langue
│   ├── Sidebar.tsx         # Panneau latéral avec contrôles et infobulles
│   ├── SmartEditor.tsx     # Éditeur avec overlay pour la surbrillance
│   ├── ActionBar.tsx       # Barre d'actions (Scrubb It, Copier, Restaurer)
│   └── StatusBar.tsx       # Barre d'état inférieure
├── engine/
│   ├── regex.ts            # Moteur de détection (~65 patterns internationaux)
│   └── scrubber.ts         # Logique de remplacement de texte
├── hooks/
│   ├── useLocalStorage.ts  # Persistance des préférences utilisateur
│   ├── useDebounce.ts      # Debounce pour l'analyse en temps réel
│   └── useI18n.ts          # Hook pour l'internationalisation
├── i18n/
│   └── index.ts            # Dictionnaires de traductions (IT, EN, FR, DE, ES)
├── types/
│   └── index.ts            # Définitions TypeScript
├── utils/
│   └── cn.ts               # Utilitaire pour classes CSS
├── App.tsx                 # Composant principal
├── main.tsx                # Point d'entrée
└── index.css               # Styles globaux et thème
```

## Compatibilité

- Chrome 90+
- Firefox 90+
- Edge 90+
- Safari 15+

## Licence

Distribué sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Créé avec ❤️ par F.C.
