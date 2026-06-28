/**
 * Shared search-tag generation — used by the product and news editors so both
 * derive tags the same way: explicit phrases (kept whole) plus the most frequent
 * meaningful keywords pulled from the supplied text (titles + descriptions).
 */

// Generic words that add no search value.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'of', 'with', 'to', 'in', 'on', 'by',
  'at', 'as', 'is', 'are', 'be', 'this', 'that', 'these', 'those', 'it', 'its',
  'from', 'into', 'our', 'your', 'their', 'we', 'you', 'they', 'will', 'can',
  'has', 'have', 'was', 'were', 'than', 'then', 'also', 'more', 'most', 'such',
  'new', 'pro', 'plus', 'kit', 'system', 'systems', 'series', 'using', 'used',
  'use', 'all', 'each', 'any', 'one', 'two', 'which', 'when', 'where', 'how',
])

/** Strip HTML tags + entities, collapse whitespace → plain text. */
export function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Frequency-ranked keywords (≥3 chars, no stopwords). */
function topKeywords(text, max) {
  const words = (text || '').toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g) || []
  const freq = {}
  for (const w of words) if (!STOPWORDS.has(w)) freq[w] = (freq[w] || 0) + 1
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([w]) => w)
}

/**
 * Build a deduped, lowercase tag list.
 * @param {object}   opts
 * @param {string[]} opts.phrases  whole values kept verbatim (e.g. title, type)
 * @param {string[]} opts.texts    longer text (incl. HTML) mined for keywords
 * @param {number}   opts.maxKeywords  cap on mined keywords
 */
export function generateTags({ phrases = [], texts = [], maxKeywords = 14 } = {}) {
  const out = []
  for (const p of phrases) {
    const t = String(p || '').trim().toLowerCase().replace(/\s+/g, ' ')
    if (t) out.push(t)
  }
  const combined = texts.map(stripHtml).join(' ')
  for (const w of topKeywords(combined, maxKeywords)) out.push(w)
  return [...new Set(out)]
}
