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
      'Pradhul Dev is a web and mobile developer with 8+ years of experience — VS Code extension author, former Software Engineering Master at HashedIn by Deloitte, available for hire.',
    eyebrow: 'WEB & MOBILE DEVELOPER',
    absoluteTitle: true,
  },
  about: {
    path: '/about',
    title: 'About',
    description:
      'Web and mobile developer with 8+ years of experience. VS Code extension author; former Software Engineering Master at HashedIn by Deloitte. Available for hire.',
    eyebrow: 'ABOUT',
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description:
      'Get in touch with Pradhul Dev — send a message, or reach out by email, LinkedIn, GitHub, Stack Overflow, and Upwork.',
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
  jobTitle: 'Web & Mobile Developer',
  email: 'mailto:pradhuldev.1990@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/pradhul-dev-30708814b/',
    'https://github.com/pradhul',
    'https://stackoverflow.com/users/3309470/p-rad',
    'https://www.upwork.com/freelancers/~01a32f29fafd184f21',
  ],
}
