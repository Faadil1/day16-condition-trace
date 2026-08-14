import { ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { objectRecord, records } from '../data/objectRecord'
import { toGrazingAngle } from '../lib/examination'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'
import { EvidenceStatus } from './EvidenceStatus'
import { ComparisonView } from './ComparisonView'
import { EvidenceLineage } from './EvidenceLineage'

const stepMeta: Record<WorkflowStep, { n: string; label: string }> = {
  open: { n: '01', label: 'Open object' }, records: { n: '02', label: 'Review record chain' },
  inspect: { n: '03', label: 'Inspect with raking light' }, compare: { n: '04', label: 'Compare documentation' },
  finding: { n: '05', label: 'Qualified finding' }, record: { n: '06', label: 'Evidence record' },
}

export function EvidencePanel({ step, selectedId, lightAngle, observation, onNext }: {
  step: WorkflowStep
  selectedId: string
  lightAngle: number
  observation: CapturedObservation | null
  onNext: () => void
}) {
  const selected = records.find(r => r.id === selectedId) ?? records[3]
  const ready = lightAngle >= 72
  const grazingAngle = toGrazingAngle(lightAngle)
  const buttons: Partial<Record<WorkflowStep, string>> = {
    open: 'Begin return inspection', records: 'Inspect current condition', inspect: 'Capture observation',
    compare: 'Continue to qualified finding', finding: 'Generate evidence record',
  }

  return (
    <aside className="evidence-panel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="panel-step"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="workflow-progress">
            <span>STEP {stepMeta[step].n} / 06</span>
            <div>{Object.keys(stepMeta).map((key, i) => <i key={key} className={i <= Number(stepMeta[step].n) - 1 ? 'filled' : ''} />)}</div>
          </div>

          <div className={`panel-content ${step === 'finding' ? 'finding-panel-content' : ''}`}>
            <span className="section-kicker">CURRENT WORKFLOW</span>
            <h2>{stepMeta[step].label}</h2>

            {step === 'open' && <>
              <p className="lead">Begin a human-reviewed examination of the returned object and its available documentation.</p>
              <dl className="object-meta">
                <div><dt>Accession</dt><dd>{objectRecord.accession}</dd></div>
                <div><dt>Material</dt><dd>{objectRecord.material}</dd></div>
                <div><dt>Loan status</dt><dd>{objectRecord.loanStatus}</dd></div>
                <div><dt>Review</dt><dd>{objectRecord.investigationStatus}</dd></div>
              </dl>
              <div className="notice"><ShieldCheck size={17} /><p><strong>Professional review record</strong>No determination of cause or liability is made by this record.</p></div>
            </>}

            {step === 'records' && <>
              <p className="lead">Select each inspection moment to review the evidence available at that point in the record chain.</p>
              <div className="selected-record">
                <div className="record-title"><span>{selected.date}</span><EvidenceStatus status={selected.evidenceStatus} /></div>
                <h3>{selected.title}</h3>
                <p>{selected.institution}</p>
                <dl>
                  <div><dt>Examiner</dt><dd>{selected.examiner} · {selected.signed ? 'Signed' : 'Unsigned'}</dd></div>
                  <div><dt>Lighting</dt><dd>{selected.lighting}</dd></div>
                  <div><dt>Feature</dt><dd>{selected.featureStatus}</dd></div>
                </dl>
                {selected.note && <div className="record-note">{selected.note}</div>}
              </div>
            </>}

            {step === 'inspect' && <>
              <p className="lead">Move the examination light across the surface. Once the shoulder relief becomes legible, capture the observation for comparison.</p>
              <div className="inspection-readout">
                <Lightbulb size={20} />
                <div>
                  <span>EXAMINATION CONDITION</span>
                  <strong>{ready ? `${grazingAngle}° from surface · capture ready` : `${grazingAngle}° from surface`}</strong>
                  <p>{ready ? 'Surface relief is legible. Capture will preserve this exact examination frame.' : 'Lower the grazing angle to strengthen relief without asserting an automated detection.'}</p>
                </div>
              </div>
              <div className="feature-spec"><span>TRACKED AREA</span><strong>Upper-right shoulder</strong><p>No feature has been automatically detected or classified.</p></div>
            </>}

            {step === 'compare' && <ComparisonView observation={observation} observationAngle={lightAngle} />}

            {step === 'finding' && <>
              <p className="lead finding-lead">The conclusion below is derived from the visible evidence chain. Each step remains inspectable and preserves the limitation that prevents a stronger claim.</p>
              <EvidenceLineage observation={observation} />
              <div className="finding-verdict">
                <span>QUALIFIED FINDING / FND-01</span>
                <strong>First documented appearance · Aug 3, 2026</strong>
                <p>The feature is first documented in captured observation {observation?.id ?? 'OBS-04'}. Prior physical absence cannot be confirmed because equivalent raking-light documentation is unavailable.</p>
                <small>No determination of cause, moment of damage, or liability.</small>
              </div>
            </>}

            {buttons[step] && (
              <button className="primary-action" onClick={onNext} disabled={step === 'inspect' && !ready}>
                {buttons[step]} <ArrowRight size={17} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  )
}
