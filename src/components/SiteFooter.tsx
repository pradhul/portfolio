'use client'

import { useLanguage } from '@/components/LanguageProvider'

export default function SiteFooter({
  brand = 'Pradhul Dev',
}: {
  brand?: string
}) {
  const { tString } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line py-7 text-cream-muted">
      <div className="schematic-wrap font-mono text-[13px] tracking-[0.04em]">
        <span>
          © {year} {tString('footer.copyright') || `${brand}. All rights reserved.`}
        </span>
      </div>
    </footer>
  )
}
