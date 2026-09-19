// src/utils/structuredData.js
// Centralized Schema.org JSON-LD generator for prerendered public routes.
// Uses ONLY verified public facts from the project — no invented data.

const SITE_ORIGIN = 'https://shieldintelligence.in';
const ORG_ID = `${SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const OG_IMAGE = `${SITE_ORIGIN}/logo512.png`;

// Verified organization facts — sourced from index.html, About.jsx, Footer.jsx
const ORGANIZATION = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'SHIELD Intelligence',
  url: `${SITE_ORIGIN}/`,
  slogan: 'Securing Tomorrow with Strategic Intelligence',
  description:
    'SHIELD Intelligence builds secure software, privacy-conscious digital systems, custom websites, authentication tools, and service workflows for India and international clients.',
  alternateName: 'SHIELD Intelligence — Secure Hub of Intelligence, Elegance, Learning, and Development',
  foundingDate: '2024',
  email: 'shield@shieldintelligence.in',
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_ORIGIN}/#logo`,
    url: OG_IMAGE,
    width: 512,
    height: 512,
    caption: 'SHIELD Intelligence logo',
  },
  image: { '@id': `${SITE_ORIGIN}/#logo` },
  sameAs: [
    'https://x.com/0_SHIELD_0',
    'https://instagram.com/shield_private',
    'https://www.facebook.com/people/Shield-Intelligence/pfbid0K5nsekxw2ifc2SSUmWPUMgniDb3CDuTs888UiRt2WSss1rARFkHYUFS9jMBBGMCrl/',
    'https://www.linkedin.com/company/shield-intelligence/',
  ],
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_ORIGIN}/`,
  name: 'SHIELD Intelligence',
  description: ORGANIZATION.description,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-IN',
};

// Route meta — titles/descriptions MUST match updateSEO calls (verified)
const ROUTE_META = {
  '/': {
    name: 'SHIELD Intelligence | Secure Software & Digital Systems',
    description: 'SHIELD Intelligence builds secure software, authentication tools, and privacy-focused digital products. Request services, explore our products, or join as a contributor.',
  },
  '/about': {
    name: 'About Us | SHIELD Intelligence',
    description: 'SHIELD Intelligence designs and delivers secure, privacy-conscious software systems and digital products built for real-world use.',
  },
  '/who-we-are': {
    name: 'Who We Are | SHIELD Intelligence',
    description: 'Meet the team behind SHIELD Intelligence — Reyansh Raj Mishra, Akshit Pandey, Shubham Kumar Upadhyay, and Aditya Pandey.',
  },
  '/our-work': {
    name: 'Our Work | SHIELD Intelligence',
    description: 'Explore SHIELD Intelligence\'s portfolio — Green Lawns Public School (Ballia) website and our secure software solutions.',
  },
  '/request-service': {
    name: 'Request a Service | SHIELD Intelligence',
    description: 'Request secure software development, digital products, and custom technology solutions from SHIELD Intelligence.',
  },
  '/enterprise-consultation': {
    name: 'Enterprise Consultation | SHIELD Intelligence',
    description: 'Request enterprise-grade consultation, custom software solutions, and strategic technology planning from SHIELD Intelligence.',
  },
  '/join-us': {
    name: 'Join SHIELD Intelligence | Build, Learn, and Contribute',
    description: 'Apply to join SHIELD Intelligence as a student or contributor.',
  },
  '/privacy': {
    name: 'Privacy Policy | SHIELD Intelligence',
    description: 'Privacy policy for SHIELD Intelligence, including data collection, use, retention, cookies, and international clients.',
  },
  '/terms': {
    name: 'Terms and Conditions | SHIELD Intelligence',
    description: 'Terms and conditions governing service requests and use of SHIELD Intelligence platforms.',
  },
  '/join-us-terms': {
    name: 'Join SHIELD Intelligence – Terms & Conditions',
    description: 'Terms and conditions governing applications to join SHIELD Intelligence as a student or contributor.',
  },
  '/login': {
    name: 'User Login | SHIELD Intelligence',
    description: 'Secure login portal for SHIELD Intelligence authorized personnel.',
  },
};

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

function canonicalFor(pathname) {
  const p = normalizePath(pathname);
  return p === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${p}`;
}

function webpageId(pathname) {
  const c = canonicalFor(pathname);
  return c === `${SITE_ORIGIN}/` ? `${SITE_ORIGIN}/#webpage` : `${c}#webpage`;
}

function buildWebPage(pathname) {
  const meta = ROUTE_META[normalizePath(pathname)] || ROUTE_META['/'];
  const canonical = canonicalFor(pathname);
  return {
    '@type': 'WebPage',
    '@id': webpageId(pathname),
    url: canonical,
    name: meta.name,
    description: meta.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@id': `${SITE_ORIGIN}/#logo` },
    inLanguage: 'en-IN',
  };
}

function buildBreadcrumb(pathname) {
  const p = normalizePath(pathname);
  if (p === '/') return null;
  const labelMap = {
    '/about': 'About',
    '/who-we-are': 'Who We Are',
    '/our-work': 'Our Work',
    '/request-service': 'Request a Service',
    '/enterprise-consultation': 'Enterprise Consultation',
    '/join-us': 'Join Us',
  };
  const label = labelMap[p] || p.replace(/^\//, '').replace(/-/g, ' ');
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalFor(p)}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_ORIGIN}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: canonicalFor(p),
      },
    ],
  };
}

function buildPersons() {
  return [
    {
      '@type': 'Person',
      '@id': `${SITE_ORIGIN}/who-we-are#reyansh-raj-mishra`,
      name: 'Reyansh Raj Mishra',
      jobTitle: 'Founder | Chief Executive Officer',
      affiliation: { '@id': ORG_ID },
      worksFor: { '@id': ORG_ID },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_ORIGIN}/who-we-are#akshit-pandey`,
      name: 'Akshit Pandey',
      jobTitle: 'Co-Founder | Chief Operations Officer',
      affiliation: { '@id': ORG_ID },
      worksFor: { '@id': ORG_ID },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_ORIGIN}/who-we-are#shubham-kumar-upadhyay`,
      name: 'Shubham Kumar Upadhyay',
      jobTitle: 'Engineer | Co-Founder | Chief Growth Officer',
      affiliation: { '@id': ORG_ID },
      worksFor: { '@id': ORG_ID },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_ORIGIN}/who-we-are#aditya-pandey`,
      name: 'Aditya Pandey',
      jobTitle: 'Chief Financial Officer | Co-Founder',
      affiliation: { '@id': ORG_ID },
      worksFor: { '@id': ORG_ID },
    },
  ];
}

function buildSoftwareApplication() {
  // Verified: Web via https://shield-auth.shieldintelligence.in (Home.jsx:372 labeled "SHIELD Authenticator (Web)"), Android via https://download.shieldintelligence.in/SHIELD-Authenticator.apk + APPARCHIVE/README.md (SHIELD-Authenticator com.shieldintelligence.authenticator v2.5) + shield-authenticator/capacitor.config.ts appId + android/ folder
  return {
    '@type': 'SoftwareApplication',
    '@id': 'https://shield-auth.shieldintelligence.in/#app',
    name: 'SHIELD Authenticator',
    url: 'https://shield-auth.shieldintelligence.in',
    applicationCategory: 'SecurityApplication',
    operatingSystem: ['Web', 'Android'],
    description: 'A privacy-first, TOTP-based authentication tool designed to give you full control over your authentication data with end-to-end encryption and zero-knowledge architecture.',
    publisher: { '@id': ORG_ID },
    offers: undefined,
  };
}

function buildShieldApp() {
  // Verified: Main SHIELD Android app — capacitor.config.json appId com.shieldintelligence.in, appName SHIELD, android/ folder with SHIELD builds, APPARCHIVE/README.md lists SHIELD.apk com.shieldintelligence.in v1.5 served via https://download.shieldintelligence.in/SHIELD.apk, and Home.jsx:387 Download Android App (APK) tile at https://download.shieldintelligence.in
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_ORIGIN}/#app`,
    name: 'SHIELD',
    url: SITE_ORIGIN + '/',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Android',
    description: 'SHIELD — packaged Android application of the SHIELD Intelligence website, providing access to SHIELD services and content on Android devices.',
    publisher: { '@id': ORG_ID },
  };
}

function buildServices(pathname) {
  const p = normalizePath(pathname);
  if (p === '/request-service') {
    return {
      '@type': 'Service',
      '@id': `${SITE_ORIGIN}/request-service#service`,
      name: 'Secure Software Development',
      description: 'Custom websites, web applications, dashboards, and internal tools for businesses needing reliable, maintainable solutions.',
      provider: { '@id': ORG_ID },
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      url: canonicalFor(p),
    };
  }
  if (p === '/enterprise-consultation') {
    return {
      '@type': 'Service',
      '@id': `${SITE_ORIGIN}/enterprise-consultation#service`,
      name: 'Enterprise Consultation',
      description: 'Enterprise-grade consultation, custom software solutions, and strategic technology planning for organizations.',
      provider: { '@id': ORG_ID },
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      url: canonicalFor(p),
    };
  }
  return null;
}

const PUBLIC_INDEXABLE = new Set(['/', '/about', '/who-we-are', '/our-work', '/request-service', '/enterprise-consultation', '/join-us']);
const KNOWN_VALID = new Set(['/', '/about', '/who-we-are', '/our-work', '/request-service', '/enterprise-consultation', '/join-us', '/privacy', '/terms', '/join-us-terms', '/login', '/dashboard']);

export function buildGraph(pathname) {
  const p = normalizePath(pathname);
  const graph = [];

  // Organization and WebSite on every page (consistent entity if known)
  // For unknown 404, do not emit misleading WebPage — only Organization/WebSite to avoid indexable canonical
  if (!KNOWN_VALID.has(p)) {
    graph.push(ORGANIZATION);
    graph.push(WEBSITE);
    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }

  graph.push(ORGANIZATION);
  graph.push(WEBSITE);

  // WebPage for known routes only
  graph.push(buildWebPage(p));

  // Breadcrumb for non-home public indexable only
  if (PUBLIC_INDEXABLE.has(p)) {
    const bc = buildBreadcrumb(p);
    if (bc) graph.push(bc);
  }

  // Route-specific entities only for public indexable
  if (p === '/') {
    graph.push(buildSoftwareApplication());
    graph.push(buildShieldApp());
  }
  if (p === '/who-we-are') {
    graph.push(...buildPersons());
  }
  const svc = buildServices(p);
  if (svc) graph.push(svc);

  // Legal/private pages intentionally have no extra Service/Person to avoid over-schema

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function injectStructuredData(pathname) {
  if (typeof document === 'undefined') return;
  const data = buildGraph(pathname);
  let script = document.getElementById('shield-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'shield-jsonld';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

export { SITE_ORIGIN, ORG_ID, WEBSITE_ID };
