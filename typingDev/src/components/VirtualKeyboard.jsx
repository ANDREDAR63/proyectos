import { FINGER_GROUPS, FINGERS, LAYOUTS, findKeyForChar } from '../utils/keyMappings'

const KEY_WIDTH_REM = 2.65

function keyStyle(key) {
  return { width: `${(key.w ?? 1) * KEY_WIDTH_REM}rem` }
}

function Keycap({ item, active, shiftActive }) {
  const finger = FINGERS[item.finger] ?? FINGERS.lp
  const isLetter = item.base ? /^[a-zñ]$/i.test(item.base) : false
  const showShift = item.base && !isLetter && item.shift && item.shift !== item.base.toUpperCase()

  return (
    <div
      title={item.special ? item.label : `${finger.name}${showShift ? ` · ${item.shift}` : ''}`}
      style={{
        ...keyStyle(item),
        borderBottomColor: finger.color,
        backgroundColor: active ? 'rgba(14, 165, 233, 0.25)' : `${finger.color}0d`,
      }}
      className={[
        'relative flex h-9 select-none items-center justify-center rounded-md border border-slate-700/70 border-b-[3px] text-[11px] font-medium text-slate-300 shadow-sm transition-colors duration-75 sm:h-10 sm:text-xs',
        item.special ? 'text-[10px] uppercase tracking-wide text-slate-400' : '',
        active ? 'border-sky-400 text-white shadow-sky-500/30 shadow-md' : '',
        shiftActive ? 'border-amber-400 text-amber-200 shadow-amber-500/30 shadow-md' : '',
      ].join(' ')}
    >
      {item.special ? (
        <span className={item.space ? 'text-[9px] tracking-[0.3em] text-slate-500' : ''}>{item.label}</span>
      ) : (
        <>
          {showShift && (
            <span className="absolute left-1 top-0.5 text-[9px] leading-none text-slate-500">{item.shift}</span>
          )}
          <span className={showShift ? 'mt-1.5' : ''}>{item.base}</span>
        </>
      )}
    </div>
  )
}

export default function VirtualKeyboard({ layout, nextChar }) {
  const data = LAYOUTS[layout] ?? LAYOUTS['en-US']
  const target = nextChar ? findKeyForChar(nextChar, layout) : null
  const specialTarget = nextChar === ' ' ? 'Space' : nextChar === '\n' ? 'Enter' : null

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 shadow-xl shadow-black/20 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Teclado virtual</h2>
          <p className="text-[11px] text-slate-500">
            Guía de dedos · {data.label}
            {nextChar ? (
              <span className="ml-2 rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-sky-300">
                siguiente: {nextChar === ' ' ? 'espacio' : nextChar === '\n' ? 'enter' : nextChar}
              </span>
            ) : null}
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2.5">
          {FINGER_GROUPS.map((finger) => (
            <li key={finger.label} className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: finger.color }} />
              {finger.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="scrollbar-thin overflow-x-auto pb-1">
        <div className="mx-auto flex w-max min-w-full flex-col gap-1.5">
          {data.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1.5">
              {row.map((key, keyIndex) => {
                const active = target?.key === key || (specialTarget && specialTarget === key.code)
                const shiftActive =
                  target?.shift === true &&
                  (key.code === 'ShiftLeft' || key.code === 'ShiftRight') &&
                  !active
                return <Keycap key={`${rowIndex}-${keyIndex}`} item={key} active={active} shiftActive={shiftActive} />
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
