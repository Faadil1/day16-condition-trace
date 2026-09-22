import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { LockKeyhole } from 'lucide-react'

const HOLD_DURATION_MS = 900

export function HoldToSealButton({ onSeal }: { onSeal: () => void }) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const startedAt = useRef<number | null>(null)
  const frame = useRef<number | null>(null)
  const sealed = useRef(false)

  const stopFrame = () => {
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => () => stopFrame(), [])

  const complete = () => {
    if (sealed.current) return
    sealed.current = true
    stopFrame()
    startedAt.current = null
    setProgress(1)
    setHolding(false)
    onSeal()
  }

  const tick = (now: number) => {
    if (startedAt.current === null || sealed.current) return
    const next = Math.min(1, (now - startedAt.current) / HOLD_DURATION_MS)
    setProgress(next)

    if (next >= 1) {
      complete()
      return
    }

    frame.current = window.requestAnimationFrame(tick)
  }

  const start = () => {
    if (sealed.current || holding) return

    if (reduceMotion) {
      complete()
      return
    }

    stopFrame()
    setProgress(0)
    setHolding(true)
    startedAt.current = window.performance.now()
    frame.current = window.requestAnimationFrame(tick)
  }

  const cancel = () => {
    if (sealed.current) return
    stopFrame()
    startedAt.current = null
    setHolding(false)
    setProgress(0)
  }

  const phase = progress >= 1
    ? 'RECORD SEALED'
    : progress >= 0.66
      ? 'LIMITATION PRESERVED'
      : progress >= 0.33
        ? 'CHAIN REVIEWED'
        : holding
          ? 'VERIFYING RECORD'
          : reduceMotion
            ? 'ACTIVATE TO SEAL'
            : 'PRESS & HOLD'

  return (
    <button
      type="button"
      className={`hold-to-seal ${holding ? 'is-holding' : ''} ${progress >= 1 ? 'is-sealed' : ''}`}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onKeyDown={event => {
        if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
          event.preventDefault()
          start()
        }
      }}
      onKeyUp={event => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          cancel()
        }
      }}
      onClick={event => event.preventDefault()}
      aria-label={reduceMotion ? 'Seal evidence record' : 'Hold to seal evidence record'}
      style={{ '--seal-progress': progress } as CSSProperties}
    >
      <span className="hold-to-seal-fill" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <span className="hold-to-seal-mechanism" aria-hidden="true"><i /><b /><em /></span>
      <span className="hold-to-seal-icon" aria-hidden="true"><LockKeyhole size={16} /></span>
      <span className="hold-to-seal-copy">
        <span>{phase}</span>
        <strong>{reduceMotion ? 'Seal evidence record' : 'Hold to seal evidence record'}</strong>
      </span>
      <span className="hold-to-seal-rule" aria-hidden="true"><i /></span>
    </button>
  )
}
