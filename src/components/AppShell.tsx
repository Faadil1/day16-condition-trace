import { useState, useEffect } from 'react'
import { MuseumHeader } from './MuseumHeader'
import { ObjectStage } from './ObjectStage'
import { EvidencePanel } from './EvidencePanel'
import { RecordChain } from './RecordChain'
import { GeneratedRecord } from './GeneratedRecord'
import type { WorkflowStep } from '../types/evidence'

const order: WorkflowStep[] = ['open', 'records', 'inspect', 'compare', 'finding', 'record']

export function AppShell() {
  const [step, setStep] = useState<WorkflowStep>('open')
  const [selectedId, setSelectedId] = useState('return-arrival')
  const [lightAngle, setLightAngle] = useState(24)
  const next = () => setStep(current => order[Math.min(order.indexOf(current) + 1, order.length - 1)])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'r' || e.key === 'R') {
        setStep('open')
        setSelectedId('return-arrival')
        setLightAngle(24)
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
  }, [step])

  return (
    <main className="app-shell">
      <MuseumHeader />
      <div className={`workspace ${step === 'compare' ? 'compare-mode' : ''}`}>
        <ObjectStage step={step} lightAngle={lightAngle} onLightAngle={setLightAngle} />
        <EvidencePanel step={step} selectedId={selectedId} lightAngle={lightAngle} onNext={next} />
      </div>
      <RecordChain selectedId={selectedId} onSelect={setSelectedId} expanded={step !== 'open'} highlightPeriod={step === 'finding' || step === 'record'} />
      {step === 'record' && <GeneratedRecord onClose={() => setStep('finding')} />}
    </main>
  )
}
