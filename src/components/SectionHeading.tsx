export default function SectionHeading({
  index,
  title,
  as: Tag = 'h2',
  kicker,
}: {
  index?: string
  title: React.ReactNode
  activeFestival?: unknown
  as?: 'h1' | 'h2'
  kicker?: string
}) {
  return (
    <div className="sh mb-9">
      <div className="font-mono text-[13px] tracking-[0.04em] text-lime">{kicker ?? (index ? `Section ${index}` : null)}</div>
      <Tag className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-cream">
        {title}
      </Tag>
    </div>
  )
}
