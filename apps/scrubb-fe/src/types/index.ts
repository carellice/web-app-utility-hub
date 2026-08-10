export type ScrubLevel = 'network' | 'secrets' | 'documents'

export type OutputMode = 'block' | 'fixed' | 'semantic'

export type MatchCategory =
  | 'ipv4'
  | 'ipv6'
  | 'mac'
  | 'email'
  | 'url'
  | 'api_key'
  | 'jwt'
  | 'private_key'
  | 'hash'
  | 'password'
  | 'license_plate'
  | 'fiscal_code'
  | 'vat_number'
  | 'id_card'
  | 'drivers_license'
  | 'iban'
  | 'credit_card'
  | 'phone'
  | 'passport'
  | 'ssn'
  | 'person_name'
  | 'address'
  | 'blacklist'

export interface SensitiveMatch {
  start: number
  end: number
  text: string
  category: MatchCategory
  level: ScrubLevel
}

export interface ScrubSettings {
  levels: ScrubLevel[]
  outputMode: OutputMode
  whitelist: string[]
}

import type { TranslationKeys } from '../i18n'

// Mappa categoria -> chiave i18n per le label
export const CATEGORY_I18N_KEYS: Record<MatchCategory, keyof TranslationKeys> = {
  ipv4: 'catIpv4',
  ipv6: 'catIpv6',
  mac: 'catMac',
  email: 'catEmail',
  url: 'catUrl',
  api_key: 'catApiKey',
  jwt: 'catJwt',
  private_key: 'catPrivateKey',
  hash: 'catHash',
  password: 'catPassword',
  license_plate: 'catLicensePlate',
  fiscal_code: 'catFiscalCode',
  vat_number: 'catVatNumber',
  id_card: 'catIdCard',
  drivers_license: 'catDriversLicense',
  iban: 'catIban',
  credit_card: 'catCreditCard',
  phone: 'catPhone',
  passport: 'catPassport',
  ssn: 'catSsn',
  person_name: 'catPersonName',
  address: 'catAddress',
  blacklist: 'catBlacklist',
}

export const CATEGORY_COLORS: Record<MatchCategory, string> = {
  ipv4: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  ipv6: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  mac: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  email: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  url: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  api_key: 'bg-red-500/20 border-red-500/40 text-red-300',
  jwt: 'bg-red-500/20 border-red-500/40 text-red-300',
  private_key: 'bg-red-500/20 border-red-500/40 text-red-300',
  hash: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  password: 'bg-red-500/20 border-red-500/40 text-red-300',
  license_plate: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  fiscal_code: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  vat_number: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  id_card: 'bg-teal-500/20 border-teal-500/40 text-teal-300',
  drivers_license: 'bg-teal-500/20 border-teal-500/40 text-teal-300',
  iban: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  credit_card: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  phone: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  passport: 'bg-teal-500/20 border-teal-500/40 text-teal-300',
  ssn: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  person_name: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
  address: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  blacklist: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300',
}

export const SEMANTIC_LABELS: Record<MatchCategory, string> = {
  ipv4: '[IP_ADDRESS]',
  ipv6: '[IPV6_ADDRESS]',
  mac: '[MAC_ADDRESS]',
  email: '[EMAIL]',
  url: '[URL]',
  api_key: '[API_KEY]',
  jwt: '[JWT_TOKEN]',
  private_key: '[PRIVATE_KEY]',
  hash: '[HASH]',
  password: '[PASSWORD]',
  license_plate: '[LICENSE_PLATE]',
  fiscal_code: '[FISCAL_CODE]',
  vat_number: '[VAT_NUMBER]',
  id_card: '[ID_CARD]',
  drivers_license: '[DRIVERS_LICENSE]',
  iban: '[IBAN]',
  credit_card: '[CREDIT_CARD]',
  phone: '[PHONE]',
  passport: '[PASSPORT]',
  ssn: '[SSN]',
  person_name: '[PERSON_NAME]',
  address: '[ADDRESS]',
  blacklist: '[BLACKLISTED]',
}
