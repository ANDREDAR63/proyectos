import test from 'node:test'
import assert from 'node:assert/strict'
import { charsMatch, normalizeText, resolveTypedChar } from '../src/utils/textNormalizer.js'
import { computeMetrics, formatTime, topProblemKeys } from '../src/utils/metricsCalculator.js'
import { LAYOUTS, findKeyForChar } from '../src/utils/keyMappings.js'
import { presets } from '../src/data/presets.js'

test('normalizeText convierte CRLF, tabs y caracteres nulos', () => {
  assert.equal(normalizeText('a\r\n\tb\r\tc\u0000'), 'a\n  b\n  c')
  assert.equal(normalizeText(null), '')
})

test('charsMatch tolera ñ/n en cualquier dirección', () => {
  assert.ok(charsMatch('ñ', 'n'))
  assert.ok(charsMatch('n', 'ñ'))
  assert.ok(charsMatch('ñ', 'ñ'))
  assert.ok(charsMatch('a', 'a'))
  assert.ok(!charsMatch('a', 'b'))
  assert.ok(!charsMatch('a', 'A'), 'las mayúsculas deben importar')
})

test('resolveTypedChar resuelve dead keys por event.code', () => {
  const event = { key: 'Dead', code: 'Quote', shiftKey: false }
  assert.equal(resolveTypedChar(event, LAYOUTS['en-US']), "'")

  const shifted = { key: 'Dead', code: 'Quote', shiftKey: true }
  assert.equal(resolveTypedChar(shifted, LAYOUTS['en-US']), '"')

  assert.equal(resolveTypedChar({ key: 'a' }, LAYOUTS['en-US']), 'a')
})

test('computeMetrics aplica WPM, CPM y precisión', () => {
  const metrics = computeMetrics(100, 0, 60000)
  assert.equal(metrics.wpm, 20)
  assert.equal(metrics.cpm, 100)
  assert.equal(metrics.accuracy, 100)

  const withErrors = computeMetrics(9, 1, 60000)
  assert.equal(withErrors.accuracy, 90)
  assert.equal(computeMetrics(0, 0, 0).accuracy, 100)
  assert.equal(formatTime(65000), '01:05')
})

test('topProblemKeys ordena por frecuencia', () => {
  assert.deepEqual(topProblemKeys({ a: 1, b: 3, c: 2 }, 2), [
    { key: 'b', count: 3 },
    { key: 'c', count: 2 },
  ])
})

test('findKeyForChar detecta shift y fallback ñ/n', () => {
  const brace = findKeyForChar('{', 'en-US')
  assert.equal(brace.key.base, '[')
  assert.equal(brace.shift, true)

  const upper = findKeyForChar('A', 'en-US')
  assert.equal(upper.key.base, 'a')
  assert.equal(upper.shift, true)

  const enye = findKeyForChar('ñ', 'es-LATAM')
  assert.equal(enye.key.base, 'ñ')
  assert.equal(enye.shift, false)

  const fallback = findKeyForChar('ñ', 'en-US')
  assert.equal(fallback.key.base, 'n')
})

test('los presets están normalizados y no están vacíos', () => {
  assert.ok(presets.length >= 5)
  for (const preset of presets) {
    assert.ok(preset.code.length > 20)
    assert.ok(!preset.code.includes('\t'))
    assert.ok(!preset.code.includes('\r'))
  }
})
