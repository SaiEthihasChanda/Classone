import { useEffect, useMemo, useRef, useState } from 'react'
import { AppLink } from '../components/common/AppLink'
import {
  Terminal, Braces, Smartphone, Cpu, Sliders, Code2, Github, BookOpen, Download,
  ArrowUpRight, ArrowRight, ArrowDown, CheckCircle, Copy, ChevronRight, Rocket, Puzzle,
} from '../components/ui/Icons'

/* ────────────────────────────────────────────────────────────────────────
   MYOS — Make Your Own Software
   A developer hub mirroring PalmSens' "Writing code for our hardware":
   the SDKs, the decision guide and MethodSCRIPT — re-imagined for ClassOne's
   two-colour theme with a code-first, developer-pleasing presentation.
   Every external link points 1:1 to the real SDK / docs destination.
   ──────────────────────────────────────────────────────────────────────── */

const ICONS = { Terminal, Braces, Smartphone, Cpu, Sliders, Code2 }

const SDKS = [
  {
    id: 'python', icon: 'Terminal', name: 'PyPalmSens', kicker: 'Python',
    blurb: 'A Python library for automating electrochemistry experiments. An intuitive, Pythonic API that drops straight into your existing workflows — every instrument supported, examples included.',
    points: ['Intuitive, Pythonic API', 'All instruments supported', 'Measurement examples bundled'],
    links: [
      { label: 'Python SDK', href: 'https://github.com/PalmSens/PalmSens_SDK/tree/main/python', kind: 'github' },
      { label: 'Documentation', href: 'https://dev.palmsens.com/python/latest/_attachments/index.html', kind: 'book' },
    ],
  },
  {
    id: 'dotnet', icon: 'Braces', name: 'SDKs for .NET', kicker: 'C# · VB.NET · MAUI',
    blurb: 'Libraries, documentation and code examples for WinForms, WPF and MAUI. Built for powerful Windows or Android devices — with analytical tools for peak detection and equivalent-circuit fitting.',
    points: ['WinForms, WPF & MAUI (Android + iOS)', 'Any .NET language — C#, VB.NET', 'Peak detection & circuit fitting'],
    note: 'Linux, macOS and Raspbian aren’t officially supported, but the .NET SDKs run via Mono.',
    links: [
      { label: 'Download .NET SDK (MAUI)', href: 'https://dev.palmsens.com/maui/latest/', kind: 'download' },
      { label: 'Which SDK should you use?', href: 'https://dev.palmsens.com/sdk/index.html#_which_sdk_should_you_use', kind: 'book' },
    ],
  },
  {
    id: 'mobile', icon: 'Smartphone', name: 'Mobile Devices', kicker: 'Android · iOS',
    blurb: 'Ship a custom Android or iOS app built on the PalmSens libraries — using the .NET SDK for MAUI, Visual Studio .NET and C#.',
    points: ['Native Android & iOS apps', 'Powered by the MAUI .NET SDK', 'Build in Visual Studio with C#'],
    links: [
      { label: 'Create a custom app', href: 'https://dev.palmsens.com/maui/latest/', kind: 'arrow' },
    ],
  },
  {
    id: 'matlab', icon: 'Cpu', name: 'SDK for MATLAB', kicker: 'For researchers',
    blurb: 'Looking for MATLAB integration? Control your potentiostat directly from MATLAB — the route researchers reach for.',
    points: ['Direct instrument control in MATLAB', 'Documented SDK & examples'],
    links: [
      { label: 'MATLAB SDK', href: 'https://github.com/PalmSens/PalmSens_SDK/tree/main/matlab', kind: 'github' },
      { label: 'Documentation', href: 'https://dev.palmsens.com/matlab/latest/index.html', kind: 'book' },
    ],
  },
  {
    id: 'labview', icon: 'Sliders', name: 'SDK for LabVIEW', kicker: 'Graphical control',
    blurb: 'Drive your instrument directly from LabVIEW with the dedicated SDK — wire measurements into your virtual instruments.',
    points: ['Native LabVIEW instrument control', 'Documented SDK & examples'],
    links: [
      { label: 'LabVIEW SDK', href: 'https://github.com/PalmSens/PalmSens_SDK/tree/main/labview', kind: 'github' },
      { label: 'Documentation', href: 'https://dev.palmsens.com/labview/latest/index.html', kind: 'book' },
    ],
  },
  {
    id: 'methodscript', icon: 'Code2', name: 'MethodSCRIPT', kicker: 'The native language',
    blurb: 'MethodSCRIPT™ is the script language our latest-generation instruments and modules speak. Use it from any programming language, on any OS or embedded system — generate snippets in PSTrace and go.',
    points: ['Works with any programming language', 'Any OS & embedded systems', 'Generate snippets in PSTrace'],
    links: [
      { label: 'Learn MethodSCRIPT', href: 'https://www.palmsens.com/knowledgebase-article/methodscript/', kind: 'arrow' },
    ],
  },
]

// "Which SDK should you use?" — the decision guide, as an interactive matcher.
const GUIDE = [
  { task: 'Develop a Python application',              pick: 'PyPalmSens SDK',        sdk: 'python' },
  { task: 'Develop a desktop app in Visual Studio',    pick: 'SDK for .NET',          sdk: 'dotnet' },
  { task: 'Develop an Android or iOS app',             pick: 'SDKs for iOS & Android', sdk: 'mobile' },
  { task: 'Embed an EmStat Pico or EmStat4M module',   pick: 'MethodSCRIPT',          sdk: 'methodscript' },
  { task: 'Control a potentiostat in MATLAB',          pick: 'SDK for MATLAB',        sdk: 'matlab' },
  { task: 'Control a potentiostat in LabVIEW',         pick: 'SDK for LabVIEW',       sdk: 'labview' },
]

const CODE = {
  python: {
    lang: 'Python · PyPalmSens',
    body: `import pypalmsens as ps

# Define a chronoamperometry measurement
method = ps.ChronoAmperometry(
    interval_time=0.01,
    potential=1.0,
    run_time=10.0,
)

# Discover, connect and run — in one call
measurement = ps.measure(method)

# Pull the results into a pandas DataFrame
df = measurement.dataset.to_dataframe()
print(df[['Time', 'Potential', 'Current']])`,
  },
  csharp: {
    lang: 'C# · .NET SDK',
    body: `using PalmSens;
using PalmSens.Techniques;

// Connect to the first available instrument
var devices = await CoreDependencies.GetConnectedDevices();
using var comm = await devices[0].ConnectAsync();

// Configure a linear sweep voltammetry scan
var lsv = new LinearSweep {
    BeginPotential = -0.5f,
    EndPotential   =  0.5f,
    StepPotential  =  0.01f,
    Scanrate       =  0.1f,
};

// Run it and read back the curve
var data = await comm.MeasureAsync(lsv);
foreach (var pt in data.GetCurveArray()[0].YAxisDataArray)
    Console.WriteLine(pt.Value);`,
  },
  methodscript: {
    lang: 'MethodSCRIPT · LSV',
    body: `e
var c
var p
set_pgstat_chan 0
set_pgstat_mode 2
set_max_bandwidth 200
set_range_minmax da -1 1
set_range ba 590u
set_autoranging ba 590n 590u
set_e -500m
cell_on
meas_loop_lsv p c -500m 500m 10m 1
    pck_start
    pck_add p
    pck_add c
    pck_end
endloop
on_finished:
cell_off`,
  },
}

const HERO_SNIPPET = CODE.python.body

/* ── small hooks/helpers ─────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => (typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduce(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduce
}

// Types out a string character-by-character (slows on line breaks for rhythm).
function useTypewriter(text, { speed = 22, startDelay = 400 } = {}) {
  const reduce = usePrefersReducedMotion()
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (reduce) { setOut(text); setDone(true); return }
    setOut(''); setDone(false)
    let i = 0
    let timer = setTimeout(function tick() {
      i += 1
      setOut(text.slice(0, i))
      if (i < text.length) {
        const prev = text[i - 1]
        timer = setTimeout(tick, prev === '\n' ? speed * 7 : prev === ' ' ? speed * 0.6 : speed)
      } else {
        setDone(true)
      }
    }, startDelay)
    return () => clearTimeout(timer)
  }, [text, reduce, speed, startDelay])
  return { out, done }
}

function LinkIcon({ kind }) {
  if (kind === 'github') return <Github />
  if (kind === 'book') return <BookOpen />
  if (kind === 'download') return <Download />
  return <ArrowUpRight />
}

function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      document.body.removeChild(ta)
    }
    setDone(true); setTimeout(() => setDone(false), 1600)
  }
  return (
    <button type="button" className={`code-copy ${done ? 'is-done' : ''}`.trim()} onClick={copy}
      aria-label={done ? 'Copied' : 'Copy code to clipboard'}>
      {done ? <CheckCircle /> : <Copy />}
      <span>{done ? 'Copied' : label}</span>
    </button>
  )
}

function CodeWindow({ code, name, typed, cursor }) {
  const text = (typed != null ? typed : code).replace(/\n$/, '')
  const lines = text.split('\n')
  return (
    <div className="codewin">
      <div className="codewin__bar">
        <span className="codewin__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="codewin__name">{name}</span>
        {typed == null && <CopyButton text={code} />}
      </div>
      <pre className="codewin__body" aria-label={name}>
        <code>
          {lines.map((ln, i) => (
            <span className="codewin__row" key={i}>
              <span className="codewin__ln">{i + 1}</span>
              <span className="codewin__txt">
                {ln === '' ? ' ' : ln}
                {cursor && i === lines.length - 1 && <span className="codewin__caret" />}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

/* ── Animated circuit board ───────────────────────────────────
   Procedurally builds Manhattan-routed "traces" with junction nodes, then sends
   short white "electricity" streaks flowing along a random subset of the wires
   (an animated stroke-dash travelling each path). Generated once per mount. */
function buildCircuit() {
  // Sized to roughly fill the "Pick your toolkit" section (heading + two card rows).
  const W = 1440, H = 1500, g = 56, pad = 22
  const cols = Math.floor((W - 2 * pad) / g)
  const rows = Math.floor((H - 2 * pad) / g)
  const ri = (n) => Math.floor(Math.random() * n)
  const X = (c) => pad + c * g
  const Y = (r) => pad + r * g
  const traces = [], nodes = []
  const TRACES = 48
  for (let k = 0; k < TRACES; k++) {
    let c = ri(cols + 1), r = ri(rows + 1)
    let horiz = Math.random() < 0.5
    const pts = [[c, r]]
    const segs = 3 + ri(4)
    for (let s = 0; s < segs; s++) {
      const len = 1 + ri(5)
      if (horiz) c = Math.max(0, Math.min(cols, c + (Math.random() < 0.5 ? len : -len)))
      else r = Math.max(0, Math.min(rows, r + (Math.random() < 0.5 ? len : -len)))
      pts.push([c, r])
      horiz = !horiz
    }
    // drop consecutive duplicate points (a clamped backtrack can repeat one)
    const clean = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1])
    if (clean.length < 2) continue
    const d = clean.map((p, i) => `${i ? 'L' : 'M'} ${X(p[0])} ${Y(p[1])}`).join(' ')
    traces.push(d)
    nodes.push({ x: X(clean[0][0]), y: Y(clean[0][1]), r: 2.6 })
    nodes.push({ x: X(clean[clean.length - 1][0]), y: Y(clean[clean.length - 1][1]), r: 3.1 })
  }
  // Pick a random subset of traces to electrify, each with its own speed/phase.
  const order = traces.map((_, i) => i).sort(() => Math.random() - 0.5)
  const pulses = order.slice(0, 11).map(i => ({
    d: traces[i],
    dur: (2.6 + Math.random() * 3.4).toFixed(2),
    delay: (-Math.random() * 6).toFixed(2),
    rev: Math.random() < 0.4,
  }))
  return { W, H, traces, nodes, pulses }
}

function CircuitBoard() {
  const { W, H, traces, nodes, pulses } = useMemo(buildCircuit, [])
  return (
    <svg className="ckt" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>{traces.map((d, i) => <path key={i} className="ckt-trace" d={d} pathLength="100" />)}</g>
      <g>{nodes.map((n, i) => <circle key={i} className="ckt-node" cx={n.x} cy={n.y} r={n.r} />)}</g>
      <g>
        {pulses.map((p, i) => (
          <path
            key={i} className="ckt-pulse" d={p.d} pathLength="100"
            style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, animationDirection: p.rev ? 'reverse' : 'normal' }}
          />
        ))}
      </g>
    </svg>
  )
}

/* ── page ─────────────────────────────────────────────────── */
export function MyosPage({ onNavigate }) {
  const { out: typed, done } = useTypewriter(HERO_SNIPPET)
  const [pick, setPick] = useState(GUIDE[0])
  const [tab, setTab] = useState('python')
  const hlTimer = useRef(null)

  const recommended = SDKS.find(s => s.id === pick.sdk)

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // "View details" — scroll to the matching SDK card AND pulse-highlight it. The
  // highlight is toggled directly on the DOM node (not via React state) so React
  // never re-writes the card's className — that would wipe the `is-revealed`
  // class the scroll-reveal observer added and make the card vanish.
  const viewDetails = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(`sdk-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.remove('is-highlight')
    void el.offsetWidth                 // reflow so the animation restarts every click
    el.classList.add('is-highlight')
    clearTimeout(hlTimer.current)
    hlTimer.current = setTimeout(() => el.classList.remove('is-highlight'), 2400)
  }
  useEffect(() => () => clearTimeout(hlTimer.current), [])

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="myos-hero section--dark">
        <div className="myos-hero__bg" aria-hidden="true"><span className="myos-hero__grid" /></div>
        <div className="container myos-hero__inner">
          <div className="myos-hero__copy">
            <p className="myos-eyebrow"><Braces /> Make Your Own Software</p>
            <h1 className="myos-hero__title">
              Take <span className="myos-underline">full control</span> of your hardware.
            </h1>
            <p className="myos-hero__lead">
              Build directly on our instruments and modules with the PalmSens Software
              Development Kits, MethodSCRIPT and ready-to-run code examples. Your language,
              your platform, your software.
            </p>
            <div className="myos-hero__cta">
              <a href="#sdks" className="btn btn--primary btn--lg" onClick={scrollTo('sdks')}>
                Explore the SDKs <ArrowDown />
              </a>
              <a href="https://www.palmsens.com/knowledgebase-article/methodscript/" target="_blank"
                rel="noreferrer" className="btn btn--outline btn--lg">
                MethodSCRIPT <ArrowUpRight />
              </a>
            </div>
            <ul className="myos-hero__chips" aria-label="Supported languages and platforms">
              {['Python', 'C#', '.NET', 'MAUI', 'Android', 'iOS', 'MATLAB', 'LabVIEW', 'MethodSCRIPT'].map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="myos-hero__media">
            <CodeWindow name="quickstart.py" typed={typed} cursor={!done} code={HERO_SNIPPET} />
          </div>
        </div>
        <div className="myos-hero__scroll" aria-hidden="true"><span /></div>
      </section>

      {/* ─── SDK GRID ─────────────────────────────────────── */}
      <section className="section myos-sdks" id="sdks">
        <div className="myos-sdks__bg" aria-hidden="true"><CircuitBoard /></div>
        <div className="container">
          <header className="myos-head" data-reveal>
            <p className="sh__eyebrow">Six ways in</p>
            <h2 className="sh__title">Pick your toolkit</h2>
            <p className="myos-head__lead">
              Every SDK ships with documentation and code examples. Choose the one that fits
              your stack — or speak to the instrument directly with MethodSCRIPT.
            </p>
          </header>
          <div className="myos-grid">
            {SDKS.map((sdk, i) => {
              const Icon = ICONS[sdk.icon]
              return (
                <article
                  key={sdk.id}
                  id={`sdk-${sdk.id}`}
                  className="myos-card"
                  data-reveal style={{ '--reveal-delay': `${i * 70}ms` }}
                >
                  <span className="myos-card__idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="myos-card__top">
                    <span className="myos-card__icon"><Icon /></span>
                    <span className="myos-card__kicker">{sdk.kicker}</span>
                  </div>
                  <h3 className="myos-card__name">{sdk.name}</h3>
                  <p className="myos-card__blurb">{sdk.blurb}</p>
                  <ul className="myos-card__points">
                    {sdk.points.map(p => (
                      <li key={p}><CheckCircle /> {p}</li>
                    ))}
                  </ul>
                  {sdk.note && <p className="myos-card__note">{sdk.note}</p>}
                  <div className="myos-card__links">
                    {sdk.links.map(l => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                        className="myos-link">
                        <LinkIcon kind={l.kind} /> {l.label}
                      </a>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── DECISION GUIDE (interactive matcher) ─────────── */}
      <section className="section section--alt myos-guide">
        <div className="container">
          <header className="myos-head" data-reveal>
            <p className="sh__eyebrow"><Puzzle /> Decision guide</p>
            <h2 className="sh__title">Which SDK should you use?</h2>
            <p className="myos-head__lead">Tell us what you’re building — we’ll point you to the right tool.</p>
          </header>
          <div className="myos-matcher" data-reveal>
            <ul className="myos-matcher__tasks" role="tablist" aria-label="What are you building?">
              {GUIDE.map(g => (
                <li key={g.sdk}>
                  <button
                    type="button" role="tab" aria-selected={pick.sdk === g.sdk}
                    className={`myos-task ${pick.sdk === g.sdk ? 'is-active' : ''}`.trim()}
                    onClick={() => setPick(g)}
                  >
                    <span className="myos-task__dot" aria-hidden="true" />
                    {g.task}
                    <ChevronRight className="myos-task__chev" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="myos-result" key={pick.sdk}>
              <span className="myos-result__badge">Recommended</span>
              <div className="myos-result__head">
                <span className="myos-result__icon">
                  {(() => { const I = ICONS[recommended.icon]; return <I /> })()}
                </span>
                <div>
                  <p className="myos-result__kicker">{recommended.kicker}</p>
                  <h3 className="myos-result__name">{pick.pick}</h3>
                </div>
              </div>
              <p className="myos-result__blurb">{recommended.blurb}</p>
              <div className="myos-result__links">
                {recommended.links.map(l => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn--primary btn--sm">
                    <LinkIcon kind={l.kind} /> {l.label}
                  </a>
                ))}
                <a href={`#sdk-${recommended.id}`} className="btn btn--ghost btn--sm" onClick={viewDetails(recommended.id)}>
                  View details <ArrowRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── METHODSCRIPT SPOTLIGHT ───────────────────────── */}
      <section className="section section--dark myos-spotlight">
        <div className="myos-spotlight__bg" aria-hidden="true" />
        <div className="container myos-spotlight__inner">
          <div className="myos-spotlight__copy" data-reveal>
            <p className="myos-eyebrow"><Terminal /> The native language</p>
            <h2 className="myos-spotlight__title">The language your instrument speaks</h2>
            <p className="myos-spotlight__lead">
              MethodSCRIPT™ runs on the latest generation of instruments and modules. Send it
              from any language, on any operating system — or embed it directly on an EmStat Pico
              or EmStat4M. Generate a starting script in PSTrace and iterate from there.
            </p>
            <ul className="myos-spotlight__list">
              <li><CheckCircle /> Use it from any programming language</li>
              <li><CheckCircle /> Runs on any OS and embedded systems</li>
              <li><CheckCircle /> Generate snippets in PSTrace for Windows</li>
              <li><CheckCircle /> Comes with many code examples</li>
            </ul>
            <a href="https://www.palmsens.com/knowledgebase-article/methodscript/" target="_blank"
              rel="noreferrer" className="btn btn--primary btn--md">
              Learn MethodSCRIPT <ArrowUpRight />
            </a>
          </div>
          <div className="myos-spotlight__media" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <CodeWindow name="lsv.mscr" code={CODE.methodscript.body} />
          </div>
        </div>
      </section>

      {/* ─── TABBED CODE VIEWER ───────────────────────────── */}
      <section className="section myos-code">
        <div className="container">
          <header className="myos-head" data-reveal>
            <p className="sh__eyebrow"><Code2 /> Copy. Paste. Measure.</p>
            <h2 className="sh__title">From zero to a running scan</h2>
            <p className="myos-head__lead">
              The same measurement, three ways. Grab a snippet and you’re talking to the
              hardware in minutes.
            </p>
          </header>
          <div className="myos-codeviewer" data-reveal>
            <div className="myos-tabs" role="tablist" aria-label="Code language">
              {Object.entries(CODE).map(([key, c]) => (
                <button key={key} type="button" role="tab" aria-selected={tab === key}
                  className={`myos-tab ${tab === key ? 'is-active' : ''}`.trim()}
                  onClick={() => setTab(key)}>
                  {key === 'python' ? 'Python' : key === 'csharp' ? 'C# (.NET)' : 'MethodSCRIPT'}
                </button>
              ))}
            </div>
            <div className="myos-codeviewer__win" key={tab}>
              <CodeWindow name={CODE[tab].lang} code={CODE[tab].body} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="myos-cta section--dark">
        <div className="container myos-cta__inner" data-reveal>
          <Rocket className="myos-cta__icon" />
          <h2 className="myos-cta__title">Start building today</h2>
          <p className="myos-cta__lead">
            Browse the instruments you’ll be controlling, or reach out — our team helps
            developers get integrated fast.
          </p>
          <div className="myos-cta__btns">
            <a href="https://github.com/PalmSens/PalmSens_SDK" target="_blank" rel="noreferrer"
              className="btn btn--primary btn--lg"><Github /> Browse the SDKs on GitHub</a>
            <AppLink href="/product" onNavigate={onNavigate} className="btn btn--outline btn--lg">
              Explore instruments <ArrowRight />
            </AppLink>
            <AppLink href="/contact" onNavigate={onNavigate} className="btn btn--ghost btn--lg">
              Talk to us
            </AppLink>
          </div>
        </div>
      </section>
    </>
  )
}
