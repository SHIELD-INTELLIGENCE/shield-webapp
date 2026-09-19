const SITE_ORIGIN = 'https://shieldintelligence.in';
const OG_IMAGE = 'https://shieldintelligence.in/logo512.png';
const OG_IMAGE_ALT = 'SHIELD Intelligence logo';

function normalizeCanonical(input) {
  try {
    if (typeof window === 'undefined' || !input) return '';
    // If input is absolute URL, parse it; otherwise treat as path
    let url;
    if (input.startsWith('http')) {
      url = new URL(input);
    } else {
      url = new URL(input, SITE_ORIGIN);
    }
    let pathname = url.pathname;
    // Strip trailing slash except for root
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    // Ignore query and hash — use pathname only
    return SITE_ORIGIN + pathname;
  } catch {
    return input;
  }
}

function upsertMeta(selector, create) {
  let el = document.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

export const setRobotsNoIndex = (content = 'noindex, follow') => {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'robots';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export const removeCanonical = () => {
  if (typeof document === 'undefined') return;
  const canon = document.querySelector('link[rel="canonical"]');
  if (canon) canon.remove();
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.remove();
};

export const updateSEO = (title, description, canonicalUrl = (typeof window !== 'undefined' ? window.location.href : '')) => {
  const normalizedCanonical = normalizeCanonical(canonicalUrl) || (typeof window !== 'undefined' ? normalizeCanonical(window.location.href) : '');

  if (title) {
    document.title = title;
    // og:title
    const ogTitle = upsertMeta('meta[property="og:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    });
    ogTitle.setAttribute('content', title);
    // twitter:title
    const twTitle = upsertMeta('meta[name="twitter:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:title');
      return m;
    });
    twTitle.setAttribute('content', title);
  }

  if (description) {
    const metaDesc = upsertMeta('meta[name="description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    });
    metaDesc.setAttribute('content', description);

    const ogDesc = upsertMeta('meta[property="og:description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      return m;
    });
    ogDesc.setAttribute('content', description);

    const twDesc = upsertMeta('meta[name="twitter:description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:description');
      return m;
    });
    twDesc.setAttribute('content', description);
  }

  if (normalizedCanonical) {
    const linkCanon = upsertMeta('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    linkCanon.setAttribute('href', normalizedCanonical);

    const ogUrl = upsertMeta('meta[property="og:url"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:url');
      return m;
    });
    ogUrl.setAttribute('content', normalizedCanonical);
  }

  // Ensure static OG/Twitter essentials exist (idempotent)
  upsertMeta('meta[property="og:type"]', () => {
    const m = document.createElement('meta');
    m.setAttribute('property', 'og:type');
    m.setAttribute('content', 'website');
    return m;
  }).setAttribute('content', 'website');

  upsertMeta('meta[property="og:site_name"]', () => {
    const m = document.createElement('meta');
    m.setAttribute('property', 'og:site_name');
    m.setAttribute('content', 'SHIELD Intelligence');
    return m;
  }).setAttribute('content', 'SHIELD Intelligence');

  upsertMeta('meta[property="og:image"]', () => {
    const m = document.createElement('meta');
    m.setAttribute('property', 'og:image');
    m.setAttribute('content', OG_IMAGE);
    return m;
  }).setAttribute('content', OG_IMAGE);

  upsertMeta('meta[property="og:image:alt"]', () => {
    const m = document.createElement('meta');
    m.setAttribute('property', 'og:image:alt');
    m.setAttribute('content', OG_IMAGE_ALT);
    return m;
  }).setAttribute('content', OG_IMAGE_ALT);

  upsertMeta('meta[name="twitter:card"]', () => {
    const m = document.createElement('meta');
    m.setAttribute('name', 'twitter:card');
    m.setAttribute('content', 'summary_large_image');
    return m;
  }).setAttribute('content', 'summary_large_image');

  upsertMeta('meta[name="twitter:image"]', () => {
    const m = document.createElement('meta');
    m.setAttribute('name', 'twitter:image');
    m.setAttribute('content', OG_IMAGE);
    return m;
  }).setAttribute('content', OG_IMAGE);
};
