export function computeMetrics(correctChars, errors, elapsedMs) {
  const minutes = Math.max(elapsedMs, 1000) / 60000
  const attempts = correctChars + errors
  return {
    wpm: Math.round(correctChars / 5 / minutes),
    cpm: Math.round(correctChars / minutes),
    accuracy: attempts === 0 ? 100 : Math.round((correctChars / attempts) * 1000) / 10,
  }
}

export function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function topProblemKeys(wrongKeys, limit = 6) {
  return Object.entries(wrongKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }))
}
