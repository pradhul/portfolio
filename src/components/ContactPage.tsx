'use client'

import Link from 'next/link'
import ContactChannels from '@/components/ContactChannels'
import ContactForm from '@/components/ContactForm'
import HireCtas from '@/components/HireCtas'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { useLanguage } from '@/components/LanguageProvider'

function ContactInner() {
  const { t, tString } = useLanguage()
  const asList = (key: string): string[] => {
    const value = t(key)
    return Array.isArray(value) ? value : []
  }

  return (
    <>
      <Link href="/" className="mb-8 inline-flex items-center gap-2 font-mono text-[13px] text-cream-muted no-underline hover:text-lime">
        ← {tString('contact.backToHome')}
      </Link>
      <SectionHeading as="h1" kicker={tString('contact.sectionLabel')} title={tString('contact.title')} />
      <p className="mb-9 max-w-prose text-lg text-cream-muted">{tString('contact.subtitle')}</p>
      <div className="mb-8">
        <HireCtas hireLabel={tString('hero.hireMe')} upworkLabel={tString('hero.upwork')} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <ContactForm
          copy={{
            nameLabel: tString('contact.form.nameLabel'),
            emailLabel: tString('contact.form.emailLabel'),
            projectTypeLabel: tString('contact.form.projectTypeLabel'),
            budgetLabel: tString('contact.form.budgetLabel'),
            messageLabel: tString('contact.form.messageLabel'),
            messagePlaceholder: tString('contact.form.messagePlaceholder'),
            submit: tString('contact.form.submit'),
            sending: tString('contact.form.sending'),
            success: tString('contact.form.success'),
            error: tString('contact.form.error'),
            unavailable: tString('contact.form.unavailable'),
            honeypotLabel: tString('contact.form.honeypotLabel'),
            projectTypes: asList('contact.form.projectTypes'),
            budgets: asList('contact.form.budgets'),
          }}
          locationNote={tString('contact.locationNote')}
        />
        <ContactChannels heading={tString('contact.connectLabel')} />
      </div>
    </>
  )
}

export default function ContactPage() {
  return (
    <SitePage current="contact">
      <ContactInner />
    </SitePage>
  )
}
