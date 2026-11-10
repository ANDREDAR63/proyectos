import { useEffect, useRef } from 'react'

function buildLines(text) {
  const lines = []
  let current = []
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    current.push({ char, index: i })
    if (char === '\n') {
      lines.push(current)
      current = []
    }
  }
  if (current.length > 0) lines.push(current)
  return lines
}

function charClasses(state, isSpace) {
  if (state === 'correct') {
    return isSpace ? 'text-emerald-500/40' : 'text-emerald-400'
  }
  if (state === 'cursor' || state === 'error') return ''
  return isSpace ? 'text-slate-600' : 'text-slate-500'
}

export default function TypingBoard({ text, index, mistake, status, progress }) {
  const boardRef = useRef(null)
  const cursorRef = useRef(null)
  const lines = buildLines(text)

  useEffect(() => {
    const board = boardRef.current
    const cursor = cursorRef.current
    if (!board || !cursor) return
    const target = cursor.offsetTop - board.clientHeight / 2
    board.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
  }, [index])

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          {status === 'done' ? 'Lección completada' : status === 'paused' ? 'Pausado · Esc para continuar' : 'Escribe para empezar'}
        </span>
        <span className="font-mono tabular-nums">{progress}%</span>
      </div>

      <div
        ref={boardRef}
        className="scrollbar-thin relative max-h-[42vh] min-h-[16rem] overflow-y-auto rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-3"
      >
        <div className="whitespace-pre font-mono text-[13px] leading-6 sm:text-[15px] sm:leading-7">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="min-h-[1.75rem]">
              {line.map(({ char, index: charIndex }) => {
                const isNewline = char === '\n'
                const isSpace = char === ' '
                const isCursor = charIndex === index
                const state =
                  charIndex < index ? 'correct' : isCursor ? (mistake ? 'error' : 'cursor') : 'pending'

                const display = isNewline ? '↵' : isSpace ? '·' : char

                return (
                  <span
                    key={charIndex}
                    ref={isCursor ? cursorRef : null}
                    className={[
                      'rounded-[3px] transition-colors duration-75',
                      charClasses(state, isSpace),
                      state === 'cursor' ? 'bg-sky-500/25 text-sky-100 ring-2 ring-sky-400/80 animate-blink' : '',
                      state === 'error' ? 'bg-red-500/30 text-red-200 ring-2 ring-red-400/80' : '',
                      isNewline ? 'select-none text-slate-600' : '',
                    ].join(' ')}
                  >
                    {state === 'error' && isCursor ? mistake : display}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
