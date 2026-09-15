import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  Coffee,
  Compass,
  Database,
  Flask,
  ListChecks,
  Notebook,
} from '@phosphor-icons/react'
import Reveal from '#/components/Reveal'
import WordReveal from '#/components/WordReveal'

export const Route = createFileRoute('/lab')({
  head: () => ({
    meta: [
      {
        title: 'Build Log — proof of concepts from this app',
      },
      {
        name: 'description',
        content:
          'A running log of proof of concepts built inside this TanStack Start app: what each one tested, what broke, and the working demo you can open again.',
      },
    ],
  }),
  component: LabPage,
})

const pocs = [
  {
    title: 'Optimistic favorites on a coffee list',
    description:
      'Each card gets its own mutation instance, so toggling one favorite in flight never clobbers the pending state of another.',
    href: '/demo/coffee',
    icon: Coffee,
  },
  {
    title: 'Todos on serverless Neon Postgres',
    description:
      'Server functions read and write a Neon Postgres table directly, with no separate API layer to maintain.',
    href: '/demo/neon',
    icon: Database,
  },
  {
    title: 'useMutation with optimistic updates',
    description:
      'invalidateQueries and an optimistic todo update, end to end, so the list feels instant while the write is still in flight.',
    href: '/demo/usemutation',
    icon: ListChecks,
  },
]

const benefits = [
  {
    title: 'Nothing gets lost',
    body: 'Every entry keeps its working route linked, so a POC stays one click away instead of buried in a closed branch.',
    icon: BookOpen,
  },
  {
    title: 'Context survives',
    body: 'Each log captures why the experiment happened, not just the final diff.',
    icon: Notebook,
  },
  {
    title: 'Revisit fast',
    body: 'Jump straight into a running demo instead of re reading old pull requests.',
    icon: Compass,
  },
  {
    title: 'Grounded in real code',
    body: 'Every entry links to an actual route in this app, not a screenshot.',
    icon: Flask,
  },
]

const steps = [
  {
    title: 'Try an idea in a scratch route',
    body: 'Small and disposable, with no commitment to production quality.',
  },
  {
    title: 'Log what happened',
    body: 'What you tested, what broke, and what you would do differently.',
  },
  {
    title: 'Keep the demo linked',
    body: 'The working route stays reachable, so revisiting takes one click, not an archaeology dig.',
  },
]

const faqs = [
  {
    q: 'What counts as a POC here?',
    a: 'Any small, working experiment: a new API pattern, a library test, or a UI interaction that needed proving before it went further.',
  },
  {
    q: 'Do these run in production?',
    a: 'Yes. Every entry links to a live route inside this app, not a static screenshot.',
  },
  {
    q: 'How is this different from a commit message?',
    a: 'A commit says what changed. A log entry says why it was tried and what was learned.',
  },
  {
    q: 'Do I need an account to read one?',
    a: 'No. Every entry is open, no sign in required.',
  },
  {
    q: 'What happens once a POC graduates into the product?',
    a: 'The log entry stays as the record of how it got there, even after the code around it changes.',
  },
  {
    q: 'Can a POC fail?',
    a: 'Yes, and it stays logged anyway. A failed experiment saves someone the same afternoon later.',
  },
  {
    q: 'How often is this updated?',
    a: 'Whenever a new experiment lands, not on a fixed schedule.',
  },
]

function LabPage() {
  return (
    <main className="page-wrap px-4 pb-24 pt-14">
      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <p className="island-kicker mb-4">Build log</p>
          <h1
            className="mb-6 max-w-[680px] bg-[linear-gradient(90deg,var(--sea-ink),var(--sea-ink-soft))] bg-clip-text text-4xl leading-tight font-bold text-transparent sm:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            A lab notebook for developers
            <br />
            who learn by building
          </h1>
          <p
            className="mb-8 max-w-[680px] text-lg text-[var(--sea-ink-soft)]"
            style={{ textWrap: 'pretty' }}
          >
            Every proof of concept gets logged here: what it tested, what broke,
            and the working demo you can open again.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#proof"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--lagoon)] px-6 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]"
            >
              Read the latest POC
              <ArrowRight weight="bold" size={18} />
            </a>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
              3 POCs logged and live in this app
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="border border-[var(--line)] bg-[var(--surface-strong)] rounded-3xl p-6 shadow-[0_18px_34px_rgba(30,90,72,0.1)]">
            <p className="island-kicker mb-4">Latest entries</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {pocs.map((poc) => (
                <li
                  key={poc.href}
                  className="flex items-center gap-3 border border-[var(--line)] bg-[var(--foam)] rounded-xl px-4 py-3"
                >
                  <poc.icon
                    weight="regular"
                    size={20}
                    className="shrink-0 text-[var(--lagoon-deep)]"
                  />
                  <span className="text-sm font-semibold text-[var(--sea-ink)]">
                    {poc.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Problem to solution */}
      <Reveal className="mt-24">
        <div className="border border-[var(--line)] bg-[var(--surface-strong)] rounded-3xl p-8 sm:p-10">
          <h2 className="mb-3 max-w-[680px] text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
            Most experiments die in a stashed branch.
          </h2>
          <p className="m-0 max-w-[680px] text-base leading-8 text-[var(--sea-ink-soft)]">
            You try something on a Friday afternoon, it works, and by the next
            sprint you cannot remember why. This build log keeps the working
            code and the reasoning next to each other, so a Tuesday afternoon
            you is exactly where the Friday afternoon you left off.
          </p>
        </div>
      </Reveal>

      {/* Tagline reveal (B11) */}
      <section className="mt-24 py-16 text-center">
        <WordReveal
          lines={[
            'Most ideas do not need a plan.',
            'They need a place to land.',
          ]}
          className="mx-auto max-w-[680px] text-4xl leading-tight font-bold sm:text-6xl"
        />
      </section>

      {/* Benefits */}
      <section className="mt-24 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <Reveal key={benefit.title} delayMs={index * 90}>
            <article className="h-full border border-[var(--line)] bg-[var(--surface-strong)] rounded-2xl p-6">
              <benefit.icon
                weight="regular"
                size={24}
                className="mb-4 text-[var(--lagoon-deep)]"
              />
              <h3 className="mb-2 text-lg font-bold text-[var(--sea-ink)]">
                {benefit.title}
              </h3>
              <p className="m-0 text-base text-[var(--sea-ink-soft)]">
                {benefit.body}
              </p>
            </article>
          </Reveal>
        ))}
      </section>

      {/* How it works */}
      <Reveal className="mt-24">
        <p className="island-kicker mb-6 text-center">How it works</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-base font-bold text-[var(--lagoon-deep)]">
                {index + 1}
              </div>
              <h3 className="mb-2 text-base font-bold text-[var(--sea-ink)]">
                {step.title}
              </h3>
              <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Proof: real POC list */}
      <section id="proof" className="mt-24 scroll-mt-24">
        <Reveal>
          <p className="island-kicker mb-2 text-center">
            What is logged so far
          </p>
          <h2 className="mx-auto mb-10 max-w-[680px] text-center text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
            Live POCs, not screenshots
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {pocs.map((poc, index) => (
            <Reveal key={poc.href} delayMs={index * 90}>
              <a
                href={poc.href}
                className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface-strong)] rounded-2xl p-6 no-underline transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]"
              >
                <poc.icon
                  weight="regular"
                  size={24}
                  className="mb-4 text-[var(--lagoon-deep)]"
                />
                <h3 className="mb-2 text-base font-bold text-[var(--sea-ink)]">
                  {poc.title}
                </h3>
                <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
                  {poc.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--lagoon-deep)]">
                  Open demo
                  <ArrowSquareOut
                    weight="bold"
                    size={16}
                    className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <Reveal className="mt-24">
        <p className="island-kicker mb-6 text-center">Questions</p>
        <div className="mx-auto flex max-w-[680px] flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group border border-[var(--line)] bg-[var(--surface-strong)] rounded-xl px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--sea-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]">
                {faq.q}
                <ArrowRight
                  weight="bold"
                  size={16}
                  className="shrink-0 text-[var(--sea-ink-soft)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-90"
                />
              </summary>
              <p className="m-0 mt-3 text-sm leading-6 text-[var(--sea-ink-soft)]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* Final CTA, identical to top */}
      <Reveal className="mt-24 text-center">
        <p className="mb-4 text-sm text-[var(--sea-ink-soft)]">
          No sign up. No account. Just open the code.
        </p>
        <a
          href="#proof"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--lagoon)] px-6 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]"
        >
          Read the latest POC
          <ArrowRight weight="bold" size={18} />
        </a>
      </Reveal>
    </main>
  )
}
