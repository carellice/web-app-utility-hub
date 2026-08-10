export type Locale = 'it' | 'en' | 'fr' | 'de' | 'es'

export interface TranslationKeys {
  // Header
  subtitle: string
  matchSingular: string
  matchPlural: string
  scrubbed: string
  zeroKnowledge: string

  // Sidebar - Sezioni
  scanLevels: string
  outputMode: string
  whitelistTitle: string

  // Sidebar - Livelli
  levelNetworkLabel: string
  levelNetworkSub: string
  levelNetworkTip: string
  levelSecretsLabel: string
  levelSecretsSub: string
  levelSecretsTip: string
  levelDocumentsLabel: string
  levelDocumentsSub: string
  levelDocumentsTip: string

  // Sidebar - Output modes
  outputBlockTip: string
  outputFixedTip: string
  outputSemanticTip: string

  // Sidebar - Whitelist
  whitelistPlaceholder: string
  whitelistEmpty: string

  // Sidebar - Blacklist
  blacklistTitle: string
  blacklistPlaceholder: string
  blacklistEmpty: string

  // Selection popup
  popupAddWhitelist: string
  popupAddBlacklist: string

  // Sidebar - Footer
  footerLine1: string
  footerLine2: string

  // Editor
  editorPlaceholder: string

  // Upload
  uploadFile: string
  uploadLoading: string
  uploadError: string
  uploadUnsupported: string

  // Action bar
  clear: string
  reset: string
  copy: string
  copied: string
  scrubIt: string

  // Status bar
  scanning: string
  characters: string

  // Category labels
  catIpv4: string
  catIpv6: string
  catMac: string
  catEmail: string
  catUrl: string
  catApiKey: string
  catJwt: string
  catPrivateKey: string
  catHash: string
  catPassword: string
  catLicensePlate: string
  catFiscalCode: string
  catVatNumber: string
  catIdCard: string
  catDriversLicense: string
  catIban: string
  catCreditCard: string
  catPhone: string
  catPassport: string
  catSsn: string
  catPersonName: string
  catAddress: string
  catBlacklist: string
}

const it: TranslationKeys = {
  subtitle: 'Privacy-First Sanitizer',
  matchSingular: 'dato sensibile trovato',
  matchPlural: 'dati sensibili trovati',
  scrubbed: 'Sanitizzato',
  zeroKnowledge: 'Zero-Knowledge',

  scanLevels: 'Livelli di scansione',
  outputMode: 'Modalità output',
  whitelistTitle: 'Whitelist (eccezioni)',

  levelNetworkLabel: 'Network & Tech',
  levelNetworkSub: 'IP, MAC, Email, URL',
  levelNetworkTip: 'Rileva indirizzi IPv4/IPv6, MAC address, email e URL presenti nel testo',
  levelSecretsLabel: 'Secrets & Security',
  levelSecretsSub: 'API Keys, JWT, Hash, Password',
  levelSecretsTip: 'Rileva chiavi API (OpenAI, AWS, Google, GitHub, Stripe...), token JWT, hash crittografici e password in configurazioni',
  levelDocumentsLabel: 'Documenti & Identità',
  levelDocumentsSub: 'CF, Targhe, P.IVA, IBAN, Nomi, Indirizzi',
  levelDocumentsTip: 'Rileva codici fiscali, targhe, partite IVA, IBAN, carte di credito, numeri di telefono, patenti, passaporti, codici previdenziali, nomi/cognomi e indirizzi di vari paesi',

  outputBlockTip: 'Sostituisce i dati sensibili con blocchi opachi (████), oscuramento totale',
  outputFixedTip: 'Sostituisce con un placeholder generico [REDACTED], uguale per ogni tipo di dato',
  outputSemanticTip: 'Sostituisce con un tag descrittivo (es. [IP_ADDRESS], [API_KEY]) che preserva il contesto per il debug',

  whitelistPlaceholder: 'es. localhost',
  whitelistEmpty: 'Nessuna eccezione configurata',

  blacklistTitle: 'Blacklist (forzature)',
  blacklistPlaceholder: 'es. password123',
  blacklistEmpty: 'Nessuna forzatura configurata',

  popupAddWhitelist: 'Whitelist',
  popupAddBlacklist: 'Blacklist',

  footerLine1: 'Nessun dato lascia il tuo browser.',
  footerLine2: 'Elaborazione 100% locale.',

  editorPlaceholder: 'Incolla qui i tuoi log, snippet di codice o qualsiasi testo contenente dati sensibili...',

  uploadFile: 'Carica file',
  uploadLoading: 'Elaborazione...',
  uploadError: 'Errore nel leggere il file',
  uploadUnsupported: 'Formato non supportato. Usa .docx o .pdf',

  clear: 'Pulisci',
  reset: 'Ripristina',
  copy: 'Copia',
  copied: 'Copiato!',
  scrubIt: 'Scrubb It',

  scanning: 'Scanning...',
  characters: 'caratteri',

  catIpv4: 'Indirizzo IP',
  catIpv6: 'Indirizzo IPv6',
  catMac: 'MAC Address',
  catEmail: 'Email',
  catUrl: 'URL/Dominio',
  catApiKey: 'API Key',
  catJwt: 'Token JWT',
  catPrivateKey: 'Chiave Privata',
  catHash: 'Hash',
  catPassword: 'Password',
  catLicensePlate: 'Targa',
  catFiscalCode: 'Codice Fiscale',
  catVatNumber: 'Partita IVA',
  catIdCard: "Carta d'Identità",
  catDriversLicense: 'Patente',
  catIban: 'IBAN',
  catCreditCard: 'Carta di Credito',
  catPhone: 'Telefono',
  catPassport: 'Passaporto',
  catSsn: 'Codice Sanitario',
  catPersonName: 'Nome/Cognome',
  catAddress: 'Indirizzo',
  catBlacklist: 'Blacklist',
}

const en: TranslationKeys = {
  subtitle: 'Privacy-First Sanitizer',
  matchSingular: 'sensitive item found',
  matchPlural: 'sensitive items found',
  scrubbed: 'Sanitized',
  zeroKnowledge: 'Zero-Knowledge',

  scanLevels: 'Scan Levels',
  outputMode: 'Output Mode',
  whitelistTitle: 'Whitelist (exceptions)',

  levelNetworkLabel: 'Network & Tech',
  levelNetworkSub: 'IP, MAC, Email, URL',
  levelNetworkTip: 'Detects IPv4/IPv6 addresses, MAC addresses, emails and URLs in the text',
  levelSecretsLabel: 'Secrets & Security',
  levelSecretsSub: 'API Keys, JWT, Hash, Password',
  levelSecretsTip: 'Detects API keys (OpenAI, AWS, Google, GitHub, Stripe...), JWT tokens, cryptographic hashes and passwords in config files',
  levelDocumentsLabel: 'Documents & Identity',
  levelDocumentsSub: 'Tax ID, Plates, VAT, IBAN, Names, Addresses',
  levelDocumentsTip: 'Detects tax IDs, license plates, VAT numbers, IBANs, credit cards, phone numbers, driver\'s licenses, passports, social security numbers, person names and addresses across multiple countries',

  outputBlockTip: 'Replaces sensitive data with opaque blocks (████), full redaction',
  outputFixedTip: 'Replaces with a generic [REDACTED] placeholder, same for every data type',
  outputSemanticTip: 'Replaces with a descriptive tag (e.g. [IP_ADDRESS], [API_KEY]) that preserves context for debugging',

  whitelistPlaceholder: 'e.g. localhost',
  whitelistEmpty: 'No exceptions configured',

  blacklistTitle: 'Blacklist (forced)',
  blacklistPlaceholder: 'e.g. password123',
  blacklistEmpty: 'No forced terms configured',

  popupAddWhitelist: 'Whitelist',
  popupAddBlacklist: 'Blacklist',

  footerLine1: 'No data ever leaves your browser.',
  footerLine2: '100% local processing.',

  editorPlaceholder: 'Paste your logs, code snippets or any text containing sensitive data here...',

  uploadFile: 'Upload file',
  uploadLoading: 'Processing...',
  uploadError: 'Error reading file',
  uploadUnsupported: 'Unsupported format. Use .docx or .pdf',

  clear: 'Clear',
  reset: 'Reset',
  copy: 'Copy',
  copied: 'Copied!',
  scrubIt: 'Scrubb It',

  scanning: 'Scanning...',
  characters: 'characters',

  catIpv4: 'IP Address',
  catIpv6: 'IPv6 Address',
  catMac: 'MAC Address',
  catEmail: 'Email',
  catUrl: 'URL/Domain',
  catApiKey: 'API Key',
  catJwt: 'JWT Token',
  catPrivateKey: 'Private Key',
  catHash: 'Hash',
  catPassword: 'Password',
  catLicensePlate: 'License Plate',
  catFiscalCode: 'Tax / Fiscal ID',
  catVatNumber: 'VAT Number',
  catIdCard: 'ID Card',
  catDriversLicense: "Driver's License",
  catIban: 'IBAN',
  catCreditCard: 'Credit Card',
  catPhone: 'Phone Number',
  catPassport: 'Passport',
  catSsn: 'Social Security',
  catPersonName: 'Person Name',
  catAddress: 'Address',
  catBlacklist: 'Blacklisted',
}

const fr: TranslationKeys = {
  subtitle: 'Privacy-First Sanitizer',
  matchSingular: 'donnée sensible trouvée',
  matchPlural: 'données sensibles trouvées',
  scrubbed: 'Nettoyé',
  zeroKnowledge: 'Zero-Knowledge',

  scanLevels: 'Niveaux de scan',
  outputMode: 'Mode de sortie',
  whitelistTitle: 'Liste blanche (exceptions)',

  levelNetworkLabel: 'Réseau & Tech',
  levelNetworkSub: 'IP, MAC, Email, URL',
  levelNetworkTip: 'Détecte les adresses IPv4/IPv6, adresses MAC, emails et URLs dans le texte',
  levelSecretsLabel: 'Secrets & Sécurité',
  levelSecretsSub: 'Clés API, JWT, Hash, Mot de passe',
  levelSecretsTip: 'Détecte les clés API (OpenAI, AWS, Google, GitHub, Stripe...), tokens JWT, hash cryptographiques et mots de passe dans les fichiers de configuration',
  levelDocumentsLabel: 'Documents & Identité',
  levelDocumentsSub: 'NIR, Plaques, TVA, IBAN, Noms, Adresses',
  levelDocumentsTip: 'Détecte les numéros fiscaux, plaques d\'immatriculation, numéros de TVA, IBAN, cartes de crédit, numéros de téléphone, permis de conduire, passeports, numéros de sécurité sociale, noms/prénoms et adresses de plusieurs pays',

  outputBlockTip: 'Remplace les données sensibles par des blocs opaques (████), masquage total',
  outputFixedTip: 'Remplace par un placeholder générique [REDACTED], identique pour chaque type',
  outputSemanticTip: 'Remplace par un tag descriptif (ex. [IP_ADDRESS], [API_KEY]) qui préserve le contexte pour le débogage',

  whitelistPlaceholder: 'ex. localhost',
  whitelistEmpty: 'Aucune exception configurée',

  blacklistTitle: 'Liste noire (forcé)',
  blacklistPlaceholder: 'ex. password123',
  blacklistEmpty: 'Aucun terme forcé configuré',

  popupAddWhitelist: 'Liste blanche',
  popupAddBlacklist: 'Liste noire',

  footerLine1: 'Aucune donnée ne quitte votre navigateur.',
  footerLine2: 'Traitement 100% local.',

  editorPlaceholder: 'Collez ici vos logs, extraits de code ou tout texte contenant des données sensibles...',

  uploadFile: 'Charger fichier',
  uploadLoading: 'Traitement...',
  uploadError: 'Erreur de lecture du fichier',
  uploadUnsupported: 'Format non supporté. Utilisez .docx ou .pdf',

  clear: 'Effacer',
  reset: 'Restaurer',
  copy: 'Copier',
  copied: 'Copié !',
  scrubIt: 'Scrubb It',

  scanning: 'Analyse...',
  characters: 'caractères',

  catIpv4: 'Adresse IP',
  catIpv6: 'Adresse IPv6',
  catMac: 'Adresse MAC',
  catEmail: 'Email',
  catUrl: 'URL/Domaine',
  catApiKey: 'Clé API',
  catJwt: 'Token JWT',
  catPrivateKey: 'Clé Privée',
  catHash: 'Hash',
  catPassword: 'Mot de passe',
  catLicensePlate: 'Plaque d\'immatriculation',
  catFiscalCode: 'Numéro fiscal',
  catVatNumber: 'Numéro de TVA',
  catIdCard: 'Carte d\'identité',
  catDriversLicense: 'Permis de conduire',
  catIban: 'IBAN',
  catCreditCard: 'Carte de crédit',
  catPhone: 'Téléphone',
  catPassport: 'Passeport',
  catSsn: 'Sécurité sociale',
  catPersonName: 'Nom/Prénom',
  catAddress: 'Adresse',
  catBlacklist: 'Liste noire',
}

const de: TranslationKeys = {
  subtitle: 'Privacy-First Sanitizer',
  matchSingular: 'sensibles Datum gefunden',
  matchPlural: 'sensible Daten gefunden',
  scrubbed: 'Bereinigt',
  zeroKnowledge: 'Zero-Knowledge',

  scanLevels: 'Scan-Stufen',
  outputMode: 'Ausgabemodus',
  whitelistTitle: 'Whitelist (Ausnahmen)',

  levelNetworkLabel: 'Netzwerk & Technik',
  levelNetworkSub: 'IP, MAC, E-Mail, URL',
  levelNetworkTip: 'Erkennt IPv4/IPv6-Adressen, MAC-Adressen, E-Mails und URLs im Text',
  levelSecretsLabel: 'Geheimnisse & Sicherheit',
  levelSecretsSub: 'API-Schlüssel, JWT, Hash, Passwort',
  levelSecretsTip: 'Erkennt API-Schlüssel (OpenAI, AWS, Google, GitHub, Stripe...), JWT-Tokens, kryptografische Hashes und Passwörter in Konfigurationsdateien',
  levelDocumentsLabel: 'Dokumente & Identität',
  levelDocumentsSub: 'Steuer-ID, Kennzeichen, USt, IBAN, Namen, Adressen',
  levelDocumentsTip: 'Erkennt Steuer-IDs, Kennzeichen, USt-Nummern, IBANs, Kreditkarten, Telefonnummern, Führerscheine, Reisepässe, Sozialversicherungsnummern, Personennamen und Adressen aus verschiedenen Ländern',

  outputBlockTip: 'Ersetzt sensible Daten durch undurchsichtige Blöcke (████), vollständige Schwärzung',
  outputFixedTip: 'Ersetzt durch einen generischen Platzhalter [REDACTED], gleich für jeden Datentyp',
  outputSemanticTip: 'Ersetzt durch ein beschreibendes Tag (z.B. [IP_ADDRESS], [API_KEY]), das den Kontext für das Debugging bewahrt',

  whitelistPlaceholder: 'z.B. localhost',
  whitelistEmpty: 'Keine Ausnahmen konfiguriert',

  blacklistTitle: 'Blacklist (erzwungen)',
  blacklistPlaceholder: 'z.B. password123',
  blacklistEmpty: 'Keine erzwungenen Begriffe konfiguriert',

  popupAddWhitelist: 'Whitelist',
  popupAddBlacklist: 'Blacklist',

  footerLine1: 'Keine Daten verlassen Ihren Browser.',
  footerLine2: '100% lokale Verarbeitung.',

  editorPlaceholder: 'Fügen Sie hier Ihre Logs, Code-Snippets oder beliebigen Text mit sensiblen Daten ein...',

  uploadFile: 'Datei laden',
  uploadLoading: 'Verarbeitung...',
  uploadError: 'Fehler beim Lesen der Datei',
  uploadUnsupported: 'Format nicht unterstützt. Verwende .docx oder .pdf',

  clear: 'Leeren',
  reset: 'Wiederherstellen',
  copy: 'Kopieren',
  copied: 'Kopiert!',
  scrubIt: 'Scrubb It',

  scanning: 'Scannen...',
  characters: 'Zeichen',

  catIpv4: 'IP-Adresse',
  catIpv6: 'IPv6-Adresse',
  catMac: 'MAC-Adresse',
  catEmail: 'E-Mail',
  catUrl: 'URL/Domain',
  catApiKey: 'API-Schlüssel',
  catJwt: 'JWT-Token',
  catPrivateKey: 'Privater Schlüssel',
  catHash: 'Hash',
  catPassword: 'Passwort',
  catLicensePlate: 'Kennzeichen',
  catFiscalCode: 'Steuer-ID',
  catVatNumber: 'USt-IdNr.',
  catIdCard: 'Personalausweis',
  catDriversLicense: 'Führerschein',
  catIban: 'IBAN',
  catCreditCard: 'Kreditkarte',
  catPhone: 'Telefonnummer',
  catPassport: 'Reisepass',
  catSsn: 'Sozialversicherung',
  catPersonName: 'Personenname',
  catAddress: 'Adresse',
  catBlacklist: 'Blacklist',
}

const es: TranslationKeys = {
  subtitle: 'Privacy-First Sanitizer',
  matchSingular: 'dato sensible encontrado',
  matchPlural: 'datos sensibles encontrados',
  scrubbed: 'Saneado',
  zeroKnowledge: 'Zero-Knowledge',

  scanLevels: 'Niveles de escaneo',
  outputMode: 'Modo de salida',
  whitelistTitle: 'Lista blanca (excepciones)',

  levelNetworkLabel: 'Red y Tecnología',
  levelNetworkSub: 'IP, MAC, Email, URL',
  levelNetworkTip: 'Detecta direcciones IPv4/IPv6, direcciones MAC, emails y URLs en el texto',
  levelSecretsLabel: 'Secretos y Seguridad',
  levelSecretsSub: 'Claves API, JWT, Hash, Contraseña',
  levelSecretsTip: 'Detecta claves API (OpenAI, AWS, Google, GitHub, Stripe...), tokens JWT, hashes criptográficos y contraseñas en archivos de configuración',
  levelDocumentsLabel: 'Documentos e Identidad',
  levelDocumentsSub: 'DNI, Matrículas, IVA, IBAN, Nombres, Direcciones',
  levelDocumentsTip: 'Detecta números fiscales, matrículas, números de IVA, IBAN, tarjetas de crédito, números de teléfono, permisos de conducir, pasaportes, números de seguridad social, nombres/apellidos y direcciones de varios países',

  outputBlockTip: 'Reemplaza los datos sensibles con bloques opacos (████), ocultación total',
  outputFixedTip: 'Reemplaza con un placeholder genérico [REDACTED], igual para cada tipo de dato',
  outputSemanticTip: 'Reemplaza con una etiqueta descriptiva (ej. [IP_ADDRESS], [API_KEY]) que preserva el contexto para depuración',

  whitelistPlaceholder: 'ej. localhost',
  whitelistEmpty: 'Ninguna excepción configurada',

  blacklistTitle: 'Lista negra (forzado)',
  blacklistPlaceholder: 'ej. password123',
  blacklistEmpty: 'Ningún término forzado configurado',

  popupAddWhitelist: 'Lista blanca',
  popupAddBlacklist: 'Lista negra',

  footerLine1: 'Ningún dato sale de tu navegador.',
  footerLine2: 'Procesamiento 100% local.',

  editorPlaceholder: 'Pega aquí tus logs, fragmentos de código o cualquier texto que contenga datos sensibles...',

  uploadFile: 'Cargar archivo',
  uploadLoading: 'Procesando...',
  uploadError: 'Error al leer el archivo',
  uploadUnsupported: 'Formato no soportado. Usa .docx o .pdf',

  clear: 'Limpiar',
  reset: 'Restaurar',
  copy: 'Copiar',
  copied: '¡Copiado!',
  scrubIt: 'Scrubb It',

  scanning: 'Escaneando...',
  characters: 'caracteres',

  catIpv4: 'Dirección IP',
  catIpv6: 'Dirección IPv6',
  catMac: 'Dirección MAC',
  catEmail: 'Email',
  catUrl: 'URL/Dominio',
  catApiKey: 'Clave API',
  catJwt: 'Token JWT',
  catPrivateKey: 'Clave Privada',
  catHash: 'Hash',
  catPassword: 'Contraseña',
  catLicensePlate: 'Matrícula',
  catFiscalCode: 'DNI / NIF',
  catVatNumber: 'Número de IVA',
  catIdCard: 'Documento de identidad',
  catDriversLicense: 'Permiso de conducir',
  catIban: 'IBAN',
  catCreditCard: 'Tarjeta de crédito',
  catPhone: 'Teléfono',
  catPassport: 'Pasaporte',
  catSsn: 'Seguridad Social',
  catPersonName: 'Nombre/Apellido',
  catAddress: 'Dirección',
  catBlacklist: 'Lista negra',
}

export const translations: Record<Locale, TranslationKeys> = { it, en, fr, de, es }

export const LOCALE_LABELS: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
}

export const LOCALES: Locale[] = ['it', 'en', 'fr', 'de', 'es']
