import { Award, Clock, FileCode2, Gauge, RotateCcw, Target, X, Zap } from 'lucide-react'
import { formatTime, topProblemKeys } from '../utils/metricsCalculator'

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        <Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" />
        {label}
      </div>
      <p className="font-mono text-lg font-bold tabular-nums text-slate-100">{value}</p>
    </div>
  )
}

export default function StatsModal({
  metrics,
  elapsedMs,
  errorCount,
  wrongKeys,
  bestWpm,
  onRestart,
  onNewCode,
  onClose,
}) {
  const problems = topProblemKeys(wrongKeys)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50"
      >
        <div className="relative border-b border-slate-800 bg-gradient-to-br from-sky-500/10 to-emerald-500/5 px-5 py-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar resumen"
          >
            <X className="h-5 w-5" />
          </button>
          <Award className="mx-auto mb-2 h-8 w-8 text-amber-400" aria-hidden="true" />
          <h2 id="stats-modal-title" className="text-lg font-bold text-white">
            ¡Lección completada!
          </h2>
          <p className="text-xs text-slate-500">
            Récord personal: <span className="font-semibold text-amber-300">{bestWpm} WPM</span>
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat icon={Gauge} label="WPM" value={metrics.wpm} tone="text-sky-400" />
            <Stat icon={Zap} label="CPM" value={metrics.cpm} tone="text-emerald-400" />
            <Stat icon={Target} label="Precisión" value={`${metrics.accuracy}%`} tone="text-amber-400" />
            <Stat icon={Clock} label="Tiempo" value={formatTime(elapsedMs)} tone="text-violet-400" />
          </div>

          <p className="text-center text-xs text-slate-500">
            {errorCount === 0 ? 'Cero errores. Impecable.' : `${errorCount} pulsaciones incorrectas en esta sesión.`}
          </p>

          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Teclas problemáticas
            </p>
            {problems.length === 0 ? (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
                Sin errores registrados.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {problems.map((problem) => (
                  <li
                    key={problem.key}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-2 py-1 font-mono text-xs text-red-200"
                  >
                    <span className="font-bold">
                      {problem.key === ' ' ? 'espacio' : problem.key === '\n' ? 'enter' : problem.key}
                    </span>
                    <span className="text-[10px] text-red-300/70">×{problem.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onNewCode}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            <FileCode2 className="h-4 w-4" aria-hidden="true" />
            Otro código
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/30"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Repetir lección
          </button>
        </div>
      </div>
    </div>
  )
}
