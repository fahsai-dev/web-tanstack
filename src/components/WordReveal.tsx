import { useEffect, useRef, useState } from 'react'

export default function WordReveal({
  lines,
  className = '',
}: {
  lines: Array<string>
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  let wordIndex = 0

  return (
    <p ref={ref} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={line} className="block">
          {line.split(' ').map((word) => {
            const delay = wordIndex * 70
            wordIndex += 1
            return (
              <span
                key={`${lineIndex}-${word}`}
                style={{ transitionDelay: `${delay}ms` }}
                className={`inline-block text-[var(--sea-ink)] transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  active ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {word}&nbsp;
              </span>
            )
          })}
        </span>
      ))}
    </p>
  )
}
