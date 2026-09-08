// Single source of truth for portfolio project cards.
// Copy (category/title/description/features/upcoming) lives in src/lib/content.ts
// keyed by the same `id`, so it flows through the translation pipeline.
//
// Repo membership is both-ways via GitHub topic `portfolio`:
// tagged → create/update; untagged → remove on the next Sync.
// Until at least one repo is tagged, Sync only refreshes existing cards.

export type ProjectStatus = 'released' | 'in_progress'

export type ProjectRelease = {
  tag: string
  /** Null when the repo is private, so the badge renders unlinked. */
  url: string | null
  publishedAt: string
}

export type ProjectLinkType =
  | 'github'
  | 'liveDemo'
  | 'marketplace'
  | 'viewProject'
  | 'viewWebStore'

export type ProjectLink = {
  type: ProjectLinkType
  href: string
  /** Key under `portfolio.<id>` in content.ts holding the button label. */
  labelKey: string
  /** Internal Next routes skip target=_blank and the external-link icon. */
  internal?: boolean
  primary?: boolean
  hideIcon?: boolean
}

export type ProjectIcon =
  | { type: 'image'; src: string; alt: string }
  | { type: 'lucide'; name: 'BarChart3' | 'Bookmark' | 'UtensilsCrossed' }

export type ProjectMedia = {
  src: string
  alt: string
  width: number
  height: number
  /** GIFs must bypass the Next image optimizer to keep animating. */
  unoptimized?: boolean
  /** Centered, padded frame used by logo-only and portrait screenshots. */
  contain?: boolean
  maxWidthClass?: string
}

export type Project = {
  id: string
  /** "owner/name" — the lookup key used by the sync script. */
  githubRepo: string
  status: ProjectStatus
  release: ProjectRelease | null
  /** ISO timestamp of the last successful sync, used for change detection. */
  lastSyncedAt: string | null
  /** Hash of the README at last sync, used for change detection. */
  readmeHash: string | null
  figure: string
  icon: ProjectIcon
  media: ProjectMedia
  links: ProjectLink[]
  /** Flips the text/media columns so the grid alternates down the page. */
  reverseLayout?: boolean
}

const ICON_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export const ICON_BLUR_DATA_URL = ICON_BLUR

export const projects: Project[] = [
  {
    id: 'ionicMeasure',
    githubRepo: 'pradhul/ionic-measure-extension',
    status: 'released',
    release: {
          tag: 'v0.1.1',
          url: 'https://github.com/pradhul/ionic-measure-extension/releases/tag/v0.1.1',
          publishedAt: '2026-05-28',
        },
    lastSyncedAt: '2026-08-28T02:32:39.051Z',
    readmeHash: '11a1327f28479032',
    figure: 'Fig. 01',
    icon: { type: 'image', src: '/ionicMeasure/icon.png', alt: 'Ionic Measure Icon' },
    media: {
      src: '/ionicMeasure/demo.png',
      alt: 'Ionic Measure Demo',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'viewWebStore',
        href: 'https://chromewebstore.google.com/detail/cemannkhghihhipcokcbnnaklafbfnpj',
        labelKey: 'viewWebStore',
        primary: true,
      },
      {
        type: 'github',
        href: 'https://github.com/pradhul/ionic-measure-extension',
        labelKey: 'viewGitHub',
      },
    ],
  },
  {
    id: 'squashPush',
    githubRepo: 'pradhul/squash-push',
    status: 'in_progress',
    release: null,
    lastSyncedAt: '2026-08-28T02:32:40.427Z',
    readmeHash: '27f0b09d20429964',
    figure: 'Fig. 02',
    icon: { type: 'image', src: '/squashPush/icon.png', alt: 'Squash-Push Icon' },
    media: {
      src: '/squashPush/recording.gif',
      alt: 'Squash-Push Demo',
      width: 800,
      height: 600,
      unoptimized: true,
    },
    links: [
      {
        type: 'marketplace',
        href: 'https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push',
        labelKey: 'marketplace',
        primary: true,
      },
      {
        type: 'github',
        href: 'https://github.com/pradhul/squash-push',
        labelKey: 'viewGitHub',
      },
    ],
    reverseLayout: true,
  },
  {
    id: 'vsColorCode',
    githubRepo: 'pradhul/vscolorcode',
    status: 'in_progress',
    release: null,
    lastSyncedAt: '2026-08-28T02:32:41.736Z',
    readmeHash: 'e9f1ca4c411d83fb',
    figure: 'Fig. 03',
    icon: { type: 'image', src: '/vsColorCode/icon.png', alt: 'vsColorCode Icon' },
    media: {
      src: '/vsColorCode/demo.png',
      alt: 'vsColorCode Demo',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'marketplace',
        href: 'https://marketplace.visualstudio.com/items?itemName=PradhulDev.vscolorcode',
        labelKey: 'marketplace',
        primary: true,
      },
      {
        type: 'github',
        href: 'https://github.com/pradhul/vscolorcode',
        labelKey: 'viewGitHub',
      },
    ],
  },
  {
    id: 'uploadSpec',
    githubRepo: 'pradhul/uploadspec',
    status: 'released',
    release: {
          tag: 'v1.0.0',
          url: null,
          publishedAt: '2026-06-04',
        },
    lastSyncedAt: '2026-08-28T02:32:44.603Z',
    readmeHash: 'f3650bbf2512ab3b',
    figure: 'Fig. 05',
    icon: { type: 'image', src: '/uploadSpec/logo.svg', alt: 'UploadSpec' },
    media: {
      src: '/uploadSpec/logo.svg',
      alt: 'UploadSpec',
      width: 120,
      height: 120,
      contain: true,
    },
    links: [
      {
        type: 'liveDemo',
        href: 'https://uploadspec.web.app/',
        labelKey: 'liveDemo',
        primary: true,
      },
      {
        type: 'viewProject',
        href: '/portfolio/uploadspec',
        labelKey: 'viewProject',
        internal: true,
      },
    ],
  },
  {
    id: 'linkShelf',
    githubRepo: 'pradhul/link-shelf',
    status: 'released',
    release: {
          tag: 'v1.1.0',
          url: 'https://github.com/pradhul/link-shelf/releases/tag/v1.1.0',
          publishedAt: '2026-08-03',
        },
    lastSyncedAt: '2026-08-28T02:32:45.813Z',
    readmeHash: 'cf7407f94f56638a',
    figure: 'Fig. 06',
    icon: { type: 'lucide', name: 'Bookmark' },
    media: {
      src: '/linkShelf/demo.jpg',
      alt: 'Link Shelf',
      width: 1024,
      height: 556,
    },
    links: [
      {
        type: 'liveDemo',
        href: 'https://link-shelf-puce.vercel.app/',
        labelKey: 'liveDemo',
        primary: true,
      },
      {
        type: 'viewProject',
        href: '/portfolio/linkshelf',
        labelKey: 'viewProject',
        internal: true,
        hideIcon: true,
      },
      {
        type: 'github',
        href: 'https://github.com/pradhul/link-shelf',
        labelKey: 'viewGitHub',
      },
    ],
    reverseLayout: true,
  },
  {
    id: 'quickPlate',
    githubRepo: 'pradhul/quickplate',
    status: 'released',
    release: {
          tag: 'v1.0.0',
          url: 'https://github.com/pradhul/quickplate/releases/tag/v1.0.0',
          publishedAt: '2026-08-04',
        },
    lastSyncedAt: '2026-08-28T02:32:46.925Z',
    readmeHash: '9a1928de16f9dfde',
    figure: 'Fig. 07',
    icon: { type: 'lucide', name: 'UtensilsCrossed' },
    media: {
      src: '/quickPlate/demo.png',
      alt: 'QuickPlate Telegram bot — /recipe fish returns a blackened fish YouTube recipe',
      width: 544,
      height: 1024,
      contain: true,
      maxWidthClass: 'max-w-[280px]',
    },
    links: [
      {
        type: 'github',
        href: 'https://github.com/pradhul/quickplate',
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },  {
    id: 'smspend',
    githubRepo: 'pradhul/SMSpend',
    status: 'released',
    release: {
      tag: 'v1.0.6',
      url: null,
      publishedAt: '2026-08-29',
    },
    lastSyncedAt: '2026-09-02T14:45:24.187Z',
    readmeHash: '43deee01dfd42194',
    figure: 'Fig. 08',
    icon: { type: 'lucide', name: 'Bookmark' },
    media: {
      src: '/smspend/demo.png',
      alt: 'SMSpend',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'github',
        href: 'https://github.com/pradhul/SMSpend',
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },  {
    id: 'prism',
    githubRepo: 'pradhul/Prism',
    status: 'in_progress',
    release: null,
    lastSyncedAt: '2026-09-08T08:14:27.068Z',
    readmeHash: '81fb3a988c8cde0f',
    figure: 'Fig. 09',
    icon: { type: 'lucide', name: 'Bookmark' },
    media: {
      src: '/prism/demo.png',
      alt: 'Prism',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'github',
        href: 'https://github.com/pradhul/Prism',
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },  {
    id: 'unfear',
    githubRepo: 'pradhul/unfear',
    status: 'in_progress',
    release: null,
    lastSyncedAt: '2026-09-02T14:45:51.588Z',
    readmeHash: '816f9036c7cc2a51',
    figure: 'Fig. 10',
    icon: { type: 'lucide', name: 'Bookmark' },
    media: {
      src: '/unfear/demo.png',
      alt: 'Unfear',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'github',
        href: 'https://github.com/pradhul/unfear',
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },  {
    id: 'pixelPerfectOverlay',
    githubRepo: 'pradhul/pixel-perfect-overlay',
    status: 'in_progress',
    release: null,
    lastSyncedAt: '2026-09-02T14:46:00.095Z',
    readmeHash: 'd079f5a827851c83',
    figure: 'Fig. 11',
    icon: { type: 'lucide', name: 'Bookmark' },
    media: {
      src: '/pixelPerfectOverlay/demo.png',
      alt: 'Pixel Perfect Overlay',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'github',
        href: 'https://github.com/pradhul/pixel-perfect-overlay',
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },              {
    id: 'magnus',
    githubRepo: 'pradhul/magnus',
    status: 'in_progress',
    release: null,
    lastSyncedAt: '2026-09-08T08:14:42.120Z',
    readmeHash: 'edfc2a29d99d3e17',
    figure: 'Fig. 11',
    icon: { type: 'lucide', name: 'Bookmark' },
    media: {
      src: '/magnus/demo.png',
      alt: 'Magnus',
      width: 800,
      height: 600,
    },
    links: [
      {
        type: 'github',
        href: 'https://github.com/pradhul/magnus',
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },
]

export function findProjectByRepo(repo: string): Project | undefined {
  const needle = repo.toLowerCase()
  return projects.find((project) => project.githubRepo.toLowerCase() === needle)
}
