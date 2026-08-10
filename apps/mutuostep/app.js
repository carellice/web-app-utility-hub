/* ============================================================
 * MutuoStep — PWA per l'acquisto della prima casa con mutuo
 * Vanilla JS SPA, mobile-first, offline-first.
 * ============================================================ */

/* ---------- Storage ---------- */
const STORAGE_KEY = 'mutuostep:v1';
const defaultState = () => ({
  budget: {
    netMonthly: '',
    existingLoans: '',
    age: '',
    isee: '',
    propertyPrice: '',
    cadastralValue: '',
    hasAgency: true,
    years: 25,
    rateType: 'fisso',     // 'fisso' | 'variabile'
    customRate: ''         // % annuo override (se vuoto, usa default)
  },
  roadmap: {
    open: null,
    done: {}   // { [stepId]: true }
  },
  visite: {
    current: emptyVisita(),
    salvate: []  // [{id, nome, data, checks, note}]
  },
  wallet: {}, // { [docId]: true }
  liveRates: null,  // { fisso, variabile, asOf, source, fetchedAt, ok }
  budgetScenarios: [] // [{ id, nome, salvatoIl, budget }]
});

function emptyVisita() {
  return {
    nome: '',
    indirizzo: '',
    data: '',
    note: '',
    checks: {} // { [itemId]: true }
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const def = defaultState();
    // deep-merge livello 1 per supportare l'aggiunta di nuovi campi
    return {
      ...def,
      ...parsed,
      budget:  { ...def.budget,  ...(parsed.budget  || {}) },
      roadmap: { ...def.roadmap, ...(parsed.roadmap || {}) },
      visite:  { ...def.visite,  ...(parsed.visite  || {}) },
      wallet:  { ...def.wallet,  ...(parsed.wallet  || {}) }
    };
  } catch {
    return defaultState();
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

/* ---------- Utils ---------- */
const fmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
const num = (v) => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- Tassi medi di mercato (mutuo prima casa, Italia) ----------
   Valori di fallback usati se la fetch live fallisce o è offline. */
const DEFAULT_RATES = {
  fisso:     { value: 3.50, label: 'TAN medio fisso (>10 anni)' },
  variabile: { value: 3.10, label: 'TAN medio variabile (≤1 anno)' },
  asOf: 'stima'
};

/* ---------- Live rates: ECB Statistical Data Warehouse ----------
   Dataset MIR (MFI Interest Rates), nuove erogazioni mutui prima casa, Italia.
   Serie verificate via curl (apr 2026):
     fisso     → MIR/M.IT.B.A2C.P.R.A.2250.EUR.N  (rate fixation > 10y)
     variabile → MIR/M.IT.B.A2C.F.R.A.2250.EUR.N  (floating o ≤ 1y)
   CORS abilitato (Access-Control-Allow-Origin: *), nessuna API key.
   Pubblicazione mensile con ~1-2 mesi di ritardo. */
const ECB_BASE = 'https://data-api.ecb.europa.eu/service/data';
const ECB_RATE_SERIES = {
  fisso:     'MIR/M.IT.B.A2C.P.R.A.2250.EUR.N',
  variabile: 'MIR/M.IT.B.A2C.F.R.A.2250.EUR.N'
};
const RATE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 ore
const ITA_MONTHS = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];

function formatEcbPeriod(period) {
  // input "2026-02" → "feb 2026"
  if (!period || !/^\d{4}-\d{2}$/.test(period)) return period || '—';
  const [y, m] = period.split('-');
  return `${ITA_MONTHS[parseInt(m,10) - 1]} ${y}`;
}

async function fetchECBSeries(seriesPath, signal) {
  const url = `${ECB_BASE}/${seriesPath}?lastNObservations=1&format=jsondata`;
  const res = await fetch(url, { signal, headers: { 'Accept': 'application/vnd.sdmx.data+json' } });
  if (!res.ok) throw new Error(`ECB HTTP ${res.status}`);
  const data = await res.json();
  const series = data?.dataSets?.[0]?.series;
  if (!series) throw new Error('ECB: payload senza series');
  const firstKey = Object.keys(series)[0];
  const observations = series[firstKey]?.observations || {};
  const obsKeys = Object.keys(observations);
  if (!obsKeys.length) throw new Error('ECB: nessuna observation');
  const lastIdx = obsKeys[obsKeys.length - 1];
  const value = observations[lastIdx][0];
  const periods = data?.structure?.dimensions?.observation?.[0]?.values || [];
  const period = periods[parseInt(lastIdx, 10)]?.id;
  if (!Number.isFinite(Number(value))) throw new Error('ECB: valore non numerico');
  return { value: Number(value), period };
}

async function fetchECBRates() {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 10000);
  try {
    const [fisso, variabile] = await Promise.all([
      fetchECBSeries(ECB_RATE_SERIES.fisso,     ctrl.signal),
      fetchECBSeries(ECB_RATE_SERIES.variabile, ctrl.signal)
    ]);
    return {
      fisso: fisso.value,
      variabile: variabile.value,
      asOf: fisso.period || variabile.period,
      source: 'BCE'
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshLiveRates(force = false) {
  const cached = state.liveRates;
  if (!force && cached?.ok && (Date.now() - cached.fetchedAt) < RATE_CACHE_TTL_MS) {
    return cached;
  }
  try {
    const ecb = await fetchECBRates();
    state.liveRates = { ...ecb, fetchedAt: Date.now(), ok: true };
  } catch (err) {
    state.liveRates = { ok: false, error: String(err.message || err), fetchedAt: Date.now() };
  }
  saveState();
  return state.liveRates;
}

/* Restituisce i tassi correnti: live se freschi e ok, altrimenti i default. */
function getCurrentRates() {
  const live = state.liveRates;
  const fresh = live?.ok && (Date.now() - live.fetchedAt) < RATE_CACHE_TTL_MS;
  if (fresh) {
    return {
      fisso: live.fisso,
      variabile: live.variabile,
      asOf: formatEcbPeriod(live.asOf),
      source: live.source || 'BCE',
      isLive: true
    };
  }
  return {
    fisso: DEFAULT_RATES.fisso.value,
    variabile: DEFAULT_RATES.variabile.value,
    asOf: 'stima',
    source: 'fallback',
    isLive: false
  };
}

/* ---------- Tooltip dei campi del calcolatore ---------- */
const TIPS = {
  netMonthly: 'Lo stipendio <b>netto</b> che ricevi in busta paga ogni mese. Le banche guardano questo, non il lordo. Se hai 13ª/14ª, divide il netto annuo per 12.',
  existingLoans: 'Somma delle <b>rate mensili</b> di prestiti già attivi (auto, finanziamenti, cessione del quinto). Sottratte dalla sostenibilità perché incidono sulla tua capacità di rimborso.',
  age: 'Serve a verificare l\'eleggibilità all\'<b>Agevolazione Under 36</b>: se hai meno di 36 anni puoi accedere al Fondo di Garanzia Consap che copre fino al 100% del valore dell\'immobile.',
  isee: 'L\'<b>Indicatore della Situazione Economica Equivalente</b> certifica la situazione del tuo nucleo familiare. Soglia di 40.000 € per accedere all\'Under 36 / Consap. Lo richiedi gratis al CAF o INPS.',
  propertyPrice: 'Il prezzo di compravendita dell\'immobile (quello che paghi al venditore). I costi accessori — tasse, notaio, agenzia — sono <b>aggiuntivi</b> e li calcoliamo separatamente.',
  cadastralValue: 'Valore fiscale dell\'immobile usato per calcolare l\'Imposta di Registro. Si ottiene da: <b>rendita catastale × 115,5</b> (prima casa). Lo trovi sulla visura catastale. Se vuoto, stimato al 55% del prezzo.',
  hasAgency: 'Se trovi casa privatamente o tramite un\'asta, puoi disattivare la commissione (tipicamente 2–3% + IVA). Negoziabile sulle case più costose.',
  years: 'La <b>durata del mutuo</b>. Più anni = rata più bassa ma interessi totali più alti. Range tipico: 20–30 anni. Per Under 36 spesso disponibile fino a 40 anni.',
  rateType: '<b>Fisso</b>: la rata non cambia mai per tutta la durata. Sicurezza ma meno flessibilità.<br><b>Variabile</b>: la rata segue l\'Euribor. Inizialmente più bassa ma può salire. Indicato se prevedi di estinguere prima.',
  customRate: 'Il <b>TAN</b> (Tasso Annuo Nominale) che ti propone la banca. Se non hai un preventivo, lascia il default (medie di mercato aggiornate). Sostituisci col TAN del tuo preventivo per una stima precisa.'
};

/* ---------- Tooltip per le voci di costo accessorie ---------- */
const COST_TIPS = {
  registro: 'Tassa pagata allo <b>Stato</b> per il trasferimento di proprietà, versata al notaio durante il rogito. Per la <b>prima casa</b> è il 2% del valore catastale (regime agevolato); per la seconda casa sale al 9% del prezzo dichiarato. Pagamento <b>una tantum</b> al rogito.',
  notaio: 'Il <b>notaio</b> autentica l\'atto di compravendita e quello di mutuo, esegue tutte le visure (ipotecarie, catastali, urbanistiche) e versa le imposte allo Stato. L\'onorario varia in base al valore dell\'immobile e all\'importo del mutuo. La cifra include anche imposta ipotecaria (€50) e catastale (€50) per la prima casa.',
  agenzia: 'La <b>provvigione</b> per l\'agenzia immobiliare che ti ha mostrato la casa, in genere il 2–3% del prezzo + IVA al 22%. Si versa di solito alla firma del compromesso. È <b>negoziabile</b>, soprattutto su immobili di valore elevato. Se compri da privato puoi disattivare la voce.',
  perizia: 'Il <b>perito</b> incaricato dalla banca visita l\'immobile e ne stima il valore di mercato. Importante: la banca eroga il mutuo in base al valore di <b>perizia</b> (di solito max 80%), non al prezzo che paghi! Se i due valori divergono, ti potrebbe servire più anticipo. Costo una tantum, a tuo carico.',
  istruttoria: 'Spese che la banca addebita per <b>valutare la richiesta di mutuo</b>, raccogliere la documentazione e predisporre il contratto. Calcolata in genere come 0,25–0,5% dell\'importo richiesto. Pagata <b>una tantum</b> alla stipula. Alcune banche la azzerano in promozioni Under 36.',
  assicurazione: 'Polizza <b>obbligatoria per legge</b> quando si stipula un mutuo. Copre i danni alla struttura dell\'immobile causati da incendio, scoppio o fulmine. Puoi sottoscriverla con la banca o (di solito conviene) con compagnie esterne. È un costo <b>annuale ricorrente</b>, qui mostriamo il primo anno.'
};

/* ---------- Roadmap data ---------- */
const ROADMAP = [
  {
    id: 'predelibera',
    title: 'Predelibera Bancaria',
    desc: 'Valutazione preliminare della capacità creditizia da parte della banca.',
    extra: 'Porta in banca buste paga, CUD/730 e estratti conto. La predelibera non è vincolante ma ti dà un\'idea reale del budget.'
  },
  {
    id: 'ricerca',
    title: 'Ricerca e Visite',
    desc: 'Consulta portali, agenzie e organizza i sopralluoghi.',
    extra: 'Usa la Checklist Visita di MutuoStep durante ogni sopralluogo per non dimenticare nulla.'
  },
  {
    id: 'proposta',
    title: 'Proposta d\'Acquisto',
    desc: 'Documento legale vincolante presentato al venditore.',
    chicche: [
      'Inserire SEMPRE la <b>clausola sospensiva</b> per il mutuo: se la banca non eroga, recuperi la caparra.',
      'Far rileggere l\'atto a un <b>notaio di tua fiducia</b>, non solo a quello dell\'agenzia.'
    ]
  },
  {
    id: 'compromesso',
    title: 'Compromesso (Preliminare)',
    desc: 'Versamento caparra (10–20% del prezzo). Registrazione obbligatoria entro 20 giorni.',
    extra: 'Costo registrazione: imposta fissa €200 + 0,5% sulla caparra confirmatoria.'
  },
  {
    id: 'perizia',
    title: 'Perizia e Delibera',
    desc: 'Il perito della banca valuta l\'immobile e si arriva alla delibera definitiva del mutuo.',
    extra: 'La banca eroga in genere fino all\'80% del valore di perizia (100% se Under 36/Consap).'
  },
  {
    id: 'rogito',
    title: 'Rogito',
    desc: 'Atto notarile finale di compravendita. Consegna delle chiavi.',
    extra: 'Porta documento d\'identità, codice fiscale, conferma fondi e copia del compromesso.'
  }
];

/* ---------- Checklist visita data ---------- */
const VISITA = [
  {
    section: 'Aspetti Tecnici',
    items: [
      { id: 'umidita', text: 'Presenza di umidità, macchie o crepe nei muri portanti' },
      { id: 'tetto', text: 'Stato del tetto (soprattutto ultimi piani)' },
      { id: 'infissi', text: 'Infissi: doppio vetro e isolamento' },
      { id: 'impianti', text: 'Data installazione impianto elettrico e idraulico' },
      { id: 'ape', text: 'Classe energetica (APE)' }
    ]
  },
  {
    section: 'Domande Strategiche',
    items: [
      { id: 'bollette', text: 'Chiedere al proprietario l\'importo medio delle bollette' },
      { id: 'spese-straord', text: 'Chiedere se sono previste spese straordinarie condominiali' },
      { id: 'esposizione', text: 'Verificare l\'esposizione solare nelle diverse ore del giorno' }
    ]
  },
  {
    section: 'Verifiche Burocratiche',
    items: [
      { id: 'planimetria', text: 'Corrispondenza planimetria catastale con lo stato reale (no abusi)' },
      { id: 'servitu', text: 'Verifica presenza di servitù o diritti di terzi' }
    ]
  }
];

/* ---------- Wallet documenti ---------- */
const WALLET_DOCS = [
  { id: 'idfiscale', title: 'Carta d\'identità e Codice Fiscale', desc: 'Documento di identità in corso di validità + tessera sanitaria.' },
  { id: 'buste', title: 'Ultime 3 buste paga', desc: 'O Modello Unico se sei lavoratore autonomo / P.IVA.' },
  { id: 'cud', title: 'CUD / 730 ultimi 2 anni', desc: 'Modello unico dei redditi degli ultimi due esercizi.' },
  { id: 'estratti', title: 'Estratti conto ultimi 3-6 mesi', desc: 'Tutti i conti correnti intestati al richiedente.' },
  { id: 'proposta', title: 'Proposta d\'acquisto o Compromesso', desc: 'Documento firmato da venditore e acquirente.' },
  { id: 'visura', title: 'Visura catastale e planimetria', desc: 'Recuperabili dall\'agenzia, dal notaio o dal portale Agenzia delle Entrate.' }
];

/* ---------- Red flags ---------- */
const RED_FLAGS = [
  { title: 'Eccessiva fretta', desc: 'Perché il venditore vuole chiudere subito? Spesso nasconde problemi che teme emergano con verifiche approfondite.' },
  { title: 'Prezzo fuori mercato', desc: 'Se è troppo basso rispetto alla zona, sospetta un vizio nascosto: contenziosi condominiali, servitù, abusi edilizi.' },
  { title: 'Donazioni', desc: 'Se la casa proviene da una donazione, ci sono rischi legali con futuri eredi. Le banche spesso non concedono mutuo senza polizze specifiche.' },
  { title: 'Abusi Edilizi', desc: 'Anche una semplice parete spostata o una veranda non dichiarata diventa una tua responsabilità dopo l\'acquisto. Verifica sempre la planimetria.' }
];

/* ---------- Costi accessori ---------- */
const COSTI = [
  { voce: 'Imposta di Registro (Prima Casa)', stima: '2% valore catastale' },
  { voce: 'Notaio (Compravendita + Mutuo)', stima: '€2.500 – €5.000' },
  { voce: 'Agenzia Immobiliare', stima: '2% – 3% del prezzo (+ IVA)' },
  { voce: 'Perizia Bancaria', stima: '€200 – €500' },
  { voce: 'Istruttoria Mutuo', stima: '€500 – €1.500' },
  { voce: 'Assicurazione Incendio/Scoppio', stima: '€150 – €400 / anno' }
];

/* ============================================================
 * Routing
 * ============================================================ */
const ROUTES = {
  '/home': renderHome,
  '/budget': renderBudget,
  '/roadmap': renderRoadmap,
  '/altro': renderAltro,
  '/visita': renderVisita,
  '/wallet': renderWallet,
  '/costi': renderCosti,
  '/redflags': renderRedFlags
};

/* Mapping route → tab attivo della bottom nav.
   Le sotto-pagine sotto "Altro" mantengono attivo quel tab. */
const NAV_TAB_FOR_ROUTE = {
  '/home': 'home',
  '/budget': 'budget',
  '/roadmap': 'roadmap',
  '/altro': 'altro',
  '/visita': 'altro',
  '/wallet': 'altro',
  '/costi': 'altro',
  '/redflags': 'altro'
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, '');
  return ROUTES[hash] ? hash : '/home';
}

function navigate(route) {
  if (location.hash !== '#' + route) location.hash = '#' + route;
  else render();
}

function render() {
  const route = currentRoute();
  const view = document.getElementById('view');
  view.innerHTML = '';
  ROUTES[route](view);
  // sync bottom nav (le sotto-pagine di "Altro" tengono attivo il tab Altro)
  const activeTab = NAV_TAB_FOR_ROUTE[route] || 'home';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-tab') === activeTab);
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

/* ============================================================
 * Modulo Home (Dashboard)
 * ============================================================ */
function renderHome(view) {
  const totalSteps = ROADMAP.length;
  const doneSteps = Object.values(state.roadmap.done).filter(Boolean).length;
  const pct = totalSteps ? Math.round(doneSteps / totalSteps * 100) : 0;

  const totalDocs = WALLET_DOCS.length;
  const doneDocs = Object.values(state.wallet).filter(Boolean).length;

  const totalChecks = VISITA.reduce((acc, s) => acc + s.items.length, 0);
  const doneChecks = Object.values(state.visite.current.checks).filter(Boolean).length;

  view.innerHTML = `
    <section class="hero">
      <h1>Ciao 👋</h1>
      <p>Stai costruendo il tuo percorso verso la prima casa. Procedi un passo alla volta.</p>
      <div class="progress" aria-label="Progresso roadmap"><span style="width:${pct}%"></span></div>
      <div class="progress-meta">
        <span>Roadmap mutuo</span>
        <span>${doneSteps} / ${totalSteps} fasi</span>
      </div>
    </section>

    <h2>Strumenti</h2>
    <div class="tiles">
      <a class="tile" href="#/budget">
        <span class="icon">€</span>
        <span class="title">Calcolatore Budget</span>
        <span class="desc">Quanto puoi davvero spendere?</span>
      </a>
      <a class="tile" href="#/roadmap">
        <span class="icon">①</span>
        <span class="title">Roadmap mutuo</span>
        <span class="desc">${doneSteps} di ${totalSteps} completate</span>
      </a>
      <a class="tile" href="#/visita">
        <span class="icon">⌂</span>
        <span class="title">Checklist visita</span>
        <span class="desc">${doneChecks}/${totalChecks} controlli</span>
      </a>
      <a class="tile" href="#/wallet">
        <span class="icon">▤</span>
        <span class="title">Wallet documenti</span>
        <span class="desc">${doneDocs}/${totalDocs} pronti</span>
      </a>
      <a class="tile" href="#/costi">
        <span class="icon">∑</span>
        <span class="title">Costi accessori</span>
        <span class="desc">Tasse, notaio, agenzia</span>
      </a>
      <a class="tile" href="#/redflags">
        <span class="icon" style="background:var(--danger-soft);color:var(--danger)">!</span>
        <span class="title">Red Flags</span>
        <span class="desc">Segnali di pericolo</span>
      </a>
    </div>

    <h2>Suggerimento del giorno</h2>
    <div class="card">
      <div class="card-title"><span class="dot"></span>Clausola sospensiva</div>
      <p style="margin:0">Quando firmi la <b>proposta d'acquisto</b>, inserisci sempre la clausola sospensiva per la concessione del mutuo. Se la banca non eroga, ti restituiscono la caparra.</p>
    </div>
  `;
}

/* ============================================================
 * Modulo 1 — Calcolatore Budget e Fattibilità
 * ============================================================ */

/**
 * Calcola la breakdown dei costi accessori partendo dal prezzo
 * dell'immobile e dall'importo del mutuo richiesto.
 *
 * Le formule sono pratiche e basate sui range dichiarati nel
 * documento funzionale; restano stime indicative.
 */
function computeAccessoryCosts({ price, mortgage, hasAgency, cadastralValue }) {
  // Imposta di Registro (prima casa): 2% del valore catastale.
  // Se non specificato, fallback prudenziale: prezzo × 55%.
  const cadValue = cadastralValue > 0 ? cadastralValue : price * 0.55;
  const impostaRegistro = cadValue * 0.02;

  // Notaio (compravendita + mutuo): scalato sul prezzo, range €2.500 – €5.000.
  const notaio = Math.min(5000, Math.max(2500, price * 0.018));

  // Agenzia immobiliare: 2,5% + IVA 22%. Annullato se acquisto senza agenzia.
  const agenzia = hasAgency ? price * 0.025 * 1.22 : 0;

  // Perizia bancaria: stima fissa media sul range €200 – €500.
  const perizia = 350;

  // Istruttoria mutuo: 0,5% del mutuo, range €500 – €1.500.
  const istruttoria = mortgage > 0
    ? Math.min(1500, Math.max(500, mortgage * 0.005))
    : 750;

  // Assicurazione incendio/scoppio: stima 1° anno (poi ricorrente).
  const assicurazione = 250;

  const totale = impostaRegistro + notaio + agenzia + perizia + istruttoria + assicurazione;

  return {
    voci: [
      {
        id: 'registro',
        label: 'Imposta di Registro (prima casa)',
        formula: `2% di ${fmt.format(cadValue)}${cadastralValue > 0 ? '' : ' (stima 55% del prezzo)'}`,
        importo: impostaRegistro
      },
      {
        id: 'notaio',
        label: 'Notaio (compravendita + mutuo)',
        formula: 'stima nel range €2.500 – €5.000',
        importo: notaio
      },
      {
        id: 'agenzia',
        label: 'Agenzia immobiliare',
        formula: hasAgency ? '2,5% del prezzo + IVA 22%' : 'acquisto senza agenzia',
        importo: agenzia
      },
      {
        id: 'perizia',
        label: 'Perizia bancaria',
        formula: 'stima media (range €200 – €500)',
        importo: perizia
      },
      {
        id: 'istruttoria',
        label: 'Istruttoria mutuo',
        formula: '0,5% del mutuo (range €500 – €1.500)',
        importo: istruttoria
      },
      {
        id: 'assicurazione',
        label: 'Assicurazione incendio (1° anno)',
        formula: 'stima media (range €150 – €400/anno)',
        importo: assicurazione
      }
    ],
    totale
  };
}

/* ---------- Scenari Budget — save/load/delete ---------- */

/* Calcola un riassunto leggibile di uno snapshot budget (per la lista). */
function computeBudgetSummary(b) {
  const propertyPrice = num(b.propertyPrice);
  const years = +b.years || 25;
  const rateType = b.rateType || 'fisso';
  const rate = num(b.customRate) > 0 ? num(b.customRate) : DEFAULT_RATES[rateType].value;
  const age = num(b.age), isee = num(b.isee);
  const under36 = age > 0 && age < 36 && isee > 0 && isee < 40000;
  const ltv = under36 ? 1.00 : 0.80;
  const importoMutuo = propertyPrice > 0 ? propertyPrice * ltv : 0;
  const r = rate / 100 / 12;
  const months = years * 12;
  const ratamensile = importoMutuo > 0
    ? importoMutuo * (r * Math.pow(1+r, months)) / (Math.pow(1+r, months) - 1)
    : 0;
  return { ratamensile, propertyPrice, importoMutuo, years, rate, rateType, under36 };
}

function saveCurrentScenario() {
  const b = state.budget;
  if (num(b.netMonthly) <= 0) {
    toast('Inserisci almeno il reddito netto per salvare');
    return;
  }
  // "Congela" il tasso al valore correntemente usato, così lo scenario è
  // riproducibile anche se i tassi BCE cambiano in futuro.
  const snapshot = { ...b };
  if (!snapshot.customRate || num(snapshot.customRate) <= 0) {
    const r = getCurrentRates();
    const v = r[snapshot.rateType || 'fisso'];
    snapshot.customRate = v.toFixed(2).replace('.', ',');
  }

  const today = new Date().toLocaleDateString('it-IT');
  const defaultName = num(b.propertyPrice) > 0
    ? `Casa ${fmt.format(num(b.propertyPrice))} · ${b.years || 25} anni`
    : `Profilo del ${today}`;

  const name = prompt('Nome dello scenario:', defaultName);
  if (name === null) return;       // utente ha annullato
  const trimmed = name.trim();
  if (!trimmed) return;

  state.budgetScenarios = state.budgetScenarios || [];
  state.budgetScenarios.unshift({
    id: 'sc_' + Date.now(),
    nome: trimmed,
    salvatoIl: Date.now(),
    budget: snapshot
  });
  saveState();
  render();
  toast(`Scenario "${trimmed}" salvato`);
}

function loadScenario(id) {
  const sc = (state.budgetScenarios || []).find(x => x.id === id);
  if (!sc) return;
  if (!confirm(`Caricare lo scenario "${sc.nome}"?\nI dati attuali del form verranno sostituiti.`)) return;
  state.budget = { ...defaultState().budget, ...sc.budget };
  saveState();
  render();
  toast(`Scenario "${sc.nome}" caricato`);
}

function deleteScenario(id) {
  const sc = (state.budgetScenarios || []).find(x => x.id === id);
  if (!sc) return;
  if (!confirm(`Eliminare lo scenario "${sc.nome}"?`)) return;
  state.budgetScenarios = (state.budgetScenarios || []).filter(x => x.id !== id);
  saveState();
  render();
  toast('Scenario eliminato');
}

function renderScenariosListHTML(scenarios) {
  if (!scenarios.length) return '';
  return `
    <div class="section-card">
      <div class="section-head">
        <span class="icon-circle">⎙</span>
        <h2>Scenari salvati</h2>
        <span class="meta">${scenarios.length} ${scenarios.length === 1 ? 'scenario' : 'scenari'}</span>
      </div>
      <div class="scenarios-list">
        ${scenarios.map(sc => {
          const s = computeBudgetSummary(sc.budget);
          const dataFmt = new Date(sc.salvatoIl).toLocaleDateString('it-IT', { day:'numeric', month:'short', year:'numeric' });
          return `
            <div class="scenario-item">
              <div class="scenario-head">
                <div class="scenario-info">
                  <div class="scenario-name">${escapeHTML(sc.nome)}</div>
                  <div class="scenario-meta">salvato il ${dataFmt}</div>
                </div>
                ${s.ratamensile > 0 ? `
                  <div class="scenario-rata">
                    <div class="lbl">Rata</div>
                    <div class="val">${fmt.format(s.ratamensile)}<small> /m</small></div>
                  </div>
                ` : `
                  <div class="scenario-rata" style="background:var(--card);color:var(--muted);">
                    <div class="lbl">Profilo</div>
                    <div class="val" style="font-size:11px;font-weight:600;">finanziario</div>
                  </div>
                `}
              </div>
              ${s.propertyPrice > 0 ? `
                <div class="scenario-chips">
                  <span class="chip">⌂ ${fmt.format(s.propertyPrice)}</span>
                  <span class="chip">${s.years} anni</span>
                  <span class="chip">${s.rateType} ${s.rate.toFixed(2).replace('.', ',')}%</span>
                  ${s.under36 ? '<span class="chip" style="background:var(--success-soft);color:var(--success);border-color:rgba(34,197,94,.3);">Under 36</span>' : ''}
                </div>
              ` : ''}
              <div class="btn-row">
                <button class="btn secondary" data-load-scenario="${sc.id}">Carica</button>
                <button class="btn danger" data-del-scenario="${sc.id}">Elimina</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* Helper: campo con tooltip */
function fieldHTML({ id, label, tipKey, html, hideTip = false }) {
  const tipBtn = !hideTip && TIPS[tipKey || id]
    ? `<button type="button" class="tip-btn" data-tip="${tipKey || id}" aria-label="Maggiori info">i</button>`
    : '';
  const tipPop = !hideTip && TIPS[tipKey || id]
    ? `<div class="tip-pop" data-tip-pop="${tipKey || id}">${TIPS[tipKey || id]}</div>`
    : '';
  return `
    <div class="field">
      <div class="field-head">
        <label for="${id}">${label}</label>
        ${tipBtn}
      </div>
      ${tipPop}
      ${html}
    </div>
  `;
}

function renderBudget(view) {
  const b = state.budget;
  const rates = getCurrentRates();
  const currentRate = rates[b.rateType] ?? rates.fisso;

  view.innerHTML = `
    <h1>Calcolatore Budget</h1>
    <p class="subtitle">Inserisci i tuoi dati: applichiamo le logiche bancarie reali. Tocca <span class="tip-btn" style="display:inline-flex;width:16px;height:16px;font-size:10px;">i</span> accanto a un campo per leggere la spiegazione.</p>

    ${renderScenariosListHTML(state.budgetScenarios || [])}

    <!-- SEZIONE 1: LE TUE FINANZE -->
    <div class="section-card">
      <div class="section-head">
        <span class="icon-circle">€</span>
        <h2>Le tue finanze</h2>
      </div>

      ${fieldHTML({
        id: 'netMonthly',
        label: 'Reddito netto mensile',
        html: `<div class="with-suffix">
          <input id="netMonthly" type="number" inputmode="decimal" min="0" step="50" placeholder="es. 1.800" value="${b.netMonthly}">
          <span class="suffix">€ / mese</span>
        </div>`
      })}

      ${fieldHTML({
        id: 'existingLoans',
        label: 'Rate prestiti esistenti',
        html: `<div class="with-suffix">
          <input id="existingLoans" type="number" inputmode="decimal" min="0" step="10" placeholder="es. 150" value="${b.existingLoans}">
          <span class="suffix">€ / mese</span>
        </div>`
      })}

      ${fieldHTML({
        id: 'age',
        label: 'Età',
        html: `<div class="with-suffix">
          <input id="age" type="number" inputmode="numeric" min="18" max="100" step="1" placeholder="es. 30" value="${b.age}">
          <span class="suffix">anni</span>
        </div>`
      })}

      ${fieldHTML({
        id: 'isee',
        label: 'ISEE (per opzione Under 36)',
        html: `<div class="with-suffix">
          <input id="isee" type="number" inputmode="decimal" min="0" step="500" placeholder="es. 25.000" value="${b.isee}">
          <span class="suffix">€</span>
        </div>`
      })}
    </div>

    <!-- SEZIONE 2: L'IMMOBILE -->
    <div class="section-card">
      <div class="section-head">
        <span class="icon-circle">⌂</span>
        <h2>L'immobile</h2>
        <span class="meta">opzionale</span>
      </div>

      ${fieldHTML({
        id: 'propertyPrice',
        label: 'Prezzo immobile',
        html: `<div class="with-suffix">
          <input id="propertyPrice" type="number" inputmode="decimal" min="0" step="1000" placeholder="es. 180.000" value="${b.propertyPrice}">
          <span class="suffix">€</span>
        </div>`
      })}

      ${fieldHTML({
        id: 'cadastralValue',
        label: 'Valore catastale',
        html: `<div class="with-suffix">
          <input id="cadastralValue" type="number" inputmode="decimal" min="0" step="1000" placeholder="vuoto = 55% del prezzo" value="${b.cadastralValue}">
          <span class="suffix">€</span>
        </div>`
      })}

      <div class="field">
        <div class="field-head">
          <label for="hasAgency" style="font-size:14px;color:var(--text);">Acquisto tramite agenzia</label>
          <button type="button" class="tip-btn" data-tip="hasAgency" aria-label="Info">i</button>
        </div>
        <div class="tip-pop" data-tip-pop="hasAgency">${TIPS.hasAgency}</div>
        <div class="checkbox-row" style="padding:0;">
          <input id="hasAgency" type="checkbox" ${b.hasAgency !== false ? 'checked' : ''}>
          <label for="hasAgency">Sì, comprerò tramite agenzia immobiliare</label>
        </div>
      </div>
    </div>

    <!-- SEZIONE 3: IL MUTUO -->
    <div class="section-card">
      <div class="section-head">
        <span class="icon-circle">%</span>
        <h2>Il mutuo</h2>
      </div>

      <div class="field">
        <div class="field-head">
          <label>Tipo di tasso</label>
          <button type="button" class="tip-btn" data-tip="rateType" aria-label="Info">i</button>
        </div>
        <div class="tip-pop" data-tip-pop="rateType">${TIPS.rateType}</div>
        <div class="segmented" role="tablist">
          <button class="seg ${b.rateType === 'fisso' ? 'active' : ''}" data-rate-type="fisso" role="tab">Fisso</button>
          <button class="seg ${b.rateType === 'variabile' ? 'active' : ''}" data-rate-type="variabile" role="tab">Variabile</button>
        </div>
      </div>

      <div class="field">
        <div class="field-head">
          <label for="customRate">Tasso annuo (TAN)</label>
          <button type="button" class="tip-btn" data-tip="customRate" aria-label="Info">i</button>
        </div>
        <div class="tip-pop" data-tip-pop="customRate">${TIPS.customRate}</div>
        <div class="rate-row">
          <div class="with-suffix">
            <input id="customRate" type="number" inputmode="decimal" min="0" max="20" step="0.05"
              placeholder="${currentRate.toFixed(2).replace('.', ',')}"
              value="${b.customRate}">
            <span class="suffix">% annuo</span>
          </div>
          <button type="button" class="btn-chip" id="useDefaultRate">Usa media</button>
          <button type="button" class="btn-chip btn-refresh" id="refreshRatesBtn" title="Aggiorna tassi BCE" aria-label="Aggiorna tassi">↻</button>
        </div>
        <div class="rate-hint" id="rateHint">
          <!-- popolato da updateRateHintUI() -->
        </div>
      </div>

      <div class="field">
        <div class="field-head">
          <label for="years">Durata mutuo</label>
          <button type="button" class="tip-btn" data-tip="years" aria-label="Info">i</button>
        </div>
        <div class="tip-pop" data-tip-pop="years">${TIPS.years}</div>
        <div class="slider-row">
          <input id="years" type="range" min="5" max="40" step="1" value="${b.years || 25}">
          <span class="slider-value" id="yearsValue">${b.years || 25} anni</span>
        </div>
      </div>

      <div class="btn-row">
        <button class="btn" id="saveScenarioBtn">⎙ Salva scenario</button>
        <button class="btn secondary" id="resetBudgetBtn">Reset dati</button>
      </div>
    </div>

    <div id="budgetResults"></div>
  `;

  /* ---------- Wiring ---------- */
  const numInputs = ['netMonthly','existingLoans','age','isee','propertyPrice','cadastralValue','customRate'];
  numInputs.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      state.budget[id] = el.value;
      saveState();
      renderBudgetResults();
    });
  });

  const agencyEl = document.getElementById('hasAgency');
  agencyEl.addEventListener('change', () => {
    state.budget.hasAgency = agencyEl.checked;
    saveState();
    renderBudgetResults();
  });

  // Segmented tipo tasso
  document.querySelectorAll('[data-rate-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-rate-type');
      state.budget.rateType = t;
      saveState();
      document.querySelectorAll('[data-rate-type]').forEach(b => b.classList.toggle('active', b === btn));
      // aggiorna placeholder con il tasso corrente per il nuovo tipo
      const r = getCurrentRates();
      document.getElementById('customRate').placeholder = r[t].toFixed(2).replace('.', ',');
      updateRateHintUI();
      renderBudgetResults();
    });
  });

  // "Usa media" — riempie il campo col valore corrente (live se disponibile)
  document.getElementById('useDefaultRate').addEventListener('click', () => {
    const r = getCurrentRates();
    const v = r[state.budget.rateType];
    const rateInput = document.getElementById('customRate');
    rateInput.value = v.toFixed(2).replace('.', ',');
    state.budget.customRate = rateInput.value;
    saveState();
    renderBudgetResults();
  });

  // Refresh tassi live (forza il fetch ignorando la cache)
  document.getElementById('refreshRatesBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshRatesBtn');
    btn.classList.add('spinning');
    btn.disabled = true;
    await refreshLiveRates(true);
    btn.classList.remove('spinning');
    btn.disabled = false;
    updateRateHintUI();
    // se il campo era vuoto, aggiorna placeholder
    const r = getCurrentRates();
    document.getElementById('customRate').placeholder = r[state.budget.rateType].toFixed(2).replace('.', ',');
    toast(state.liveRates?.ok ? 'Tassi aggiornati dalla BCE' : 'Aggiornamento fallito · uso valori di stima');
    renderBudgetResults();
  });

  // Render iniziale dell'hint + fetch live in background (non blocca la UI)
  updateRateHintUI();
  refreshLiveRates().then(() => {
    if (location.hash !== '#/budget') return; // utente è andato altrove
    updateRateHintUI();
    const r = getCurrentRates();
    const rateInput = document.getElementById('customRate');
    if (rateInput) rateInput.placeholder = r[state.budget.rateType].toFixed(2).replace('.', ',');
    renderBudgetResults();
  });

  // Slider anni
  const yearsEl = document.getElementById('years');
  const yearsValueEl = document.getElementById('yearsValue');
  function paintSlider() {
    const min = +yearsEl.min, max = +yearsEl.max, val = +yearsEl.value;
    const pct = ((val - min) / (max - min)) * 100;
    yearsEl.style.backgroundSize = `${pct}% 100%`;
    yearsValueEl.textContent = val + (val === 1 ? ' anno' : ' anni');
  }
  paintSlider();
  yearsEl.addEventListener('input', () => {
    state.budget.years = +yearsEl.value;
    paintSlider();
    saveState();
    renderBudgetResults();
  });

  // Tooltip toggling
  wireTooltips();

  document.getElementById('resetBudgetBtn').addEventListener('click', () => {
    if (!confirm('Cancellare tutti i dati del budget?')) return;
    state.budget = defaultState().budget;
    saveState();
    render();
    toast('Dati budget resettati');
  });

  document.getElementById('saveScenarioBtn').addEventListener('click', saveCurrentScenario);

  document.querySelectorAll('[data-load-scenario]').forEach(btn => {
    btn.addEventListener('click', () => loadScenario(btn.getAttribute('data-load-scenario')));
  });
  document.querySelectorAll('[data-del-scenario]').forEach(btn => {
    btn.addEventListener('click', () => deleteScenario(btn.getAttribute('data-del-scenario')));
  });

  renderBudgetResults();
}

/* Wire ogni tooltip che non è già stato collegato. Idempotente: può essere
   chiamato dopo ogni rerender senza creare listener duplicati. */
function wireTooltips(scope = document) {
  scope.querySelectorAll('.tip-btn[data-tip]').forEach(btn => {
    if (btn.dataset.tipWired === '1') return;
    btn.dataset.tipWired = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-tip');
      const pop = document.querySelector(`[data-tip-pop="${id}"]`);
      if (!pop) return;
      const wasOpen = pop.classList.contains('open');
      document.querySelectorAll('.tip-pop.open').forEach(p => p.classList.remove('open'));
      document.querySelectorAll('.tip-btn.open').forEach(b => b.classList.remove('open'));
      if (!wasOpen) {
        pop.classList.add('open');
        btn.classList.add('open');
      }
    });
  });
}

/* Ridipinge SOLO la riga "Media di mercato" senza ri-renderizzare il form
   (così non si perde focus negli input mentre l'utente sta digitando). */
function updateRateHintUI() {
  const hint = document.getElementById('rateHint');
  if (!hint) return;
  const rates = getCurrentRates();
  const t = state.budget.rateType || 'fisso';
  const v = rates[t];
  const liveCls = rates.isLive ? 'pulse live' : 'pulse fallback';
  const sourceLbl = rates.isLive
    ? `BCE · agg. ${rates.asOf}`
    : `stima locale · BCE non raggiungibile`;
  hint.innerHTML = `
    <span class="${liveCls}" title="${rates.isLive ? 'Dato in tempo reale' : 'Valore di fallback'}"></span>
    <span>Media di mercato: <b>${v.toFixed(2).replace('.', ',')}%</b> ${t} <span class="rate-source">(${sourceLbl})</span></span>
  `;
}

function closeTipsOnOutside(e) {
  if (e.target.closest('.tip-btn') || e.target.closest('.tip-pop')) return;
  document.querySelectorAll('.tip-pop.open').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.tip-btn.open').forEach(b => b.classList.remove('open'));
}
// Listener globale registrato una sola volta
document.addEventListener('click', closeTipsOnOutside);

function renderBudgetResults() {
  const b = state.budget;
  const netMonthly = num(b.netMonthly);
  const existingLoans = num(b.existingLoans);
  const age = num(b.age);
  const isee = num(b.isee);
  const propertyPrice = num(b.propertyPrice);
  const cadastralValue = num(b.cadastralValue);
  const hasAgency = b.hasAgency !== false;
  const years = Math.max(1, +b.years || 25);
  const rateType = b.rateType || 'fisso';
  const liveRates = getCurrentRates();
  const rateUsed = num(b.customRate) > 0 ? num(b.customRate) : (liveRates[rateType] ?? DEFAULT_RATES[rateType].value);

  const container = document.getElementById('budgetResults');
  if (netMonthly <= 0) {
    container.innerHTML = `
      <div class="section-card" style="text-align:center;padding:24px 16px;">
        <div style="font-size:38px;opacity:.4;">📊</div>
        <div style="margin-top:6px;font-weight:600;">Compila almeno il reddito netto mensile</div>
        <div class="muted" style="font-size:13px;margin-top:4px;">I risultati appariranno qui in tempo reale.</div>
      </div>`;
    return;
  }

  // Sostenibilità rata: (Reddito Netto Mensile * 0.35) - Rate Prestiti Esistenti
  const sostenibilitaRata = Math.max(0, (netMonthly * 0.35) - existingLoans);

  // Moltiplicatore prudenziale: Reddito Netto Annuo * 6
  const mutuoMax = (netMonthly * 12) * 6;

  // Under 36 / Consap
  const under36 = age > 0 && age < 36 && isee > 0 && isee < 40000;

  // Mutuo richiesto: 100% se Under 36/Consap, altrimenti 80% del prezzo
  const ltv = under36 ? 1.00 : 0.80;
  const importoMutuo = propertyPrice > 0 ? propertyPrice * ltv : 0;
  const anticipoBanca = propertyPrice > 0 ? propertyPrice - importoMutuo : 0;

  // Calcolo rata francese: r mensile e n mesi
  const r = rateUsed / 100 / 12;
  const months = years * 12;
  const ratamensile = importoMutuo > 0
    ? importoMutuo * (r * Math.pow(1+r, months)) / (Math.pow(1+r, months) - 1)
    : 0;
  const interessiTot = ratamensile > 0 ? (ratamensile * months) - importoMutuo : 0;
  const costoTotaleMutuo = ratamensile * months;

  // Breakdown costi accessori
  const costi = propertyPrice > 0
    ? computeAccessoryCosts({ price: propertyPrice, mortgage: importoMutuo, hasAgency, cadastralValue })
    : null;

  const anticipoTot = costi ? anticipoBanca + costi.totale : anticipoBanca;
  const totaleOperazione = costi ? propertyPrice + costi.totale : propertyPrice;

  // Stato sostenibilità della rata
  let gaugeCls = 'ok', gaugePct = 0, sostBadge = '✓ sostenibile', sostColor = '#22c55e';
  if (ratamensile > 0 && sostenibilitaRata > 0) {
    gaugePct = Math.min(100, (ratamensile / sostenibilitaRata) * 100);
    if (ratamensile > sostenibilitaRata) {
      gaugeCls = 'bad'; sostBadge = '⚠ oltre la soglia'; sostColor = '#ef4444';
    } else if (ratamensile > sostenibilitaRata * 0.85) {
      gaugeCls = 'warn'; sostBadge = '! al limite'; sostColor = '#f59e0b';
    }
  }

  // HERO: rata mensile in evidenza (se c'è il prezzo)
  const heroHTML = ratamensile > 0 ? `
    <div class="result-hero">
      <div class="label">Rata mensile stimata</div>
      <div class="big">${fmt.format(ratamensile)} <small>/ mese</small></div>
      <div class="badges">
        <span class="badge-chip">${years} anni</span>
        <span class="badge-chip">tasso ${rateType} ${rateUsed.toFixed(2).replace('.',',')}%</span>
        <span class="badge-chip">${sostBadge}</span>
      </div>
      <div class="gauge ${gaugeCls}"><span style="width:${gaugePct}%;"></span></div>
      <div class="meta">
        <span>0 €</span>
        <span>sostenibile fino a ${fmt.format(sostenibilitaRata)}/mese</span>
      </div>
    </div>
  ` : `
    <div class="section-card">
      <div class="section-head">
        <span class="icon-circle">✓</span>
        <h2>Capacità di credito</h2>
      </div>
      <div class="kpis">
        <div class="kpi success">
          <div class="label">Rata sostenibile</div>
          <div class="value">${fmt.format(sostenibilitaRata)} <small style="font-size:12px;color:var(--muted);font-weight:500;">/ mese</small></div>
        </div>
        <div class="kpi">
          <div class="label">Mutuo massimo stimato</div>
          <div class="value">${fmt.format(mutuoMax)}</div>
        </div>
      </div>
      <div class="note" style="margin-top:10px;">Aggiungi il <b>prezzo dell'immobile</b> per simulare rata, interessi e costi totali.</div>
    </div>
  `;

  // Verifica fattibilità — 2 check con giudizio
  let kpisHTML = '';
  if (ratamensile > 0) {
    // Check 1: capacità di credito (mutuo richiesto vs max teorico 6× reddito)
    const cap1Pct = mutuoMax > 0 ? Math.min(100, (importoMutuo / mutuoMax) * 100) : 0;
    let s1 = 'ok', s1Lbl = '✓ entro i limiti';
    if (mutuoMax > 0 && importoMutuo > mutuoMax) { s1 = 'bad'; s1Lbl = '✕ oltre i limiti'; }
    else if (mutuoMax > 0 && importoMutuo > mutuoMax * 0.85) { s1 = 'warn'; s1Lbl = '! al limite'; }

    // Check 2: sostenibilità rata (rata mensile vs capacità 35%)
    const cap2Pct = sostenibilitaRata > 0 ? Math.min(100, (ratamensile / sostenibilitaRata) * 100) : 0;
    let s2 = 'ok', s2Lbl = '✓ sostenibile';
    if (sostenibilitaRata > 0 && ratamensile > sostenibilitaRata) { s2 = 'bad'; s2Lbl = '✕ oltre la soglia'; }
    else if (sostenibilitaRata > 0 && ratamensile > sostenibilitaRata * 0.85) { s2 = 'warn'; s2Lbl = '! al limite'; }

    // Giudizio complessivo
    let verdict = 'ok', verdictLbl = 'Buon candidato';
    if (s1 === 'bad' || s2 === 'bad')         { verdict = 'bad';  verdictLbl = 'Profilo difficile'; }
    else if (s1 === 'warn' || s2 === 'warn')  { verdict = 'warn'; verdictLbl = 'Fattibile, al limite'; }

    kpisHTML = `
      <div class="section-card">
        <div class="section-head">
          <span class="icon-circle">✓</span>
          <h2>Verifica fattibilità</h2>
          <span class="verdict ${verdict}">${verdictLbl}</span>
        </div>
        <p class="check-intro">
          Le banche valutano due cose prima di approvare: che il tuo <b>reddito</b> sostenga l'importo del mutuo, e che la <b>rata mensile</b> rientri nelle tue spese sostenibili.
        </p>

        <div class="check-block ${s1}">
          <div class="check-head">
            <div class="check-title">
              <span class="check-icon">€</span>
              Capacità di credito
            </div>
            <span class="check-status">${s1Lbl}</span>
          </div>
          <div class="check-bar"><span style="width:${cap1Pct}%;"></span></div>
          <div class="check-detail">
            Mutuo richiesto <b>${fmt.format(importoMutuo)}</b> su <b>${fmt.format(mutuoMax)}</b> teoricamente concedibili
            <div class="check-rule">Regola prudenziale: il mutuo non dovrebbe superare <b>6× il reddito netto annuo</b>.</div>
          </div>
        </div>

        <div class="check-block ${s2}">
          <div class="check-head">
            <div class="check-title">
              <span class="check-icon">€/m</span>
              Sostenibilità rata
            </div>
            <span class="check-status">${s2Lbl}</span>
          </div>
          <div class="check-bar"><span style="width:${cap2Pct}%;"></span></div>
          <div class="check-detail">
            Rata stimata <b>${fmt.format(ratamensile)}/mese</b> contro <b>${fmt.format(sostenibilitaRata)}/mese</b> sostenibili
            <div class="check-rule">Regola del 35%: la rata non dovrebbe superare il <b>35% del reddito netto</b>, al netto di altre rate già attive.</div>
          </div>
        </div>
      </div>
    `;
  }

  // Costi accessori — lista con tooltip per voce
  const costiHTML = costi ? `
    <div class="section-card">
      <div class="section-head">
        <span class="icon-circle">∑</span>
        <h2>Costi accessori</h2>
        <span class="meta">${(costi.totale / propertyPrice * 100).toFixed(1)}% del prezzo</span>
      </div>
      <div class="cost-list">
        ${costi.voci.map(v => {
          const tipKey = 'cost-' + v.id;
          const hasTip = !!COST_TIPS[v.id];
          return `
            <div class="cost-item">
              <div class="cost-row">
                <div class="cost-info">
                  <div class="cost-title">
                    ${v.label}
                    ${hasTip ? `<button type="button" class="tip-btn" data-tip="${tipKey}" aria-label="Cos'è ${v.label}">i</button>` : ''}
                  </div>
                  <div class="cost-formula">${v.formula}</div>
                </div>
                <div class="cost-amount ${v.importo > 0 ? '' : 'zero'}">
                  ${v.importo > 0 ? fmt.format(v.importo) : '— escluso'}
                </div>
              </div>
              ${hasTip ? `<div class="tip-pop" data-tip-pop="${tipKey}" style="margin-top:8px;">${COST_TIPS[v.id]}</div>` : ''}
            </div>
          `;
        }).join('')}
        <div class="cost-total">
          <div class="label">
            <b>Totale costi accessori</b>
            <span class="meta">somma delle voci sopra</span>
          </div>
          <div class="amount">${fmt.format(costi.totale)}</div>
        </div>
      </div>
    </div>
  ` : '';

  // Riepilogo operazione — 3 blocchi
  let riepilogoHTML = '';
  if (costi) {
    const pctBank = totaleOperazione > 0 ? (importoMutuo / totaleOperazione * 100) : 0;
    const pctCash = totaleOperazione > 0 ? (anticipoTot   / totaleOperazione * 100) : 0;
    const showBankPct = pctBank >= 12;
    const showCashPct = pctCash >= 12;
    const interessiPct = importoMutuo > 0 ? (interessiTot / importoMutuo * 100) : 0;

    riepilogoHTML = `
      <div class="section-card">
        <div class="section-head">
          <span class="icon-circle">✓</span>
          <h2>Riepilogo operazione</h2>
        </div>

        <!-- Blocco 1 — quanto costa la casa -->
        <div class="recap-block">
          <div class="recap-head">
            <span class="recap-icon">⌂</span>
            <span>Quanto ti costa la casa</span>
          </div>
          <div class="recap-row">
            <span class="lbl">Prezzo dell'immobile</span>
            <span class="amt">${fmt.format(propertyPrice)}</span>
          </div>
          <div class="recap-row">
            <span class="lbl"><span class="op">+</span>Costi accessori</span>
            <span class="amt">${fmt.format(costi.totale)}</span>
          </div>
          <div class="recap-row total">
            <span class="lbl"><span class="op">=</span>Totale da pagare</span>
            <span class="amt">${fmt.format(totaleOperazione)}</span>
          </div>
        </div>

        <!-- Blocco 2 — come finanzi -->
        <div class="recap-block">
          <div class="recap-head">
            <span class="recap-icon">€</span>
            <span>Come finanzi l'acquisto</span>
          </div>
          <div class="split-bar" aria-label="Quota mutuo vs quota tue tasche">
            ${pctBank > 0 ? `<div class="seg bank" style="width:${pctBank}%;">${showBankPct ? pctBank.toFixed(0) + '%' : ''}</div>` : ''}
            ${pctCash > 0 ? `<div class="seg cash" style="width:${pctCash}%;">${showCashPct ? pctCash.toFixed(0) + '%' : ''}</div>` : ''}
          </div>
          <div class="split-legend">
            <div class="leg-row bank">
              <span class="left"><span class="dot"></span>Mutuo dalla banca <span class="pct">${pctBank.toFixed(0)}%</span></span>
              <span class="amt">${fmt.format(importoMutuo)}</span>
            </div>
            <div class="leg-row cash">
              <span class="left"><span class="dot"></span>Dalle tue tasche <span class="pct">${pctCash.toFixed(0)}%</span></span>
              <span class="amt">${fmt.format(anticipoTot)}</span>
            </div>
          </div>
          <div class="recap-foot">
            Il mutuo copre il <b>${(ltv*100).toFixed(0)}%</b> del prezzo dell'immobile (LTV).
            La quota "dalle tue tasche" comprende l'anticipo al venditore (${fmt.format(anticipoBanca)}) <b>+</b> i costi accessori (${fmt.format(costi.totale)}).
          </div>
        </div>

        <!-- Blocco 3 — restituzione alla banca -->
        <div class="recap-block">
          <div class="recap-head">
            <span class="recap-icon">↺</span>
            <span>Quanto restituisci alla banca</span>
          </div>
          <div class="recap-row">
            <span class="lbl">Capitale (importo mutuo)</span>
            <span class="amt">${fmt.format(importoMutuo)}</span>
          </div>
          <div class="recap-row">
            <span class="lbl"><span class="op">+</span>Interessi (${years} anni @ ${rateUsed.toFixed(2).replace('.',',')}%)</span>
            <span class="amt">${fmt.format(interessiTot)}</span>
          </div>
          <div class="recap-row total">
            <span class="lbl"><span class="op">=</span>Totale rimborsato</span>
            <span class="amt">${fmt.format(costoTotaleMutuo)}</span>
          </div>
          <div class="recap-foot">
            Gli interessi pesano per <b>+${interessiPct.toFixed(1)}%</b> sul capitale prestato. Diluendo su più anni la rata cala ma gli interessi totali aumentano.
          </div>
        </div>
      </div>
    `;
  }

  // Banner Under 36
  const under36HTML = `
    <div class="section-card" style="${under36 ? 'border-color: rgba(34,197,94,0.4); background: var(--success-soft);' : ''}">
      <div class="section-head">
        <span class="icon-circle" style="${under36 ? 'background:rgba(34,197,94,0.2);color:var(--success);' : ''}">★</span>
        <h2>Opzione Under 36 / Consap</h2>
        <span class="badge ${under36 ? 'success' : 'info'}">${under36 ? 'Attiva' : 'Non attiva'}</span>
      </div>
      <p style="margin:0;font-size:14px;">
        ${under36
          ? '✓ Hai diritto al <b>Mutuo 100%</b> con Garanzia di Stato (Fondo Consap): puoi finanziare l\'intero valore dell\'immobile senza l\'anticipo del 20%.'
          : 'Requisiti: <b>età &lt; 36 anni</b> e <b>ISEE &lt; 40.000 €</b>. Compila i campi nella sezione "Le tue finanze" per verificare.'}
      </p>
    </div>
  `;

  container.innerHTML = `
    <h2 style="margin-top:18px;">Risultati</h2>
    ${heroHTML}
    ${kpisHTML}
    ${costiHTML}
    ${riepilogoHTML}
    ${under36HTML}
    <div class="note" style="margin-top:8px;">
      <b>Come leggere i risultati.</b><br>
      • <b>Rata mensile</b>: ammortamento alla francese, calcolata su tasso e durata che hai impostato.<br>
      • <b>Rata sostenibile</b>: regola del 35% del reddito netto, al netto delle rate già attive.<br>
      • <b>Mutuo richiesto</b>: 80% del prezzo (100% se Under 36/Consap).<br>
      • <b>Anticipo necessario</b>: differenza prezzo–mutuo + tutti i costi accessori che paghi di tasca tua.<br>
      • Stime indicative, non sostituiscono una <a href="#/roadmap" style="color:var(--primary);font-weight:700;text-decoration:none;">predelibera bancaria</a>.
    </div>
  `;

  // Collega i tooltip aggiunti dinamicamente (es. voci dei costi accessori)
  wireTooltips(container);
}

/* ============================================================
 * Modulo 2 — Roadmap interattiva
 * ============================================================ */
function renderRoadmap(view) {
  const done = state.roadmap.done;
  const open = state.roadmap.open;

  const total = ROADMAP.length;
  const completed = ROADMAP.filter(s => done[s.id]).length;

  view.innerHTML = `
    <h1>Roadmap del mutuo</h1>
    <p class="subtitle">Le 6 fasi del processo di acquisto. Spunta ciò che hai già fatto.</p>

    <div class="card compact">
      <div class="spaced">
        <div><b>${completed} / ${total}</b> fasi completate</div>
        <span class="badge ${completed === total ? 'success' : 'info'}">
          ${completed === total ? 'Completato' : Math.round(completed/total*100) + '%'}
        </span>
      </div>
    </div>

    <div class="timeline" id="timeline">
      ${ROADMAP.map((step, idx) => {
        const isDone = !!done[step.id];
        const isActive = !isDone && ROADMAP.slice(0, idx).every(s => done[s.id]);
        const isOpen = open === step.id;
        const stateCls = isDone ? 'done' : (isActive ? 'active' : '');
        return `
          <div class="tl-step ${stateCls} ${isOpen ? 'open' : ''}" data-id="${step.id}">
            <div class="tl-card">
              <div class="tl-head">
                <div>
                  <div class="tl-title">${idx + 1}. ${step.title}</div>
                  <div class="tl-desc">${step.desc}</div>
                </div>
                <button class="tl-toggle ${isDone ? 'done' : ''}" data-toggle="${step.id}">
                  ${isDone ? '✓ Fatto' : 'Segna'}
                </button>
              </div>
              <div class="tl-extras">
                ${step.extra ? `<div class="muted" style="font-size:14px;">${step.extra}</div>` : ''}
                ${(step.chicche || []).map(c => `<div class="chicca"><b>Chicca:</b> ${c}</div>`).join('')}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>
  `;

  // Click sulla card apre/chiude i dettagli, click sul bottone toggla "fatto"
  document.querySelectorAll('.tl-step').forEach(stepEl => {
    const id = stepEl.getAttribute('data-id');
    stepEl.querySelector('.tl-card').addEventListener('click', (e) => {
      if (e.target.closest('.tl-toggle')) return;
      state.roadmap.open = (state.roadmap.open === id) ? null : id;
      saveState();
      render();
    });
  });
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-toggle');
      state.roadmap.done[id] = !state.roadmap.done[id];
      saveState();
      render();
    });
  });
}

/* ============================================================
 * Modulo 3 — Checklist Visita Immobile
 * ============================================================ */
function renderVisita(view) {
  const v = state.visite.current;

  view.innerHTML = `
    <h1>Checklist visita</h1>
    <p class="subtitle">Compila durante il sopralluogo. Puoi salvare la visita e iniziarne una nuova.</p>

    <div class="card">
      <div class="field">
        <label for="vNome">Nome immobile</label>
        <input id="vNome" type="text" placeholder="es. Trilocale via Roma" value="${escapeHTML(v.nome || '')}">
      </div>
      <div class="field">
        <label for="vIndirizzo">Indirizzo</label>
        <input id="vIndirizzo" type="text" placeholder="Via, città" value="${escapeHTML(v.indirizzo || '')}">
      </div>
      <div class="field">
        <label for="vData">Data visita</label>
        <input id="vData" type="date" value="${escapeHTML(v.data || '')}">
      </div>
    </div>

    ${VISITA.map(section => {
      const total = section.items.length;
      const done = section.items.filter(i => v.checks[i.id]).length;
      return `
        <div class="section-title">
          <h2>${section.section}</h2>
          <span class="progress-mini">${done}/${total}</span>
        </div>
        <div class="card compact">
          ${section.items.map(item => `
            <div class="checkbox-row ${v.checks[item.id] ? 'done' : ''}">
              <input type="checkbox" id="chk_${item.id}" data-check="${item.id}" ${v.checks[item.id] ? 'checked' : ''}>
              <label for="chk_${item.id}">${item.text}</label>
            </div>
          `).join('')}
        </div>
      `;
    }).join('')}

    <div class="section-title"><h2>Note</h2></div>
    <div class="card compact">
      <textarea id="vNote" rows="4" placeholder="Annota impressioni, domande aperte, prezzi mercato vicini...">${escapeHTML(v.note || '')}</textarea>
    </div>

    <div class="btn-row">
      <button class="btn" id="saveVisitaBtn">Salva visita</button>
      <button class="btn secondary" id="newVisitaBtn">Nuova</button>
    </div>

    ${state.visite.salvate.length > 0 ? `
      <h2>Visite salvate</h2>
      <div id="savedVisits">
        ${state.visite.salvate.map(s => {
          const done = Object.values(s.checks).filter(Boolean).length;
          return `
            <div class="card compact">
              <div class="spaced">
                <div>
                  <div style="font-weight:700;">${escapeHTML(s.nome || 'Senza nome')}</div>
                  <div class="muted" style="font-size:13px;">${escapeHTML(s.indirizzo || '—')} ${s.data ? '· ' + s.data : ''}</div>
                </div>
                <span class="badge info">${done} ✓</span>
              </div>
              <div class="btn-row">
                <button class="btn secondary" data-load-visit="${s.id}">Carica</button>
                <button class="btn danger" data-del-visit="${s.id}">Elimina</button>
              </div>
            </div>`;
        }).join('')}
      </div>
    ` : ''}
  `;

  // Inputs base
  ['vNome:nome','vIndirizzo:indirizzo','vData:data','vNote:note'].forEach(pair => {
    const [domId, key] = pair.split(':');
    const el = document.getElementById(domId);
    el.addEventListener('input', () => {
      state.visite.current[key] = el.value;
      saveState();
    });
  });

  // Checkboxes
  document.querySelectorAll('[data-check]').forEach(el => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-check');
      state.visite.current.checks[id] = el.checked;
      saveState();
      // Re-render sezione per aggiornare contatori e style
      render();
    });
  });

  document.getElementById('saveVisitaBtn').addEventListener('click', () => {
    const cur = state.visite.current;
    if (!cur.nome && !cur.indirizzo) {
      toast('Inserisci nome o indirizzo prima di salvare');
      return;
    }
    const id = 'v_' + Date.now();
    state.visite.salvate.unshift({ id, ...cur });
    state.visite.current = emptyVisita();
    saveState();
    render();
    toast('Visita salvata');
  });

  document.getElementById('newVisitaBtn').addEventListener('click', () => {
    if (!confirm('Vuoi davvero iniziare una nuova visita? I dati non salvati andranno persi.')) return;
    state.visite.current = emptyVisita();
    saveState();
    render();
  });

  document.querySelectorAll('[data-load-visit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-load-visit');
      const v = state.visite.salvate.find(x => x.id === id);
      if (!v) return;
      state.visite.current = { nome: v.nome, indirizzo: v.indirizzo, data: v.data, note: v.note, checks: { ...v.checks } };
      saveState();
      render();
      toast('Visita caricata');
    });
  });
  document.querySelectorAll('[data-del-visit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-del-visit');
      if (!confirm('Eliminare questa visita?')) return;
      state.visite.salvate = state.visite.salvate.filter(x => x.id !== id);
      saveState();
      render();
    });
  });
}

/* ============================================================
 * Modulo 4 — Wallet documenti
 * ============================================================ */
function renderWallet(view) {
  const total = WALLET_DOCS.length;
  const done = WALLET_DOCS.filter(d => state.wallet[d.id]).length;
  const pct = Math.round(done / total * 100);

  view.innerHTML = `
    <h1>Wallet documenti</h1>
    <p class="subtitle">I documenti che la banca ti chiederà per la pratica del mutuo.</p>

    <div class="card compact">
      <div class="spaced">
        <div><b>${done} / ${total}</b> pronti</div>
        <span class="badge ${done === total ? 'success' : 'info'}">${pct}%</span>
      </div>
    </div>

    <div class="wallet-list">
      ${WALLET_DOCS.map(d => `
        <div class="wallet-item">
          <input type="checkbox" id="doc_${d.id}" data-doc="${d.id}" ${state.wallet[d.id] ? 'checked' : ''}>
          <div style="flex:1;">
            <div class="doc-title">${d.title}</div>
            <div class="doc-desc">${d.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="note" style="margin-top:14px;">
      <b>Suggerimento.</b> Tieni i documenti scansionati in PDF su una cartella cloud dedicata (es. Drive) per inviarli rapidamente alla banca.
    </div>
  `;

  document.querySelectorAll('[data-doc]').forEach(el => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-doc');
      state.wallet[id] = el.checked;
      saveState();
      // Re-render to update counter
      render();
    });
  });
}

/* ============================================================
 * Costi accessori
 * ============================================================ */
function renderCosti(view) {
  const propertyPrice = num(state.budget.propertyPrice);
  const costiTot = propertyPrice > 0 ? propertyPrice * 0.20 : 0;

  view.innerHTML = `
    <h1>Costi accessori</h1>
    <p class="subtitle">Le voci da aggiungere al prezzo dell'immobile. Regola pratica: ~+20% del prezzo.</p>

    ${propertyPrice > 0 ? `
      <div class="card">
        <div class="card-row"><span class="k">Prezzo immobile</span><span class="v">${fmt.format(propertyPrice)}</span></div>
        <div class="card-row"><span class="k">Costi accessori (+20%)</span><span class="v">${fmt.format(costiTot)}</span></div>
        <div class="card-row"><span class="k">Totale stimato</span><span class="v">${fmt.format(propertyPrice + costiTot)}</span></div>
      </div>
    ` : `
      <div class="note">Inserisci il prezzo dell'immobile nel <a href="#/budget" style="color:var(--primary);font-weight:700;text-decoration:none;">Calcolatore Budget</a> per vedere la stima totale.</div>
    `}

    <h2>Dettaglio voci</h2>
    <div class="card compact" style="overflow-x:auto;">
      <table class="cost-table">
        <thead>
          <tr><th>Voce di costo</th><th class="right">Stima / Valore</th></tr>
        </thead>
        <tbody>
          ${COSTI.map(c => `
            <tr>
              <td>${c.voce}</td>
              <td>${c.stima}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="note" style="margin-top:12px;">
      I valori sono indicativi e variano in base a importo del mutuo, valore catastale dell'immobile, regione e tariffe del notaio.
    </div>
  `;
}

/* ============================================================
 * Altro — hub con strumenti secondari
 * ============================================================ */
function renderAltro(view) {
  const totalDocs = WALLET_DOCS.length;
  const doneDocs = Object.values(state.wallet).filter(Boolean).length;
  const totalChecks = VISITA.reduce((acc, s) => acc + s.items.length, 0);
  const doneChecks = Object.values(state.visite.current.checks).filter(Boolean).length;

  view.innerHTML = `
    <h1>Strumenti</h1>
    <p class="subtitle">Tutti gli strumenti di MutuoStep, in un unico posto.</p>

    <div class="tiles">
      <a class="tile" href="#/visita">
        <span class="icon">⌂</span>
        <span class="title">Checklist visita</span>
        <span class="desc">${doneChecks}/${totalChecks} controlli</span>
      </a>
      <a class="tile" href="#/wallet">
        <span class="icon">▤</span>
        <span class="title">Wallet documenti</span>
        <span class="desc">${doneDocs}/${totalDocs} pronti</span>
      </a>
      <a class="tile" href="#/costi">
        <span class="icon">∑</span>
        <span class="title">Costi accessori</span>
        <span class="desc">Tasse, notaio, agenzia</span>
      </a>
      <a class="tile" href="#/redflags">
        <span class="icon" style="background:var(--danger-soft);color:var(--danger)">!</span>
        <span class="title">Red Flags</span>
        <span class="desc">Segnali di pericolo</span>
      </a>
    </div>
  `;
}

/* ============================================================
 * Red Flags
 * ============================================================ */
function renderRedFlags(view) {
  view.innerHTML = `
    <h1>🚩 Red Flags</h1>
    <p class="subtitle">Segnali di pericolo da non ignorare mai durante la trattativa.</p>

    ${RED_FLAGS.map(f => `
      <div class="flag">
        <div class="flag-icon">!</div>
        <div>
          <div class="flag-title">${f.title}</div>
          <div class="flag-desc">${f.desc}</div>
        </div>
      </div>
    `).join('')}

    <div class="note" style="margin-top:12px;">
      Se uno o più di questi segnali emergono, fermati e consulta un <b>notaio di fiducia</b> prima di firmare qualunque documento.
    </div>
  `;
}

/* ============================================================
 * Onboarding (primo accesso)
 * ============================================================ */
const ONBOARDING_KEY = 'mutuostep:onboardingDone';

const ONBOARDING_SLIDES = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>`,
    title: 'Benvenuto in MutuoStep',
    subtitle: 'La tua guida alla prima casa',
    body: 'Dal calcolo del budget alla firma del rogito, ti accompagniamo passo dopo passo per evitare gli errori da principiante.'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M16 8.5a4 4 0 0 0-7 2.5 4 4 0 0 0 7 2.5"/><path d="M7.5 11h6M7.5 13h6"/></svg>`,
    title: 'Calcola il budget reale',
    subtitle: 'Tassi BCE in tempo reale',
    body: 'Inserisci reddito, ISEE ed età: applichiamo le logiche bancarie reali e ti diciamo quanto puoi davvero spendere, con un verdetto immediato di sostenibilità.'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5" fill="currentColor"/><circle cx="6" cy="18" r="2.5"/><path d="M6 8.5v7"/><path d="M10 6h10M10 18h10"/></svg>`,
    title: 'Segui la roadmap',
    subtitle: '6 fasi, dalla predelibera al rogito',
    body: 'Ogni fase è spiegata in modo chiaro, con le chicche del notaio per non firmare mai nulla alla cieca.'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>`,
    title: 'Strumenti pratici sul campo',
    subtitle: 'Tutto quello che ti serve',
    body: 'Checklist visita immobile, wallet documenti per la banca, costi accessori dettagliati e i red flags da non ignorare mai durante la trattativa.'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>`,
    title: 'I tuoi dati restano tuoi',
    subtitle: '100% offline, zero tracking',
    body: 'Niente account, niente pubblicità, niente database remoti. Tutto resta nel tuo dispositivo. Sempre.'
  }
];

function shouldShowOnboarding() {
  try { return !localStorage.getItem(ONBOARDING_KEY); }
  catch { return false; }
}

function markOnboardingDone() {
  try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch {}
}

function showOnboarding() {
  if (document.querySelector('.onboarding-overlay')) return;

  document.body.classList.add('onboarding-active');

  const overlay = document.createElement('div');
  overlay.className = 'onboarding-overlay';
  overlay.innerHTML = `
    <div class="onb-card" role="dialog" aria-modal="true" aria-label="Introduzione a MutuoStep">
      <button class="onb-skip" type="button" aria-label="Salta introduzione">Salta</button>
      <div class="onb-viewport">
        <div class="onb-track">
          ${ONBOARDING_SLIDES.map((s) => `
            <div class="onb-slide">
              <div class="onb-icon">${s.icon}</div>
              <h2 class="onb-title">${escapeHTML(s.title)}</h2>
              ${s.subtitle ? `<p class="onb-subtitle">${escapeHTML(s.subtitle)}</p>` : ''}
              <p class="onb-body">${escapeHTML(s.body)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="onb-dots" role="tablist">
        ${ONBOARDING_SLIDES.map((_, i) => `<button class="onb-dot" type="button" data-i="${i}" aria-label="Vai al passo ${i + 1}"></button>`).join('')}
      </div>
      <div class="onb-actions">
        <button class="btn secondary onb-prev" type="button" hidden>Indietro</button>
        <button class="btn onb-next" type="button">Avanti</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let idx = 0;
  const last = ONBOARDING_SLIDES.length - 1;
  const track   = overlay.querySelector('.onb-track');
  const dots    = overlay.querySelectorAll('.onb-dot');
  const prevBtn = overlay.querySelector('.onb-prev');
  const nextBtn = overlay.querySelector('.onb-next');
  const skipBtn = overlay.querySelector('.onb-skip');

  const update = () => {
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    prevBtn.hidden = idx === 0;
    skipBtn.hidden = idx === last;
    nextBtn.textContent = idx === last ? 'Iniziamo!' : 'Avanti';
  };

  const close = () => {
    markOnboardingDone();
    overlay.classList.remove('open');
    document.body.classList.remove('onboarding-active');
    setTimeout(() => overlay.remove(), 220);
    document.removeEventListener('keydown', onKey);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') { if (idx < last) { idx++; update(); } else close(); }
    else if (e.key === 'ArrowLeft')  { if (idx > 0)    { idx--; update(); } }
  };

  prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; update(); } });
  nextBtn.addEventListener('click', () => {
    if (idx < last) { idx++; update(); } else close();
  });
  skipBtn.addEventListener('click', close);
  dots.forEach(d => d.addEventListener('click', () => {
    idx = parseInt(d.dataset.i, 10);
    update();
  }));

  // Swipe touch (mobile)
  let touchX = null;
  overlay.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && idx < last) { idx++; update(); }
    else if (dx > 0 && idx > 0) { idx--; update(); }
  }, { passive: true });

  document.addEventListener('keydown', onKey);

  requestAnimationFrame(() => overlay.classList.add('open'));
  update();
}

/* ============================================================
 * PWA install + Service worker
 * ============================================================ */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.hidden = false;
});

document.addEventListener('DOMContentLoaded', () => {
  // Default route
  if (!location.hash) location.hash = '#/home';
  render();

  const installBtn = document.getElementById('installBtn');
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) helpBtn.addEventListener('click', () => showOnboarding());

  // Mostra l'onboarding al primo accesso
  if (shouldShowOnboarding()) showOnboarding();
});

const isEmbeddedInUtilityHub =
  window.top !== window && window.top.__reactUtilityHubIntegrated === true;

if (!isEmbeddedInUtilityHub && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
