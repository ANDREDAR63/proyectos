const DEAD_KEYS = new Set(["'", '"', '`', '~', '´', '¨', '^'])
const ENYE_SET = 'nñÑN'

export function normalizeText(raw) {
  return String(raw ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFEFF]/g, '')
}

export function isDeadKey(key) {
  return key === 'Dead' || DEAD_KEYS.has(key)
}

export function resolveTypedChar(event, layout) {
  if (!isDeadKey(event.key)) return event.key
  const key = layout?.byCode?.[event.code]
  if (key) return event.shiftKey ? key.shift : key.base
  return event.key
}

export function charsMatch(expected, typed) {
  if (expected === typed) return true
  return ENYE_SET.includes(expected) && ENYE_SET.includes(typed)
}
