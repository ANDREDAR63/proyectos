export const FINGERS = {
  lp: { name: 'Meñique izquierdo', color: '#f472b6' },
  lr: { name: 'Anular izquierdo', color: '#a78bfa' },
  lm: { name: 'Medio izquierdo', color: '#60a5fa' },
  li: { name: 'Índice izquierdo', color: '#34d399' },
  ri: { name: 'Índice derecho', color: '#34d399' },
  rm: { name: 'Medio derecho', color: '#60a5fa' },
  rr: { name: 'Anular derecho', color: '#a78bfa' },
  rp: { name: 'Meñique derecho', color: '#f472b6' },
  th: { name: 'Pulgares', color: '#fbbf24' },
}

export const FINGER_GROUPS = [
  { label: 'Meñique', color: FINGERS.lp.color },
  { label: 'Anular', color: FINGERS.lr.color },
  { label: 'Medio', color: FINGERS.lm.color },
  { label: 'Índice', color: FINGERS.li.color },
  { label: 'Pulgar', color: FINGERS.th.color },
]

const ROW_FINGERS = {
  nums: ['lp', 'lp', 'lr', 'lm', 'li', 'li', 'ri', 'ri', 'rm', 'rr', 'rp', 'rp', 'rp'],
  top: ['lp', 'lr', 'lm', 'li', 'li', 'ri', 'ri', 'rm', 'rr', 'rp', 'rp', 'rp'],
  home: ['lp', 'lr', 'lm', 'li', 'li', 'ri', 'ri', 'rm', 'rr', 'rp', 'rp'],
  bottom: ['lp', 'lr', 'lm', 'li', 'li', 'ri', 'ri', 'rm', 'rr', 'rp'],
}

const SYMBOL_CODES = {
  '`': 'Backquote',
  '~': 'Backquote',
  'º': 'Backquote',
  'ª': 'Backquote',
  '-': 'Minus',
  _: 'Minus',
  '=': 'Equal',
  '+': 'Equal',
  '´': 'Equal',
  '¨': 'Equal',
  '[': 'BracketLeft',
  '{': 'BracketLeft',
  ']': 'BracketRight',
  '}': 'BracketRight',
  '¡': 'BracketRight',
  '\\': 'Backslash',
  '|': 'Backslash',
  ';': 'Semicolon',
  ':': 'Semicolon',
  ñ: 'Semicolon',
  Ñ: 'Semicolon',
  "'": 'Quote',
  '"': 'Quote',
  ',': 'Comma',
  '<': 'Comma',
  '.': 'Period',
  '>': 'Period',
  '/': 'Slash',
  '?': 'Slash',
  '¿': 'IntlBackslash',
}

function codeFor(base) {
  if (/^[a-z]$/i.test(base)) return `Key${base.toUpperCase()}`
  if (/^[0-9]$/.test(base)) return `Digit${base}`
  return SYMBOL_CODES[base] ?? null
}

const BACKSPACE = { code: 'Backspace', label: '⌫', w: 2, finger: 'rp', special: true }
const TAB = { code: 'Tab', label: 'Tab', w: 1.5, finger: 'lp', special: true }
const CAPS = { code: 'CapsLock', label: 'Caps', w: 1.75, finger: 'lp', special: true }
const ENTER = { code: 'Enter', label: 'Enter ↵', w: 1.75, finger: 'rp', special: true }
const SHIFT_L = { code: 'ShiftLeft', label: 'Shift', w: 2.25, finger: 'lp', special: true }
const SHIFT_R = { code: 'ShiftRight', label: 'Shift', w: 2.25, finger: 'rp', special: true }
const CTRL_L = { code: 'ControlLeft', label: 'Ctrl', w: 1.5, finger: 'lp', special: true }
const CTRL_R = { code: 'ControlRight', label: 'Ctrl', w: 1.5, finger: 'rp', special: true }
const ALT_L = { code: 'AltLeft', label: 'Alt', w: 1.5, finger: 'lp', special: true }
const ALT_R = { code: 'AltRight', label: 'Alt', w: 1.5, finger: 'rp', special: true }
const SPACE = { code: 'Space', label: 'espacio', w: 8, finger: 'th', special: true, space: true }

const US_ROWS = [
  ['`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', BACKSPACE],
  [TAB, 'qQ', 'wW', 'eE', 'rR', 'tT', 'yY', 'uU', 'iI', 'oO', 'pP', '[{', ']}', '\\|'],
  [CAPS, 'aA', 'sS', 'dD', 'fF', 'gG', 'hH', 'jJ', 'kK', 'lL', ';:', '\'"', ENTER],
  [SHIFT_L, 'zZ', 'xX', 'cC', 'vV', 'bB', 'nN', 'mM', ',<', '.>', '/?', SHIFT_R],
  [CTRL_L, ALT_L, SPACE, ALT_R, CTRL_R],
]

const ES_ROWS = [
  ['ºª', '1!', '2"', '3·', '4$', '5%', '6&', '7/', '8(', '9)', '0=', "'?", '¡¿', BACKSPACE],
  [TAB, 'qQ', 'wW', 'eE', 'rR', 'tT', 'yY', 'uU', 'iI', 'oO', 'pP', '´¨', '+*'],
  [CAPS, 'aA', 'sS', 'dD', 'fF', 'gG', 'hH', 'jJ', 'kK', 'lL', 'ñÑ', '{[', '}]', ENTER],
  [SHIFT_L, '<>', 'zZ', 'xX', 'cC', 'vV', 'bB', 'nN', 'mM', ',;', '.:', '-_', SHIFT_R],
  [CTRL_L, ALT_L, SPACE, ALT_R, CTRL_R],
]

function buildKey(token, finger) {
  const base = token[0]
  const shift = token[1] ?? base.toUpperCase()
  return { base, shift, finger, code: codeFor(base), w: 1 }
}

function buildRows(specs) {
  return specs.map((row, rowIndex) => {
    const pattern = ROW_FINGERS[Object.keys(ROW_FINGERS)[rowIndex]]
    let charIndex = 0
    return row.map((item) => {
      if (typeof item === 'object') return item
      const key = buildKey(item, pattern[Math.min(charIndex, pattern.length - 1)])
      charIndex += 1
      return key
    })
  })
}

function buildIndexes(layout) {
  layout.byCode = {}
  layout.charIndex = new Map()
  for (const row of layout.rows) {
    for (const key of row) {
      if (key.code) layout.byCode[key.code] = key
      if (!key.base) continue
      for (const [char, shift] of [[key.base, false], [key.shift, true]]) {
        if (char && !layout.charIndex.has(char)) layout.charIndex.set(char, { key, shift })
      }
    }
  }
}

export const LAYOUTS = {
  'en-US': { id: 'en-US', label: 'QWERTY US', rows: buildRows(US_ROWS) },
  'es-LATAM': { id: 'es-LATAM', label: 'QWERTY ES', rows: buildRows(ES_ROWS) },
}

Object.values(LAYOUTS).forEach(buildIndexes)

export function findKeyForChar(char, layoutId) {
  const layout = LAYOUTS[layoutId] ?? LAYOUTS['en-US']
  let hit = layout.charIndex.get(char)
  if (!hit && char === 'ñ') hit = layout.charIndex.get('n')
  if (!hit && char === 'n') hit = layout.charIndex.get('ñ')
  return hit ?? null
}
