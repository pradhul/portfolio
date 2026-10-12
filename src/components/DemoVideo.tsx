type DemoVideoProps = {
  mp4: string
  webm?: string
  poster: string
  alt: string
  className?: string
}

export default function DemoVideo({ mp4, webm, poster, alt, className }: DemoVideoProps) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      preload="metadata"
      aria-label={alt}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={mp4} type="video/mp4" />
    </video>
  )
}
