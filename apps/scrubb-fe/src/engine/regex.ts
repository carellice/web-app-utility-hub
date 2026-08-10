import type { SensitiveMatch, MatchCategory, ScrubLevel } from '../types'

interface PatternDef {
  regex: RegExp
  category: MatchCategory
  level: ScrubLevel
}

// ─── LIVELLO 1: Network & Tech ───────────────────────────────────────────────

const NETWORK_PATTERNS: PatternDef[] = [
  {
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
    category: 'ipv4',
    level: 'network',
  },
  {
    regex: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    category: 'ipv6',
    level: 'network',
  },
  {
    regex: /\b(?:[0-9a-fA-F]{1,4}:){1,7}:(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{0,4}\b/g,
    category: 'ipv6',
    level: 'network',
  },
  {
    regex: /\b[0-9a-fA-F]{2}(?::[0-9a-fA-F]{2}){5}\b/g,
    category: 'mac',
    level: 'network',
  },
  {
    regex: /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g,
    category: 'email',
    level: 'network',
  },
  {
    regex: /https?:\/\/[^\s"'<>)\]]+/g,
    category: 'url',
    level: 'network',
  },
]

// ─── LIVELLO 2: Secrets & Security ───────────────────────────────────────────

const SECRET_PATTERNS: PatternDef[] = [
  // OpenAI
  {
    regex: /\bsk[-_](?:live|test|proj)[-_][a-zA-Z0-9]{20,}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // AWS
  {
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // Google
  {
    regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // GitHub
  {
    regex: /\bghp_[a-zA-Z0-9]{36}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // GitLab
  {
    regex: /\bglpat-[a-zA-Z0-9\-_]{20,}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // Slack
  {
    regex: /\bxox[bpsa]-[a-zA-Z0-9\-]{10,}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // Stripe
  {
    regex: /\b[sr]k_live_[a-zA-Z0-9]{20,}\b/g,
    category: 'api_key',
    level: 'secrets',
  },
  // Generico api_key=... / api_secret=...
  {
    regex: /\b(?:api[_\-]?key|apikey|api[_\-]?secret|api[_\-]?token)\s*[:=]\s*["']?([a-zA-Z0-9\-_]{16,})["']?/gi,
    category: 'api_key',
    level: 'secrets',
  },
  // JWT
  {
    regex: /\beyJ[a-zA-Z0-9\-_]+\.eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_.+/=]+\b/g,
    category: 'jwt',
    level: 'secrets',
  },
  // Private Keys (PEM)
  {
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    category: 'private_key',
    level: 'secrets',
  },
  // SSH Public Keys
  {
    regex: /\bssh-(?:rsa|ed25519|dss)\s+[A-Za-z0-9+/=]{40,}/g,
    category: 'private_key',
    level: 'secrets',
  },
  // SHA-256
  {
    regex: /\b[a-f0-9]{64}\b/g,
    category: 'hash',
    level: 'secrets',
  },
  // SHA-1
  {
    regex: /\b[a-f0-9]{40}\b/g,
    category: 'hash',
    level: 'secrets',
  },
  // MD5
  {
    regex: /\b[a-f0-9]{32}\b/g,
    category: 'hash',
    level: 'secrets',
  },
  // Password in config
  {
    regex: /\b(?:password|passwd|pwd)\s*[:=]\s*["']?([^\s"']{4,})["']?/gi,
    category: 'password',
    level: 'secrets',
  },
]

// ─── LIVELLO 3: Documents & Identity (International) ─────────────────────────

const DOCUMENT_PATTERNS: PatternDef[] = [

  // ── TARGHE / LICENSE PLATES ─────────────────────────────────────────────────

  // Italia - formato attuale (AA 000 AA) e vecchio (AA 000000)
  {
    regex: /\b[A-Z]{2}\s?\d{3}\s?[A-Z]{2}\b/gi,
    category: 'license_plate',
    level: 'documents',
  },
  {
    regex: /\b[A-Z]{2}\s?\d{6}\b/gi,
    category: 'license_plate',
    level: 'documents',
  },
  // Italia - moto (AA 00000)
  {
    regex: /\b[A-Z]{2}\s?\d{5}\b/gi,
    category: 'license_plate',
    level: 'documents',
  },
  // Germania (B AB 1234, M X 1, HH AB 123H)
  {
    regex: /\b[A-Z]{1,3}\s[A-Z]{1,2}\s\d{1,4}[HE]?\b/g,
    category: 'license_plate',
    level: 'documents',
  },
  // Francia - formato SIV (AA-123-AA)
  {
    regex: /\b[A-Z]{2}-\d{3}-[A-Z]{2}\b/g,
    category: 'license_plate',
    level: 'documents',
  },
  // Spagna (1234 ABC - solo consonanti)
  {
    regex: /\b\d{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}\b/g,
    category: 'license_plate',
    level: 'documents',
  },
  // UK (AB12 CDE)
  {
    regex: /\b[A-Z]{2}\d{2}\s?[A-Z]{3}\b/gi,
    category: 'license_plate',
    level: 'documents',
  },
  // Olanda (formati con trattini: XX-99-XX, 99-XX-XX, ecc.)
  {
    regex: /\b(?:[A-Z]{2}-\d{2}-[A-Z]{2}|\d{2}-[A-Z]{2}-\d{2}|\d{2}-[A-Z]{3}-\d|[A-Z]-\d{3}-[A-Z]{2}|\d-[A-Z]{3}-\d{2}|[A-Z]{2}-\d{3}-[A-Z]|[A-Z]{3}-\d{2}-[A-Z])\b/g,
    category: 'license_plate',
    level: 'documents',
  },
  // Polonia (WA 12345, KR 1AB23)
  {
    regex: /\b[A-Z]{2,3}\s\d{4,5}\b/g,
    category: 'license_plate',
    level: 'documents',
  },
  {
    regex: /\b[A-Z]{2,3}\s\d{1,2}[A-Z]{1,3}\d{1,2}\b/g,
    category: 'license_plate',
    level: 'documents',
  },

  // ── CODICI FISCALI / TAX IDs ────────────────────────────────────────────────

  // Italia - Codice Fiscale (16 caratteri)
  {
    regex: /\b[A-Z]{6}\d{2}[A-EHLMPRST]\d{2}[A-Z]\d{3}[A-Z]\b/gi,
    category: 'fiscal_code',
    level: 'documents',
  },
  // US - Social Security Number (XXX-XX-XXXX)
  {
    regex: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g,
    category: 'fiscal_code',
    level: 'documents',
  },
  // UK - National Insurance Number (AB 12 34 56 C)
  {
    regex: /\b(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/gi,
    category: 'fiscal_code',
    level: 'documents',
  },
  // Germania - Steuer-ID (context-dependent, 11 cifre)
  {
    regex: /\b(?:Steuer-?ID|IdNr|TIN)[:\s]+\d{11}\b/gi,
    category: 'fiscal_code',
    level: 'documents',
  },
  // Francia - NIR / INSEE (1 o 2 + 13 cifre + 2 cifre chiave)
  {
    regex: /\b[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}\b/g,
    category: 'fiscal_code',
    level: 'documents',
  },
  // Spagna - DNI (8 cifre + 1 lettera)
  {
    regex: /\b\d{8}[A-Z]\b/gi,
    category: 'fiscal_code',
    level: 'documents',
  },
  // Spagna - NIE (X/Y/Z + 7 cifre + 1 lettera)
  {
    regex: /\b[XYZ]\d{7}[A-Z]\b/gi,
    category: 'fiscal_code',
    level: 'documents',
  },

  // ── PARTITE IVA / VAT NUMBERS ──────────────────────────────────────────────

  // Italia (11 cifre, opzionale prefisso IT)
  {
    regex: /\bIT\d{11}\b/gi,
    category: 'vat_number',
    level: 'documents',
  },
  // Austria (ATU + 8 cifre)
  {
    regex: /\bATU\d{8}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Belgio (BE + 10 cifre)
  {
    regex: /\bBE[01]\d{9}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Germania (DE + 9 cifre)
  {
    regex: /\bDE\d{9}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Francia (FR + 2 alfanum + 9 cifre)
  {
    regex: /\bFR[A-Z0-9]{2}\d{9}\b/gi,
    category: 'vat_number',
    level: 'documents',
  },
  // Spagna (ES + vari formati)
  {
    regex: /\bES[A-Z]\d{7}[A-Z]\b/gi,
    category: 'vat_number',
    level: 'documents',
  },
  {
    regex: /\bES[A-Z]\d{8}\b/gi,
    category: 'vat_number',
    level: 'documents',
  },
  {
    regex: /\bES\d{8}[A-Z]\b/gi,
    category: 'vat_number',
    level: 'documents',
  },
  // UK (GB + 9 o 12 cifre)
  {
    regex: /\bGB\d{9}(?:\d{3})?\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  {
    regex: /\bGB(?:GD|HA)\d{3}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Olanda (NL + 9 cifre + B + 2 cifre)
  {
    regex: /\bNL\d{9}B\d{2}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Polonia (PL + 10 cifre)
  {
    regex: /\bPL\d{10}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Portogallo (PT + 9 cifre)
  {
    regex: /\bPT\d{9}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Romania (RO + 2-10 cifre)
  {
    regex: /\bRO\d{2,10}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Svezia (SE + 12 cifre)
  {
    regex: /\bSE\d{12}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Irlanda (IE + 7 cifre + 1-2 lettere)
  {
    regex: /\bIE\d{7}[A-Z]{1,2}\b/gi,
    category: 'vat_number',
    level: 'documents',
  },
  // Repubblica Ceca (CZ + 8-10 cifre)
  {
    regex: /\bCZ\d{8,10}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Danimarca (DK + 8 cifre)
  {
    regex: /\bDK\d{8}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Finlandia (FI + 8 cifre)
  {
    regex: /\bFI\d{8}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Grecia (EL + 9 cifre)
  {
    regex: /\bEL\d{9}\b/g,
    category: 'vat_number',
    level: 'documents',
  },
  // Ungheria (HU + 8 cifre)
  {
    regex: /\bHU\d{8}\b/g,
    category: 'vat_number',
    level: 'documents',
  },

  // ── DOCUMENTI D'IDENTITA' / ID CARDS ───────────────────────────────────────

  // Italia - CIE (2 lettere + 5 cifre + 2 lettere)
  {
    regex: /\b[A-Z]{2}\d{5}[A-Z]{2}\b/gi,
    category: 'id_card',
    level: 'documents',
  },
  // Germania - Personalausweis (context-dependent)
  {
    regex: /\b(?:Personalausweis|Ausweis(?:nummer)?|ID[-\s]?(?:Nr|Nummer))[:\s]+[A-Z0-9]{10}\b/gi,
    category: 'id_card',
    level: 'documents',
  },
  // Francia - CNI (context-dependent, 12 cifre)
  {
    regex: /\b(?:CNI|carte\s+d[''\u2019]identit[eé])[:\s]*\d{12}\b/gi,
    category: 'id_card',
    level: 'documents',
  },
  // Portogallo - Cartao de Cidadao
  {
    regex: /\b\d{8}\s?\d\s?[A-Z]{2}\d\b/gi,
    category: 'id_card',
    level: 'documents',
  },

  // ── PATENTI / DRIVER'S LICENSES ────────────────────────────────────────────

  // Italia (2 lettere + 7 cifre + 1 lettera)
  {
    regex: /\b[A-Z]{2}\d{7}[A-Z]\b/gi,
    category: 'drivers_license',
    level: 'documents',
  },
  // UK - DVLA (16 caratteri: 5 lettere + 6 cifre + 2 alfanum + 2 lettere + 1 alfanum)
  {
    regex: /\b[A-Z]{5}\d{6}[A-Z0-9]{2}[A-Z]{2}[A-Z0-9]\b/gi,
    category: 'drivers_license',
    level: 'documents',
  },
  // US - context-dependent
  {
    regex: /\b(?:driver'?s?\s*licen[cs]e|DL|D\.?L\.?)[\s#:]+[A-Z0-9]{5,15}\b/gi,
    category: 'drivers_license',
    level: 'documents',
  },
  // Germania - Fuhrerschein (context-dependent)
  {
    regex: /\b(?:F[uü]hrerschein(?:nummer)?|Fahrerlaubnis)[:\s]+[A-Z0-9]{8,12}\b/gi,
    category: 'drivers_license',
    level: 'documents',
  },
  // Francia - permis de conduire (context-dependent, 12 cifre)
  {
    regex: /\b(?:permis\s+de\s+conduire|permis)[:\s]+\d{12}\b/gi,
    category: 'drivers_license',
    level: 'documents',
  },

  // ── IBAN ────────────────────────────────────────────────────────────────────

  // Formato internazionale (15-34 caratteri alfanumerici)
  {
    regex: /\b[A-Z]{2}\d{2}\s?[A-Z0-9]{4}\s?(?:\d{4}\s?){2,7}\d{1,4}\b/gi,
    category: 'iban',
    level: 'documents',
  },

  // ── CARTE DI CREDITO / CREDIT CARDS ────────────────────────────────────────

  // Visa, Mastercard
  {
    regex: /\b(?:4\d{3}|5[1-5]\d{2})[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    category: 'credit_card',
    level: 'documents',
  },
  // Amex (15 cifre: 34xx o 37xx)
  {
    regex: /\b3[47]\d{2}[\s\-]?\d{6}[\s\-]?\d{5}\b/g,
    category: 'credit_card',
    level: 'documents',
  },
  // Discover (6011, 644-649, 65)
  {
    regex: /\b6(?:011|5\d{2}|4[4-9]\d)[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    category: 'credit_card',
    level: 'documents',
  },
  // JCB (3528-3589)
  {
    regex: /\b35(?:2[89]|[3-8]\d)[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    category: 'credit_card',
    level: 'documents',
  },
  // Diners Club (300-305, 36, 38 - 14 cifre)
  {
    regex: /\b3(?:0[0-5]|[68]\d)[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{2}\b/g,
    category: 'credit_card',
    level: 'documents',
  },

  // ── NUMERI DI TELEFONO / PHONE NUMBERS ─────────────────────────────────────

  // Italia - mobile
  {
    regex: /\b(?:\+39[\s\-]?)?3\d{2}[\s\-]?\d{3}[\s\-]?\d{4}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // Italia - fisso
  {
    regex: /\b(?:\+39[\s\-]?)?0\d{1,3}[\s\-]?\d{4,8}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // Internazionale generico (+CC XXXXXXXXX)
  {
    regex: /\b\+[1-9]\d{0,2}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{2,4}[\s\-]?\d{2,4}[\s\-]?\d{0,4}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // US/Canada - (XXX) XXX-XXXX
  {
    regex: /\(?[2-9]\d{2}\)[\s\-]?\d{3}[\s\-]\d{4}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // US/Canada - XXX-XXX-XXXX o XXX.XXX.XXXX
  {
    regex: /\b[2-9]\d{2}[\-\.]\d{3}[\-\.]\d{4}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // UK - fisso (0XX XXXX XXXX)
  {
    regex: /\b0[12]\d[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // UK - mobile (07XXX XXXXXX)
  {
    regex: /\b07\d{3}[\s\-]?\d{6}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // Francia (0X XX XX XX XX)
  {
    regex: /\b0[1-9](?:[\s.\-]?\d{2}){4}\b/g,
    category: 'phone',
    level: 'documents',
  },
  // Spagna (6XX XXX XXX o 9XX XXX XXX)
  {
    regex: /\b[69]\d{2}[\s\-]?\d{3}[\s\-]?\d{3}\b/g,
    category: 'phone',
    level: 'documents',
  },

  // ── PASSAPORTI / PASSPORTS ─────────────────────────────────────────────────

  // Italia (2 lettere + 7 cifre)
  {
    regex: /\b[A-Z]{2}\d{7}\b/gi,
    category: 'passport',
    level: 'documents',
  },
  // Generico internazionale (context-dependent)
  {
    regex: /\b(?:passport|passeport|passaporto|reisepass|pasaporte)[\s\-]*(?:no|number|nr|num|#|n\.)?[:\s]+[A-Z0-9]{6,10}\b/gi,
    category: 'passport',
    level: 'documents',
  },

  // ── PREVIDENZA SOCIALE / SSN ───────────────────────────────────────────────

  // Italia - Tessera sanitaria (20 cifre, inizia con 80380)
  {
    regex: /\b80380\d{15}\b/g,
    category: 'ssn',
    level: 'documents',
  },

  // ── NOMI / PERSON NAMES (context-dependent) ────────────────────────────────

  // IT - Etichette campo
  {
    regex: /(?:Nome e Cognome|Cognome e Nome|Nome|Cognome|Intestatario|Destinatario|Mittente):\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // IT - Titoli onorifici
  {
    regex: /(?:Sig\.ra|Sig\.|Dott\.ssa|Dott\.|Avv\.|Ing\.|Prof\.ssa|Prof\.)\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // EN - Etichette campo
  {
    regex: /(?:Full Name|Name|Attn):\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // EN - Titoli onorifici
  {
    regex: /(?:Mrs\.|Mr\.|Ms\.|Dr\.)\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // FR - Etichette campo
  {
    regex: /(?:Nom|Prénom):\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // FR - Titoli onorifici
  {
    regex: /(?:Mlle|Mme|M\.)\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // DE - Etichette campo
  {
    regex: /(?:Vorname|Nachname|Name):\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // DE - Titoli onorifici
  {
    regex: /(?:Herr|Frau)\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // ES - Etichette campo
  {
    regex: /(?:Nombre|Apellido):\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // ES - Titoli onorifici
  {
    regex: /(?:Sra\.|Sr\.)\s+(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}/g,
    category: 'person_name',
    level: 'documents',
  },
  // Standalone - 2-4 parole con iniziale maiuscola o tutto maiuscolo (senza contesto)
  {
    regex: /\b(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})(?:\s(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}|[A-ZÀ-ÖØ-Ý]{2,})){1,3}\b/g,
    category: 'person_name',
    level: 'documents',
  },

  // ── INDIRIZZI / ADDRESSES (keyword-based) ─────────────────────────────────

  // IT - Via, Piazza, Corso, ecc. + nome via + numero civico opzionale
  {
    regex: /(?:Via|Viale|V\.le|Piazza|P\.zza|Piazzale|Corso|C\.so|Largo|Vicolo|Strada|Contrada|Località|Borgata|Traversa)\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s(?:dei|del|della|delle|degli|di|d'|[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,})){0,4}(?:[,\s]+\d{1,5}(?:\/[A-Za-z])?)?/g,
    category: 'address',
    level: 'documents',
  },
  // EN - numero civico + tipo strada
  {
    regex: /\b\d{1,5}\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}){0,3}\s+(?:Street|St\.|Avenue|Ave\.|Boulevard|Blvd\.|Road|Rd\.|Drive|Dr\.|Lane|Ln\.|Court|Ct\.|Place|Pl\.)\b/g,
    category: 'address',
    level: 'documents',
  },
  // FR - Rue, Avenue, Boulevard, ecc.
  {
    regex: /(?:Rue|Avenue|Boulevard|Bd\.|Place|Allée|Impasse|Chemin|Passage)\s+(?:de\s+la\s+|du\s+|des\s+|de\s+l[''\u2019]|d[''\u2019]|de\s+)?[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}){0,3}(?:[,\s]+\d{1,5})?/g,
    category: 'address',
    level: 'documents',
  },
  // DE - Straße, Gasse, Weg, ecc. (sia prefisso che suffisso: Hauptstraße 12)
  {
    regex: /(?:Straße|Str\.|Gasse|Weg|Platz|Allee|Ring)\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}){0,3}(?:\s+\d{1,5}[a-z]?)?/g,
    category: 'address',
    level: 'documents',
  },
  // DE - composte (Hauptstraße, Berliner Allee, ecc.)
  {
    regex: /\b[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{2,}(?:straße|str\.|gasse|weg|platz|allee|ring)\s+\d{1,5}[a-z]?\b/gi,
    category: 'address',
    level: 'documents',
  },
  // ES - Calle, Avenida, Plaza, ecc.
  {
    regex: /(?:Calle|C\.|Avenida|Avda\.|Plaza|Paseo|Camino|Carretera)\s+(?:de\s+la\s+|del\s+|de\s+los\s+|de\s+)?[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}){0,3}(?:[,\s]+\d{1,5})?/g,
    category: 'address',
    level: 'documents',
  },
]

// ─── Motore di analisi ───────────────────────────────────────────────────────

function findMatches(text: string, patterns: PatternDef[]): SensitiveMatch[] {
  const results: SensitiveMatch[] = []

  for (const { regex, category, level } of patterns) {
    const pattern = new RegExp(regex.source, regex.flags)
    let match: RegExpExecArray | null

    while ((match = pattern.exec(text)) !== null) {
      results.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        category,
        level,
      })
    }
  }

  return results
}

function isWhitelisted(matchText: string, whitelist: string[]): boolean {
  const lower = matchText.toLowerCase()
  return whitelist.some(term => {
    const lowerTerm = term.toLowerCase()
    return lower.includes(lowerTerm) || lowerTerm.includes(lower)
  })
}

function removeOverlaps(matches: SensitiveMatch[]): SensitiveMatch[] {
  if (matches.length === 0) return []

  // Ordina per posizione e, a parita', per lunghezza decrescente
  const sorted = [...matches].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    return (b.end - b.start) - (a.end - a.start)
  })

  const merged: SensitiveMatch[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    const last = merged[merged.length - 1]

    if (current.start >= last.end) {
      merged.push(current)
    }
  }

  return merged
}

function findBlacklistMatches(text: string, blacklist: string[]): SensitiveMatch[] {
  const results: SensitiveMatch[] = []

  for (const term of blacklist) {
    let pos = 0

    while ((pos = text.indexOf(term, pos)) !== -1) {
      results.push({
        start: pos,
        end: pos + term.length,
        text: text.slice(pos, pos + term.length),
        category: 'blacklist',
        level: 'documents',
      })
      pos += term.length
    }
  }

  return results
}

export function analyzeText(
  text: string,
  levels: Set<string>,
  whitelist: string[],
  blacklist: string[] = []
): SensitiveMatch[] {
  let allMatches: SensitiveMatch[] = []

  if (levels.has('network')) {
    allMatches = allMatches.concat(findMatches(text, NETWORK_PATTERNS))
  }

  if (levels.has('secrets')) {
    allMatches = allMatches.concat(findMatches(text, SECRET_PATTERNS))
  }

  if (levels.has('documents')) {
    allMatches = allMatches.concat(findMatches(text, DOCUMENT_PATTERNS))
  }

  if (whitelist.length > 0) {
    allMatches = allMatches.filter(m => !isWhitelisted(m.text, whitelist))
  }

  if (blacklist.length > 0) {
    allMatches = allMatches.concat(findBlacklistMatches(text, blacklist))
  }

  return removeOverlaps(allMatches)
}
