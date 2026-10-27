export default function SiteFooter({
  brand = 'Pradhul Dev',
}: {
  brand?: string
}) {
  return (
    <footer className="border-t border-line py-7 text-cream-muted">
      <div className="schematic-wrap flex flex-wrap justify-between gap-3 font-mono text-[13px] tracking-[0.04em]">
        <span>
          © {new Date().getFullYear()} {brand} · Bangalore
        </span>
        <span>Drawing PD-2026 · Rev 2</span>
      </div>
    </footer>
  )
}