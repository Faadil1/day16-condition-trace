import { ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { objectRecord, records } from '../data/objectRecord'
import { toGrazingAngle } from '../lib/examination'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'
import { EvidenceStatus } from './EvidenceStatus'
import { ComparisonView } from './ComparisonView'
import { EvidenceLineage } from './EvidenceLineage'

const stepMeta: Record<WorkflowStep, { n: string; label: string }> = {
  open: { n: '01', label: 'Case brief' },
  records: { n: '02', label: 'Record detail' },
  inspect: { n: '03', label: 'Surface inspection' },
  compare: { n: '04', label: 'Evidence comparison' },
  finding: { n: '05', label: 'Qualified finding' },
  record: { n: '06', label: 'Evidence record' },
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
    open: 'Begin examination',
    records: 'Enter surface inspection',
    inspect: 'Capture observation',
    compare: 'Continue to finding',
    finding: 'Generate evidence record',
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
              <p className="lead">Establish the first documented appearance of a surface feature across a signed but non-equivalent record chain.</p>
              <dl className="object-meta">
                <div><dt>Accession</dt><dd>{objectRecord.accession}</dd></div>
                <div><dt>Material</dt><dd>{objectRecord.material}</dd></div>
                <div><dt>Loan status</dt><dd>{objectRecord.loanStatus}</dd></div>
                <div><dt>Review</dt><dd>{objectRecord.investigationStatus}</dd></div>
              </dl>
              <div className="notice"><ShieldCheck size={17} /><p><strong>Documentation boundary only</strong>This review does not determine cause, moment of damage, or liability.</p></div>
            </>}

            {step === 'records' && <>
              <p className="lead">Select a folio in the archive to inspect what was documented at that exact custody moment.</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  className="selected-record"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <div className="record-title"><span>{selected.date}</span><EvidenceStatus status={selected.evidenceStatus} /></div>
                  <h3>{selected.title}</h3>
                  <p>{selected.institution}</p>
                  <dl>
                    <div><dt>Examiner</dt><dd>{selected.examiner} · {selected.signed ? 'Signed' : 'Unsigned'}</dd></div>
                    <div><dt>Lighting</dt><dd>{selected.lighting}</dd></div>
                    <div><dt>Feature</dt><dd>{selected.featureStatus}</dd></div>
                  </dl>
                  {selected.note && <div className="record-note">{selected.note}</div>}
                </motion.div>
              </AnimatePresence>
            </>}

            {step === 'inspect' && <>
              <p className="lead">Lower the grazing angle until the shoulder relief is legible, then preserve that exact examination frame as a human-reviewed observation.</p>
              <div className="inspection-readout">
                <Lightbulb size={20} />
                <div>
                  <span>EXAMINATION CONDITION</span>
                  <strong>{ready ? `${grazingAngle}° from surface · capture ready` : `${grazingAngle}° from surface`}</strong>
                  <p>{ready ? 'Surface relief is legible. Capture will preserve this examination frame.' : 'Lower the grazing angle to strengthen relief without asserting automated detection.'}</p>
                </div>
              </div>
              <div className="feature-spec"><span>AREA OF INTEREST</span><strong>Upper-right shoulder</strong><p>Observation remains human-reviewed; no feature is automatically detected or classified.</p></div>
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
