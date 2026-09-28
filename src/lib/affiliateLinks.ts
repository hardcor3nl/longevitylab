/**
 * Canonical affiliate destinations keyed by product slug.
 * Product cards and MDX should link to `/go/{slug}` — never paste raw affiliate URLs in content.
 * Edge redirects (`public/_redirects`) are generated from this map at build time.
 */
export const affiliateLinks: Record<string, string> = {
  'prohealth-nmn': 'https://www.amazon.com/s?k=NMN+Longevity+Supplement&tag=michaelregeer-20',
  'tru-niagen': 'https://www.amazon.com/s?k=ChromaDex+Tru+Niagen&tag=michaelregeer-20',
  'double-wood-nmn': 'https://www.amazon.com/s?k=Double+Wood+NMN&tag=michaelregeer-20',
  'dexcom-stelo': 'https://www.stelo.com/',
  'libre3': 'https://www.amazon.com/s?k=Freestyle+Libre+3+sensor&tag=michaelregeer-20',
  'carlson-omega3': 'https://www.amazon.com/s?k=Carlson+Elite+Omega-3&tag=michaelregeer-20',
  'nordic-omega3': 'https://www.amazon.com/s?k=Nordic+Naturals+Ultimate+Omega&tag=michaelregeer-20',
  'mito-red-1500': 'https://www.amazon.com/s?k=Mito+Red+Light+MitoPRO+1500&tag=michaelregeer-20',
  'lumebox': 'https://www.lumebox.com/',
  'whoop-4': 'https://join.whoop.com/',
  'oura-gen3': 'https://ouraring.com/',
  'garmin-fenix7': 'https://www.amazon.com/s?k=Garmin+Fenix+7&tag=michaelregeer-20',
  'fisetin-lifeext': 'https://amzn.to/4gAywip',
  'function-health': 'https://www.functionhealth.com/',
  'insidetracker': 'https://www.insidetracker.com/',
  'gaia-rhodiola': 'https://amzn.to/3SV2tA1',
  'ksm66-ashwagandha': 'https://amzn.to/3T0P8Gi',
  'jarrow-nac': 'https://www.amazon.com/s?k=Jarrow+NAC&tag=michaelregeer-20',
  'jarrow-pqq': 'https://www.amazon.com/s?k=Jarrow+PQQ&tag=michaelregeer-20',
  'jarrow-rala': 'https://amzn.to/4f7ehGI',
  'jarrow-tmg': 'https://www.amazon.com/s?k=Jarrow+TMG&tag=michaelregeer-20',
  'jarrow-ubiquinol': 'https://amzn.to/3SN8GOx',
  'lifeext-caakg': 'https://amzn.to/4wZpyAr',
  'livon-vitamin-c': 'https://amzn.to/4aSGAHM',
  'now-taurine': 'https://www.amazon.com/s?k=NOW+Foods+Taurine&tag=michaelregeer-20',
  'primeadine-spermidine': 'https://www.oxfordhealthspan.com/MICHAEL54679',
  'pure-mag-glycinate': 'https://www.amazon.com/s?k=Pure+Encapsulations+Magnesium+Glycinate&tag=michaelregeer-20',
  'thorne-berberine': 'https://amzn.to/3SJ1nap',
  'thorne-creatine': 'https://amzn.to/4p9D4Pe',
  'thorne-d3k2': 'https://amzn.to/44djRCp',
  'thorne-quercetin': 'https://amzn.to/4y68Q3p',
  'thorne-resveratrol': 'https://amzn.to/4prSSNd',
  'resveratrol': 'https://amzn.to/4prSSNd',
  'thorne-zinc': 'https://amzn.to/4fgtWni',
  'hostdefense-lionsmane': 'https://www.amazon.com/s?k=Host+Defense+Lion%27s+Mane&tag=michaelregeer-20',
  'ndga': 'https://www.amazon.com/s?k=NDGA+supplement&tag=michaelregeer-20',
  'lithium-orotate': 'https://amzn.to/4vW7SoX',
  'joovv-solo-3': 'https://joovv.com/',
  'biomax-300': 'https://www.amazon.com/s?k=PlatinumLED+BioMax+300&tag=michaelregeer-20',
  'sunlighten-mpulse': 'https://share.sunlighten.com/MichaelRegeer',
  'clearlight-sanctuary': 'https://www.awin1.com/cread.php?awinmid=101701&awinaffid=2967749&ued=https%3A%2F%2Finfraredsauna.com%2F',
  'serenelife-sauna': 'https://www.amazon.com/s?k=SereneLife+Portable+Infrared+Sauna&tag=michaelregeer-20',
  'the-plunge-pro': 'https://www.coldplunge.com/',
  'morozko-forge': 'https://morozkoforge.com/',
  // Internal guide — no external affiliate for DIY chest-freezer builds
  'chest-freezer-guide': 'https://thelongevityintel.com/recovery/cold-plunge-ice-bath-review',
  'theragun-pro-6': 'https://www.therabody.com/',
  'hypervolt-2-pro': 'https://www.awin1.com/cread.php?awinmid=25761&awinaffid=2967749&ued=https%3A%2F%2Fhyperice.com%2F',
  'renpho-r3': 'https://www.amazon.com/s?k=RENPHO+R3+massage+gun&tag=michaelregeer-20',
  'melatonin-timed-release': 'https://amzn.to/4wy3mNk',
  'blublox-glasses': 'https://www.blublox.com/',
  'citicoline-cognizin': 'https://www.amazon.com/s?k=Double+Wood+Citicoline+Cognizin&tag=michaelregeer-20',
  'bacopa-monnieri': 'https://www.amazon.com/s?k=Himalaya+Bacopa+Monnieri&tag=michaelregeer-20',
  'seed-ds01': 'https://seed.com/',
  'thorne-meriva-curcumin': 'https://www.amazon.com/s?k=Thorne+Meriva-SF+Curcumin+Phytosome&tag=michaelregeer-20',
  'now-curcubrain': 'https://www.amazon.com/s?k=now+curcubrain&tag=michaelregeer-20',
  'mitopure-timeline': 'https://www.timelinenutrition.com/',
  'urolithin-a-doublewood': 'https://www.amazon.com/s?k=Double+Wood+Urolithin+A&tag=michaelregeer-20',
  'almost-heaven-barrel': 'https://www.amazon.com/s?k=Almost+Heaven+Saunas+Independence+4-Person+Barrel+Sauna&tag=michaelregeer-20',
  'harvia-heater-kit': 'https://www.amazon.com/s?k=Harvia+KIP+Electric+Sauna+Heater+Kit&tag=michaelregeer-20',
  'newtowne-hyperbaric': 'https://www.newtownehyperbarics.com/',
  'amazon-mild-hyperbaric-chamber': 'https://www.amazon.com/s?k=hyperbaric+oxygen+chamber&tag=michaelregeer-20',

  // ─── Aliases: same product, different slug used in article content ────
  'garmin-fenix-7': 'https://www.amazon.com/s?k=Garmin+Fenix+7&tag=michaelregeer-20',
  'jarrow-r-ala': 'https://amzn.to/4f7ehGI',
  'life-extension-fisetin': 'https://amzn.to/4gAywip',
  'host-defense-lions-mane': 'https://www.amazon.com/s?k=Host+Defense+Lion%27s+Mane&tag=michaelregeer-20',
  'nordic-naturals': 'https://www.amazon.com/s?k=Nordic+Naturals+Ultimate+Omega&tag=michaelregeer-20',
  'primeadine': 'https://www.oxfordhealthspan.com/MICHAEL54679',
  'seed-synbiotic': 'https://seed.com/',
  'theragun-pro': 'https://www.therabody.com/',
  'thorne-dk2': 'https://amzn.to/44djRCp',
  'thorne-ala': 'https://amzn.to/4f7ehGI',
  'thorne-mag-glycinate': 'https://www.amazon.com/s?k=Thorne+Magnesium+Glycinate&tag=michaelregeer-20',
  'thorne-taurine': 'https://www.amazon.com/s?k=Thorne+Taurine&tag=michaelregeer-20',

  // ─── Wearables / fitness tech ──────────────────────────────────────────
  'apple-watch-s9': 'https://www.amazon.com/s?k=Apple+Watch+Series+9&tag=michaelregeer-20',
  'apple-watch-ultra-2': 'https://www.amazon.com/s?k=Apple+Watch+Ultra+2&tag=michaelregeer-20',
  'fitbit-charge6': 'https://www.amazon.com/s?k=Fitbit+Charge+6&tag=michaelregeer-20',
  'eight-sleep': 'https://www.eightsleep.com/',
  'loop-quiet': 'https://www.amazon.com/s?k=Loop+Quiet+earplugs&tag=michaelregeer-20',
  'manta-mask': 'https://www.amazon.com/s?k=Manta+Sleep+Mask&tag=michaelregeer-20',

  // ─── Diagnostics / testing services ─────────────────────────────────────
  'levels-health': 'https://www.levelshealth.com/',
  'marek-health': 'https://marekhealth.com/',
  'elysium-basis': 'https://www.elysiumhealth.com/',
  'elysium-index': 'https://www.elysiumhealth.com/',
  'trudiagnostic': 'https://www.trudiagnostic.com/',
  'viome': 'https://www.viome.com/',
  'zoe': 'https://joinzoe.com/',
  'prolon': 'https://prolonlife.com/',

  // ─── Recovery equipment ──────────────────────────────────────────────────
  '2xu-compression': 'https://amzn.to/4p0DUxk',
  'air-relax': 'https://www.amazon.com/s?k=Air+Relax+compression+boots&tag=michaelregeer-20',
  'normatec-3': 'https://www.amazon.com/s?k=NormaTec+3&tag=michaelregeer-20',
  'triggerpoint-grid': 'https://www.amazon.com/s?k=TriggerPoint+GRID+foam+roller&tag=michaelregeer-20',
  'flexpulse': 'https://www.bemergroup.com/',
  'higherdose-pemf': 'https://www.higherdose.com/',
  'float-lab': 'https://www.thefloatlab.com/',
  'samadhi-tank': 'https://www.samadhitank.com/',

  // ─── Fitness equipment ───────────────────────────────────────────────────
  'bowflex-552': 'https://www.amazon.com/s?k=Bowflex+SelectTech+552&tag=michaelregeer-20',
  'concept2-rowerg': 'https://www.amazon.com/s?k=Concept2+RowErg&tag=michaelregeer-20',
  'rep-pr4000': 'https://www.repfitness.com/',

  // ─── Supplements — Amazon-linked ─────────────────────────────────────────
  'bulk-creatine': 'https://amzn.to/4p9D4Pe',
  'dihydroberberine': 'https://www.amazon.com/s?k=dihydroberberine+glucovantage&tag=michaelregeer-20',
  'dw-berberine': 'https://www.amazon.com/s?k=Double+Wood+Berberine&tag=michaelregeer-20',
  'it-berberine': 'https://amzn.to/3SJ1nap',
  'jarrow-ashwagandha': 'https://www.amazon.com/s?k=Jarrow+Ashwagandha&tag=michaelregeer-20',
  'jarrow-bacopa': 'https://www.amazon.com/s?k=Jarrow+Bacopa&tag=michaelregeer-20',
  'le-dk2': 'https://amzn.to/44djRCp',
  'le-ubiquinol': 'https://amzn.to/3SJ1HG9',
  'magtein': 'https://amzn.to/4eMdUm0',
  'momentous-ashwagandha': 'https://www.livemomentous.com/',
  'nootropics-depot-lions-mane': 'https://nootropicsdepot.com/',
  'now-ashwagandha': 'https://amzn.to/4fi37A5',
  'now-ps': 'https://amzn.to/4vNpp2M',
  'now-quercetin': 'https://amzn.to/4y68Q3p',
  'on-creatine': 'https://www.amazon.com/s?k=Optimum+Nutrition+Creatine&tag=michaelregeer-20',
  'pterostilbene': 'https://amzn.to/4eZjMqS',
  'qunol-coq10': 'https://www.amazon.com/s?k=Qunol+Ubiquinol+CoQ10&tag=michaelregeer-20',
  'real-mushrooms-lions-mane': 'https://www.realmushrooms.com/',
  'ritual-synbiotic': 'https://ritual.com/',
  'sr-dk2': 'https://www.amazon.com/s?k=Sports+Research+Vitamin+D3%2BK2&tag=michaelregeer-20',
  'uc2-collagen': 'https://amzn.to/4y3FNO5',
  'vital-proteins': 'https://amzn.to/4ve8rJF',
  'wonderfeel-youngr': 'https://getwonderfeel.com/',
  'donotage-spermidine': 'https://donotage.org/',
  'bioptimizers-magnesium': 'https://bioptimizers.com/',
  'biolite-sunlight': 'https://amzn.to/4gWOC61',

  // ─── New products (cardio/sleep/nutrition/stress page linking pass) ────
  'real-mushrooms-reishi': 'https://www.realmushrooms.com/',
  'real-mushrooms-cordyceps': 'https://www.realmushrooms.com/',
  'now-l-theanine': 'https://amzn.to/4eTkTZa',
  'dw-apigenin': 'https://www.amazon.com/s?k=Double+Wood+Apigenin&tag=michaelregeer-20',
  'bulk-glycine': 'https://amzn.to/4y51kGa',
  'now-chromium': 'https://amzn.to/4y6tCQx',
  'now-cinnamon': 'https://amzn.to/3SISFsO',
  'thorne-vitamin-e': 'https://www.amazon.com/s?k=Thorne+Vitamin+E+Mixed+Tocopherols&tag=michaelregeer-20',
  'now-alcar': 'https://amzn.to/44cg8Fk',
  'now-beta-alanine': 'https://amzn.to/4vntMk8',
  'superbeets': 'https://www.humann.com/',
  'now-sodium-bicarbonate': 'https://amzn.to/4p9EIAo',
  'now-tart-cherry': 'https://amzn.to/4aVExCT',
}

/** In-app hop path used everywhere (cards, MDX, protocols). */
export function goPath(productSlug: string): string {
  return `/go/${productSlug}`
}

/** Resolve a product slug to its external affiliate destination (for redirects). */
export function getAffiliateDestination(productSlug: string): string | null {
  return affiliateLinks[productSlug] ?? null
}

/**
 * True only when the destination carries a real affiliate identifier
 * (Amazon Associates tag / amzn.to short link, Awin, or a named referral link).
 * Plain brand URLs (no affiliate programme joined) return false, so callers can
 * omit rel="sponsored" and the affiliate label for them.
 */
const REAL_AFFILIATE_HOSTS = ['amazon.com', 'amzn.to', 'awin1.com', 'oxfordhealthspan.com', 'sunlighten.com']

export function isAffiliateDestination(productSlug: string): boolean {
  const dest = affiliateLinks[productSlug]
  if (!dest || dest.startsWith('/')) return false
  try {
    const host = new URL(dest).hostname.replace(/^www\./, '')
    return REAL_AFFILIATE_HOSTS.some(h => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}
