import {
  Clock,
  Gauge,
  Keyboard,
  Pause,
  Play,
  RotateCcw,
  Target,
  Upload,
  Zap,
} from 'lucide-react'
import { formatTime } from '../utils/metricsCalculator'
import { LAYOUTS } from '../utils/keyMappings'

function Metric({ icon: Icon, label, value, accent = 'text-sky-400' }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-1.5">
      <Icon className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden="true" />
      <div className="leading-tight">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <p className="font-mono text-sm font-bold tabular-nums text-slate-100">{value}</p>
      </div>
    </div>
  )
}

const actionBase =
  'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40'

export default function Header({
  metrics,
  elapsedMs,
  status,
  layout,
  onToggleLayout,
  onOpenCode,
  onReset,
  onTogglePause,
}) {
  const canPause = status === 'running' || status === 'paused'

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/20">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold text-white">
              Code<span className="text-sky-400">Typing</span>
            </h1>
            <p className="hidden text-[11px] text-slate-500 sm:block">Mecanografía para devs</p>
          </div>
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-2 sm:order-2 sm:ml-auto sm:w-auto">
          <Metric icon={Gauge} label="WPM" value={metrics.wpm} accent="text-sky-400" />
          <Metric icon={Zap} label="CPM" value={metrics.cpm} accent="text-emerald-400" />
          <Metric icon={Target} label="Precisión" value={`${metrics.accuracy}%`} accent="text-amber-400" />
          <Metric icon={Clock} label="Tiempo" value={formatTime(elapsedMs)} accent="text-violet-400" />
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:ml-0">
          <button
            type="button"
            onClick={onToggleLayout}
            className={`${actionBase} border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500/60 hover:text-sky-300`}
            title="Cambiar distribución del teclado"
          >
            <Keyboard className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">{LAYOUTS[layout].label}</span>
            <span className="md:hidden">{layout === 'en-US' ? 'US' : 'ES'}</span>
          </button>

          <button
            type="button"
            onClick={onTogglePause}
            disabled={!canPause}
            className={`${actionBase} border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500/60 hover:text-sky-300`}
            title={status === 'paused' ? 'Reanudar (Esc)' : 'Pausar (Esc)'}
            aria-label={status === 'paused' ? 'Reanudar' : 'Pausar'}
          >
            {status === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onReset}
            className={`${actionBase} border-slate-700 bg-slate-900 text-slate-300 hover:border-rose-500/60 hover:text-rose-300`}
            title="Reiniciar lección"
            aria-label="Reiniciar lección"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenCode}
            className={`${actionBase} border-sky-500/50 bg-sky-500/15 text-sky-300 hover:bg-sky-500/25`}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cargar código</span>
          </button>
        </div>
      </div>
    </header>
  )
}
