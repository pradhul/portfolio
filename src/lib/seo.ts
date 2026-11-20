import type { Metadata } from 'next'

export const SITE_URL = 'https://pradhul.dev'
export const SITE_HOST = new URL(SITE_URL).hostname
export const SITE_NAME = 'Pradhul Dev'

export type PageSeo = {
  path: string
  title: string
  description: string
  ogTitle?: string
  eyebrow?: string
  absoluteTitle?: boolean
}

export const pages = {
  home: {
    path: '/',
    title: SITE_NAME,
    ogTitle: 'Pradhul Dev — Web & Mobile Developer',
    description:
      'Pradhul Dev is a Lead Technical Consultant at Perficient and a web and mobile developer with 8+ years of experience — VS Code extension author, formerly Software Engineering Master at HashedIn by Deloitte.',
    eyebrow: 'WEB & MOBILE DEVELOPER',
    absoluteTitle: true,
  },
  about: {
    path: '/about',
    title: 'About',
    description:
      'Lead Technical Consultant at Perficient and web and mobile developer with 8+ years of experience. VS Code extension author; formerly Software Engineering Master at HashedIn by Deloitte.',
    eyebrow: 'ABOUT',
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description:
      'Get in touch with Pradhul Dev — send a message, or reach out by email, LinkedIn, GitHub, or Stack Overflow.',
    eyebrow: 'CONTACT',
  },
  guestbook: {
    path: '/guestbook',
    title: 'Guestbook',
    description:
      'Sign the guestbook — leave a message and a signature for Pradhul Dev.',
    eyebrow: 'GUESTBOOK',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfolio',
    description:
      'Selected apps, Chrome and VS Code extensions, and developer tools by Pradhul Dev.',
    eyebrow: 'PORTFOLIO',
  },
  chartStudio: {
    path: '/portfolio/chartstudio',
    title: 'Chart Studio',
    description:
      'Create bar and pie charts from Excel (.xlsx, .xls) or CSV files. Upload your data, paste from Excel, or edit cells in the preview—then customize your chart and export as PNG or PDF.',
    eyebrow: 'WEB APP',
  },
  linkShelf: {
    path: '/portfolio/linkshelf',
    title: 'Link Shelf',
    description:
      'Household PWA for saving Instagram, YouTube, and other links via Telegram bot or the web UI. Tag and favorite items, search your shelf, and let Gemini auto-categorize multi-link drops.',
    eyebrow: 'PWA',
  },
  smspend: {
    path: '/portfolio/smspend',
    title: 'SMSpend',
    description:
      'Private Android app that turns bank and UPI debit SMS into a spend-by-category view, with monthly trends and CSV reports—built with Kotlin and Jetpack Compose.',
    eyebrow: 'MOBILE APP',
  },
  uploadSpec: {
    path: '/portfolio/uploadspec',
    title: 'UploadSpec',
    description:
      'Portal-ready photo and signature tools for Indian application portals. Resize to exact pixels and KB ranges for UPSC, SSC, bank exams, state PSC, passport, and more—processed entirely in your browser.',
    eyebrow: 'WEB APP',
  },
  squashPush: {
    path: '/portfolio/squashpush',
    title: 'Squash-Push',
    description:
      'A VS Code extension that simplifies your Git workflow by squashing multiple commits before pushing to a remote repository.',
    eyebrow: 'VS CODE EXTENSION',
  },
  glanceTv: {
    path: '/portfolio/glance-tv',
    title: 'Glance TV',
    description:
      'A lean Android TV home screen: daily Bing wallpaper, clock and weather, your apps, and a status line for the next holiday and upcoming orders—built in plain Java with no runtime dependencies.',
    eyebrow: 'ANDROID TV',
  },
  kadalas: {
    path: '/portfolio/kadalas',
    title: 'Kadalas',
    description:
      'A personal document vault that keeps your papers in your own Google Drive and syncs newer versions from Gmail — Expo for web, iOS, and Android, with no app-owned backend.',
    eyebrow: 'WEB APP',
  },
  fightcardHq: {
    path: '/portfolio/fightcard-hq',
    title: 'FightCard HQ',
    description:
      'A tournament manager for MMA and BJJ events — single-elimination brackets, match control, and a big-screen scoreboard with a dark fight-night look.',
    eyebrow: 'WEB APP',
  },
  sundry: {
    path: '/portfolio/sundry',
    title: 'Sundry',
    description:
      'A native macOS packing-list app: season-aware checklists generated on-device with Apple Intelligence. Free to run, with no API keys.',
    eyebrow: 'MACOS APP',
  },
  forgeLauncher: {
    path: '/portfolio/forge-launcher',
    title: 'Forge',
    description:
      'A minimal Android launcher, forked from Slim Launcher, with on-device icon packs so app icons can follow the wallpaper or a style you generate on the phone.',
    eyebrow: 'MOBILE APP',
  },
} as const satisfies Record<string, PageSeo>

export const publicPages: PageSeo[] = Object.values(pages)

export function pageUrl(path: string): string {
  if (path === '/') return SITE_URL
  return `${SITE_URL}${path}`
}

export function googleSiteVerification(
  value: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
): Metadata['verification'] | undefined {
  const token = value?.trim()
  if (!token) return undefined
  return { google: token }
}

export function createPageMetadata(page: PageSeo): Metadata {
  const ogTitle = page.ogTitle ?? `${page.title} | ${SITE_NAME}`
  const canonical = page.path

  return {
    title: page.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: page.description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: page.description,
    },
  }
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pradhul Dev',
  url: SITE_URL,
  jobTitle: 'Lead Technical Consultant',
  email: 'mailto:pradhuldev.1990@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/pradhul-dev-30708814b/',
    'https://github.com/pradhul',
    'https://stackoverflow.com/users/3309470/p-rad',
  ],
}
