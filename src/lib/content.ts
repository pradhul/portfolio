// English content structure - source for all translations
export const content = {
  brand: 'Pradhul Dev',
  nav: {
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    contact: 'Contact',
    guestbook: 'Guestbook',
  },
  hero: {
    title: 'Pradhul Dev',
    subtitle: 'Web & Mobile Developer — 8+ years',
    downloadResume: 'Resume',
    viewPortfolio: 'View Portfolio',
  },
  about: {
    title: 'About Me',
    githubActivity: 'GitHub Activity',
    paragraphs: [
      "Hi, I'm Pradhul, a passionate Web and Mobile Developer with over 8 years of experience crafting digital solutions.",
      'I specialize in building modern, responsive web applications and mobile apps that deliver exceptional user experiences. My expertise spans across various technologies and frameworks, allowing me to bring creative ideas to life.',
      "When I'm not coding, I enjoy creating developer tools and extensions that make the development workflow more efficient. Check out my VS Code extensions below!",
      'Beyond coding and hanging out with friends, I have a passion for beatboxing, exploring music and movies, and gaming on my Nintendo Switch. I train MMA to stay healthy and fit, and I love experimenting with new projects using my Raspberry Pi—always tinkering and learning something new.',
    ],
  },
  portfolio: {
    title: 'Portfolio',
    labels: {
      inProgress: 'In Progress',
      features: 'Features',
      upcoming: 'Upcoming',
    },
    ionicMeasure: {
      category: 'CHROME EXTENSION',
      title: 'Ionic Measure',
      description:
        'Pixel-perfect measurement overlay for Ionic 7/8 apps in Chrome. Inspect component box models, measure spacing between elements, and check edge alignment with full-screen guides—built for Stencil shadow DOM and ion-content scrolling.',
      features: [
        'Box model inspection for Stencil shadow DOM components',
        'Spacing measurements between any two elements',
        'Full-screen alignment guides that follow ion-content scrolling',
      ],
      upcomingFeatures: [],
      viewGitHub: 'View on GitHub',
      viewWebStore: 'View on Chrome Web Store',
      demoLabel: 'Ionic Measure demo',
    },
    squashPush: {
      category: 'VS CODE EXTENSION',
      title: 'Squash-Push',
      description: 'Simplify your Git workflow by squashing multiple commits before pushing to a remote repository. This extension streamlines the development process and keeps your commit history clean.',
      features: [
        'Squash multiple commits directly from the VS Code UI',
        'Push the squashed result to the remote in one step',
        'Keeps commit history readable without dropping to the terminal',
      ],
      upcomingFeatures: [],
      marketplace: 'VS Code Marketplace',
      viewGitHub: 'View on GitHub',
      demoLabel: 'squash-push demo',
    },
    vsColorCode: {
      category: 'VS CODE EXTENSION',
      title: 'vsColorCode',
      description: "A simple VS Code extension that randomly applies muted color themes to your workspace's status bar and title bar. This helps you visually distinguish between different projects or workspaces at a glance.",
      features: [
        'Random muted color assigned per workspace',
        'Tints both the status bar and title bar',
        'Makes it obvious which project window you are in',
      ],
      upcomingFeatures: [],
      marketplace: 'VS Code Marketplace',
      viewGitHub: 'View on GitHub',
      demoLabel: 'vsColorCode demo',
    },
    chartStudio: {
      category: 'WEB APP',
      title: 'Chart Studio',
      description: 'Create bar and pie charts from Excel (.xlsx, .xls) or CSV files. Upload your data, paste from Excel, or edit cells in the preview—then customize your chart (title, colors, legend, grid) and export as PNG or PDF.',
      features: [
        'Import from .xlsx, .xls, and CSV, or paste straight from Excel',
        'Edit cells inline in the live preview',
        'Customize title, colors, legend, and grid',
        'Export finished charts as PNG or PDF',
      ],
      upcomingFeatures: [],
      liveDemo: 'Live Demo',
      viewProject: 'View Project',
      demoLabel: 'Chart Studio',
    },
    uploadSpec: {
      category: 'WEB APP',
      title: 'UploadSpec',
      description:
        'Portal-ready photo and signature tools for Indian application portals. Resize to exact pixels and KB ranges for UPSC, SSC, bank exams, state PSC, passport, and more—processed entirely in your browser with no server upload.',
      features: [
        'Presets for UPSC, SSC, bank exams, state PSC, and passport formats',
        'Exact pixel dimensions and KB size targeting',
        'Photo and signature handled in one flow',
        'Fully client-side — no image ever leaves the browser',
      ],
      upcomingFeatures: [],
      liveDemo: 'Visit site',
      viewProject: 'View Project',
      demoLabel: 'UploadSpec',
    },
    linkShelf: {
      category: 'PWA',
      title: 'Link Shelf',
      description:
        'Household PWA for saving Instagram, YouTube, and other links via Telegram bot or the web UI. Tag and favorite items, search your shelf, and let Gemini auto-categorize multi-link drops—built with Next.js, Neon Postgres, and an installable progressive web app.',
      features: [
        'Save links from a Telegram bot or the installable web app',
        'Tag, favorite, and search everything on your shelf',
        'Gemini auto-categorizes bulk multi-link drops',
        'Daily digests group related saves into readable summaries',
      ],
      upcomingFeatures: [],
      liveDemo: 'Live Demo',
      viewProject: 'View Project',
      viewGitHub: 'View on GitHub',
      demoLabel: 'Link Shelf',
    },
    quickPlate: {
      category: 'TELEGRAM BOT',
      title: 'QuickPlate',
      description:
        'Private Telegram bot for a small household—send /recipe (optionally with up to 3 ingredients) and get one easy, healthy YouTube recipe with title, link, and thumbnail. Built on Cloudflare Workers, Workers KV for per-chat dedupe, and the YouTube Data API.',
      features: [
        '/recipe command with up to three optional ingredients',
        'Returns one easy, healthy YouTube recipe with thumbnail',
        'Per-chat dedupe via Workers KV so results stay fresh',
        'Runs entirely on Cloudflare Workers',
      ],
      upcomingFeatures: [],
      viewGitHub: 'View on GitHub',
      demoLabel: 'QuickPlate in Telegram',
    },
  },
  contact: {
    title: 'Get In Touch',
    subtitle: "Let's discuss your next project or just say hello!",
    connectLabel: 'Connect with me on',
  },
  guestbook: {
    title: 'Guestbook',
    subtitle: 'Drop a note, add your signature, and leave a little good vibe behind.',
    form: {
      nameLabel: 'Name (optional)',
      messageLabel: 'Message',
      signatureLabel: 'Signature',
      clearSignature: 'Clear signature',
      submit: 'Post to guestbook',
      posting: 'Posting...',
    },
    states: {
      empty: 'No entries yet. Be the first to leave a message.',
      loading: 'Loading entries...',
      success: 'Thanks! Your message was posted.',
    },
  },
  footer: {
    copyright: 'Pradhul Dev. All rights reserved.',
  },
}

// Bump when content structure or copy changes to invalidate cached translations.
export const CONTENT_VERSION = '6'
