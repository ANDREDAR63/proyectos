import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import TypingBoard from './components/TypingBoard'
import VirtualKeyboard from './components/VirtualKeyboard'
import CodeModal from './components/CodeModal'
import StatsModal from './components/StatsModal'
import { presets } from './data/presets'
import { LAYOUTS } from './utils/keyMappings'
import { charsMatch, isDeadKey, normalizeText, resolveTypedChar } from './utils/textNormalizer'
import { computeMetrics } from './utils/metricsCalculator'

const ALLOW_BACKSPACE = true
const LAYOUT_STORAGE_KEY = 'codetyping:layout'
const BEST_WPM_STORAGE_KEY = 'codetyping:best-wpm'

function safeStorageValue(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [layout, setLayout] = useState(() => {
    const stored = safeStorageValue(LAYOUT_STORAGE_KEY, 'en-US')
    return LAYOUTS[stored] ? stored : 'en-US'
  })
  const [text, setText] = useState(() => normalizeText(presets[0].code))
  const [presetId, setPresetId] = useState(presets[0].id)

  const [status, setStatus] = useState('idle')
  const [index, setIndex] = useState(0)
  const [mistake, setMistake] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [wrongKeys, setWrongKeys] = useState({})
  const [startedAt, setStartedAt] = useState(null)
  const [finishedAt, setFinishedAt] = useState(null)
  const [tick, setTick] = useState(() => Date.now())
  const [bestWpm, setBestWpm] = useState(() => Number(safeStorageValue(BEST_WPM_STORAGE_KEY, 0)) || 0)

  const [codeModal, setCodeModal] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const pausedAtRef = useRef(null)
  const paused = status === 'paused'
  const elapsedMs = startedAt ? (finishedAt ?? tick) - startedAt : 0

  const metrics = useMemo(
    () => computeMetrics(correctCount, errorCount, elapsedMs),
    [correctCount, errorCount, elapsedMs],
  )

  const lessonLabel =
    presetId === 'custom'
      ? 'Código personalizado'
      : presets.find((preset) => preset.id === presetId)?.name ?? 'Lección'

  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
    } catch {
      /* almacenamiento no disponible */
    }
  }, [layout])

  useEffect(() => {
    if (status !== 'running') return undefined
    const id = setInterval(() => setTick(Date.now()), 200)
    return () => clearInterval(id)
  }, [status])

  useEffect(() => {
    if (status !== 'done' || !startedAt || !finishedAt) return
    const { wpm } = computeMetrics(correctCount, errorCount, finishedAt - startedAt)
    setBestWpm((previous) => {
      if (wpm <= previous) return previous
      try {
        localStorage.setItem(BEST_WPM_STORAGE_KEY, String(wpm))
      } catch {
        /* almacenamiento no disponible */
      }
      return wpm
    })
  }, [status, correctCount, errorCount, startedAt, finishedAt])

  const reset = useCallback((nextText) => {
    if (nextText !== undefined) setText(normalizeText(nextText))
    pausedAtRef.current = null
    setStatus('idle')
    setIndex(0)
    setMistake(null)
    setCorrectCount(0)
    setErrorCount(0)
    setWrongKeys({})
    setStartedAt(null)
    setFinishedAt(null)
    setTick(Date.now())
    setShowStats(false)
  }, [])

  const togglePause = useCallback(() => {
    if (status === 'running') {
      pausedAtRef.current = Date.now()
      setTick(Date.now())
      setStatus('paused')
    } else if (status === 'paused') {
      const delta = Date.now() - (pausedAtRef.current ?? Date.now())
      pausedAtRef.current = null
      setStartedAt((previous) => (previous ? previous + delta : previous))
      setStatus('running')
    }
  }, [status])

  useEffect(() => {
    function handleKeyDown(event) {
      if (codeModal || showStats) {
        if (event.key === 'Escape') {
          setCodeModal(false)
          setShowStats(false)
        }
        return
      }

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        togglePause()
        return
      }

      if (status === 'done' || paused || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.isComposing) return

      const expected = text[index]
      if (expected === undefined) return

      if (event.key === 'Backspace') {
        event.preventDefault()
        if (ALLOW_BACKSPACE && index > 0) {
          setIndex((previous) => previous - 1)
          setMistake(null)
        }
        return
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        return
      }

      let typed
      if (event.key === 'Enter') typed = '\n'
      else if (isDeadKey(event.key)) typed = resolveTypedChar(event, LAYOUTS[layout])
      else if (event.key.length === 1) typed = event.key
      else return

      event.preventDefault()

      if (status === 'idle') {
        setStartedAt(Date.now())
        setTick(Date.now())
        setStatus('running')
      }

      if (charsMatch(expected, typed)) {
        let next = index + 1
        let skippedIndent = 0
        if (typed === '\n') {
          while (text[next] === ' ') {
            next += 1
            skippedIndent += 1
          }
        }

        setMistake(null)
        setCorrectCount((previous) => previous + 1 + skippedIndent)
        setIndex(next)

        if (next >= text.length) {
          setFinishedAt(Date.now())
          setStatus('done')
          setShowStats(true)
        }
      } else {
        setMistake(typed)
        setErrorCount((previous) => previous + 1)
        setWrongKeys((previous) => ({ ...previous, [expected]: (previous[expected] ?? 0) + 1 }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [codeModal, showStats, status, paused, text, index, layout, togglePause])

  const progress = text.length === 0 ? 100 : Math.round((Math.min(index, text.length) / text.length) * 100)
  const nextChar = text[index] ?? ''

  function handleToggleLayout() {
    setLayout((previous) => (previous === 'en-US' ? 'es-LATAM' : 'en-US'))
  }

  function handleLoadCode(newText, newPresetId) {
    setCodeModal(false)
    reset(newText)
    setPresetId(newPresetId)
  }

  return (
    <div className="min-h-screen">
      <Header
        metrics={metrics}
        elapsedMs={elapsedMs}
        status={status}
        layout={layout}
        onToggleLayout={handleToggleLayout}
        onOpenCode={() => setCodeModal(true)}
        onReset={() => reset()}
        onTogglePause={togglePause}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-10 pt-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-xl shadow-black/20 sm:p-5">
          <TypingBoard text={text} index={index} mistake={mistake} status={status} progress={progress} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/70 pt-3 text-[11px] text-slate-500">
            <span className="font-medium text-slate-400">{lessonLabel}</span>
            <span>Esc pausa · Backspace corrige · Enter salta la sangría</span>
          </div>
        </section>

        <VirtualKeyboard layout={layout} nextChar={nextChar} />
      </main>

      {codeModal && (
        <CodeModal currentText={text} onClose={() => setCodeModal(false)} onLoad={handleLoadCode} />
      )}

      {showStats && (
        <StatsModal
          metrics={metrics}
          elapsedMs={elapsedMs}
          errorCount={errorCount}
          wrongKeys={wrongKeys}
          bestWpm={bestWpm}
          onRestart={() => reset()}
          onNewCode={() => {
            setShowStats(false)
            setCodeModal(true)
          }}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  )
}
