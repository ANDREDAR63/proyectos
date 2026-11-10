import { useMemo, useState } from 'react'
import { Check, FileCode2, Upload, X } from 'lucide-react'
import { presets } from '../data/presets'
import { normalizeText } from '../utils/textNormalizer'

export default function CodeModal({ currentText, onClose, onLoad }) {
  const [draft, setDraft] = useState(currentText)
  const [selected, setSelected] = useState(null)

  const stats = useMemo(() => {
    const clean = normalizeText(draft)
    return {
      chars: clean.replace(/\n/g, '').length,
      lines: clean ? clean.split('\n').length : 0,
    }
  }, [draft])

  function choosePreset(preset) {
    setDraft(preset.code)
    setSelected(preset.id)
  }

  function handleLoad() {
    if (!draft.trim()) return
    onLoad(normalizeText(draft), selected ?? 'custom')
  }

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
        aria-labelledby="code-modal-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-sky-400" aria-hidden="true" />
            <h2 id="code-modal-title" className="text-base font-semibold text-white">
              Cargar código
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Presets rápidos</p>
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => choosePreset(preset)}
                className={[
                  'flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors',
                  selected === preset.id
                    ? 'border-sky-500/60 bg-sky-500/10'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-800/50',
                ].join(' ')}
              >
                <span className="flex w-full items-center justify-between gap-1 text-xs font-semibold text-slate-200">
                  {preset.name}
                  {selected === preset.id && <Check className="h-3.5 w-3.5 text-sky-400" />}
                </span>
                <span className="text-[10px] text-slate-500">{preset.language}</span>
              </button>
            ))}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="custom-code" className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Tu código
            </label>
            <span className="font-mono text-[11px] text-slate-500">
              {stats.lines} líneas · {stats.chars} caracteres
            </span>
          </div>
          <textarea
            id="custom-code"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setSelected(null)
            }}
            rows={12}
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="Pega aquí el fragmento de código que quieres practicar..."
            className="scrollbar-thin w-full resize-y rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 font-mono text-[13px] leading-6 text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
          />
          <p className="mt-2 text-[11px] text-slate-500">
            Se normalizan saltos CRLF, se convierten tabs en 2 espacios y se eliminan caracteres invisibles.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleLoad}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-500/50 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Cargar lección
          </button>
        </div>
      </div>
    </div>
  )
}
