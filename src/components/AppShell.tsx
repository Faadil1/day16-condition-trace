import { useRef, useState, useEffect } from 'react'
import { MuseumHeader } from './MuseumHeader'
import { ObjectStage } from './ObjectStage'
import { EvidencePanel } from './EvidencePanel'
import { RecordChain } from './RecordChain'
import { GeneratedRecord } from './GeneratedRecord'
import { toGrazingAngle } from '../lib/examination'
import { useEditorialMotion } from '../hooks/useEditorialMotion'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'

const order: WorkflowStep[] = ['open', 'records', 'inspect', 'compare', 'finding', 'record']

export function AppShell() {
  const [step, setStep] = useState<WorkflowStep>('open')
  const [selectedId, setSelectedId] = useState('return-arrival')
  const [lightAngle, setLightAngle] = useState(24)
  const [observation, setObservation] = useState<CapturedObservation | null>(null)
  const examinationCanvas = useRef<HTMLCanvasElement | null>(null)
  const shellRef = useRef<HTMLElement | null>(null)

  useEditorialMotion(shellRef, step)

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
    if (step === 'inspect') captureObservation()
    setStep(current => order[Math.min(order.indexOf(current) + 1, order.length - 1)])
  }

  const reset = () => {
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
  }, [step, lightAngle])

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
      {step === 'record' && <GeneratedRecord observation={observation} onClose={() => setStep('finding')} />}
    </main>
  )
}
