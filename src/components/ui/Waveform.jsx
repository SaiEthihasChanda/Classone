/**
 * Waveform — the site's signature motif: a stylised electrochemical signal
 * trace. Used as a recurring brand graphic in heroes, section dividers and
 * cards. Decorative; aria-hidden.
 *
 * variant: 'cv' (duck-shaped voltammogram) | 'trace' (peak signal) | 'pulse'
 *
 * When `animated`, the static shape is replaced by a continuously *flowing*
 * wave: a periodic multi-harmonic line that scrolls horizontally forever with
 * no visible seam (it is built to be tileable over the 200-unit viewBox, then
 * translated by exactly one period — so the loop is pixel-identical).
 */
const PATHS = {
  // Cyclic voltammogram — the classic "duck" shape.
  cv: 'M2,60 C20,58 30,40 46,38 C70,35 64,12 92,14 C120,16 116,52 150,50 C176,48 170,70 198,70 C150,72 156,40 120,42 C92,44 96,80 60,78 C36,76 40,58 2,60 Z',
  // Peak signal trace.
  trace: 'M0,70 L40,70 C56,70 58,66 66,52 C74,38 80,18 92,18 C104,18 110,40 118,54 C126,68 130,70 146,70 C160,70 164,64 172,54 C180,44 184,40 200,40',
  // Square-ish pulse train.
  pulse: 'M0,64 L24,64 L24,28 L60,28 L60,64 L96,64 L96,20 L132,20 L132,64 L168,64 L168,36 L200,36',
}

// The wave's fundamental period (in viewBox units). Translating the flowing
// group by exactly this distance returns it to an identical state → seamless.
const PERIOD = 200

/**
 * Build a tileable wave path. Every component sine is an integer harmonic of
 * the fundamental (period 200), so the whole curve repeats every 200 units and
 * a -200 translate loops with no seam. Sampled over [-PERIOD, 2*PERIOD] so the
 * line always fills the view at any point during the scroll.
 */
function wavePath({ yc = 44, harmonics, step = 5 }) {
  const k = (2 * Math.PI) / PERIOD
  let d = ''
  for (let x = -PERIOD; x <= 2 * PERIOD; x += step) {
    let y = yc
    for (const [n, amp, phase] of harmonics) y += amp * Math.sin(n * k * x + phase)
    d += (d ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(2) + ' '
  }
  return d.trim()
}

// Two layered traces (lead line + softer echo) for a richer "signal" feel.
const FLOW_FRONT = wavePath({ yc: 46, harmonics: [[1, 16, 0], [2, 7, 0.9], [3, 3.5, 2.1]] })
const FLOW_BACK = wavePath({ yc: 44, harmonics: [[1, 13, 1.6], [2, 9, 0.2], [4, 3, 1.1]] })

export function Waveform({ variant = 'trace', className = '', animated = false, ...rest }) {
  const cls = `waveform ${animated ? 'waveform--flow' : ''} ${className}`.trim()

  if (animated) {
    return (
      <svg
        className={cls}
        viewBox="0 0 200 88"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        {...rest}
      >
        <g className="wf-flow wf-flow--back">
          <path d={FLOW_BACK} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.45" />
        </g>
        <g className="wf-flow wf-flow--front">
          <path d={FLOW_FRONT} stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    )
  }

  const d = PATHS[variant] || PATHS.trace
  const filled = variant === 'cv'
  return (
    <svg
      className={cls}
      viewBox="0 0 200 88"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      {...rest}
    >
      {filled && <path d={d} fill="currentColor" opacity="0.10" />}
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
