import { useRef, useState, useEffect } from 'react'
import { MuseumHeader } from './MuseumHeader'
import { ObjectStage } from './ObjectStage'
import { EvidencePanel } from './EvidencePanel'
import { RecordChain } from './RecordChain'
import { GeneratedRecord } from './GeneratedRecord'
import { toGrazingAngle } from '../lib/examination'
import { useEditorialMotion, useRecordBridgeMotion } from '../hooks/useEditorialMotion'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'

const order: WorkflowStep[] = ['open', 'records', 'inspect', 'compare', 'finding', 'record']

export function AppShell() {
  const [step, setStep] = useState<WorkflowStep>('open')
  const [selectedId, setSelectedId] = useState('return-arrival')
  const [lightAngle, setLightAngle] = useState(24)
  const [observation, setObservation] = useState<CapturedObservation | null>(null)
  const [capturePulse, setCapturePulse] = useState(false)
  const [recordBridge, setRecordBridge] = useState(false)
  const examinationCanvas = useRef<HTMLCanvasElement | null>(null)
  const shellRef = useRef<HTMLElement | null>(null)
  const transitionTimers = useRef<number[]>([])

  useEditorialMotion(shellRef, step)
  useRecordBridgeMotion(shellRef, recordBridge)

  const clearTransitionTimers = () => {
    transitionTimers.current.forEach(timer => window.clearTimeout(timer))
    transitionTimers.current = []
  }

  const captureObservation = () => {
    let imageDataUrl = ''
    try {
      imageDataUrl = examinationCanvas.current?.toDataURL('image/png') ?? ''
    } catch {
      imageDataUrl = ''
    }

    setObservation({
      id: 'OBS-04',
      angle: toGrazingAngle(lightAngle),
      area: 'Upper-right shoulder',
      feature: 'Hairline crack legible',
      status: 'Human-reviewed',
      capturedAt: new Date().toISOString(),
      imageDataUrl,
    })
  }

  const next = () => {
    if (recordBridge || capturePulse) return

    if (step === 'inspect') {
      clearTransitionTimers()
      captureObservation()
      setCapturePulse(true)
      transitionTimers.current = [
        window.setTimeout(() => setStep('compare'), 430),
        window.setTimeout(() => setCapturePulse(false), 650),
      ]
      return
    }

    if (step === 'finding') {
      clearTransitionTimers()
      setRecordBridge(true)
      transitionTimers.current = [
        window.setTimeout(() => setStep('record'), 470),
        window.setTimeout(() => setRecordBridge(false), 1180),
      ]
      return
    }

    setStep(current => order[Math.min(order.indexOf(current) + 1, order.length - 1)])
  }

  const reset = () => {
    clearTransitionTimers()
    setCapturePulse(false)
    setRecordBridge(false)
    setStep('open')
    setSelectedId('return-arrival')
    setLightAngle(24)
    setObservation(null)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'r' || e.key === 'R') {
        reset()
      } else if (e.key === 'ArrowLeft' && step === 'inspect') {
        e.preventDefault()
        setLightAngle(a => Math.max(0, a - 5))
      } else if (e.key === 'ArrowRight' && step === 'inspect') {
        e.preventDefault()
        setLightAngle(a => Math.min(90, a + 5))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [step, lightAngle, recordBridge, capturePulse])

  useEffect(() => () => clearTransitionTimers(), [])

  return (
    <main ref={shellRef} className={`app-shell step-${step}`} data-workflow-step={step}>
      <MuseumHeader />
      <div className={`workspace ${step === 'compare' ? 'compare-mode' : ''}`}>
        <ObjectStage
          step={step}
          lightAngle={lightAngle}
          onLightAngle={setLightAngle}
          observation={observation}
          onCanvasReady={canvas => { examinationCanvas.current = canvas }}
          selectedId={selectedId}
          onSelectRecord={setSelectedId}
          capturePulse={capturePulse}
        />
        <EvidencePanel
          step={step}
          selectedId={selectedId}
          lightAngle={lightAngle}
          observation={observation}
          onNext={next}
        />
      </div>
      <RecordChain selectedId={selectedId} onSelect={setSelectedId} expanded={step !== 'open'} highlightPeriod={step === 'finding' || step === 'record'} />

      {recordBridge && (
        <div className="record-bridge" aria-hidden="true">
          <div className="record-bridge-inner">
            <span className="record-bridge-fnd">FND-01</span>
            <div className="record-bridge-rule"><i /><em>TRACE RESOLVED</em><i /></div>
            <strong className="record-bridge-label">Evidence Record</strong>
            <small className="record-bridge-copy">Qualified finding → institutional record</small>
          </div>
        </div>
      )}

      {step === 'record' && <GeneratedRecord observation={observation} onClose={() => setStep('finding')} />}
    </main>
  )
}
