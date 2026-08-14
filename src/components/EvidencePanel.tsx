import { ArrowRight, Check, FileText, Lightbulb, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { objectRecord, records } from '../data/objectRecord'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'
import { EvidenceStatus } from './EvidenceStatus'
import { ComparisonView } from './ComparisonView'

const stepMeta: Record<WorkflowStep, { n: string; label: string }> = {
  open: { n: '01', label: 'Open object' }, records: { n: '02', label: 'Review record chain' },
  inspect: { n: '03', label: 'Inspect with raking light' }, compare: { n: '04', label: 'Compare documentation' },
  finding: { n: '05', label: 'First documented appearance' }, record: { n: '06', label: 'Evidence record' },
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
  const buttons: Partial<Record<WorkflowStep, string>> = {
    open: 'Begin return inspection', records: 'Inspect current condition', inspect: 'Capture observation',
    compare: 'Review record chain', finding: 'Generate evidence record',
  }
  return (
    <aside className="evidence-panel">
      <div className="workflow-progress">
        <span>STEP {stepMeta[step].n} / 06</span>
        <div>{Object.keys(stepMeta).map((key, i) => <i key={key} className={i <= Number(stepMeta[step].n) - 1 ? 'filled' : ''} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} className="panel-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
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
            <p className="lead">Move the examination light across the surface. Once the feature is legible, capture the observation for comparison.</p>
            <div className="inspection-readout">
              <Lightbulb size={20} />
              <div><span>EXAMINATION CONDITION</span><strong>{ready ? 'Shallow angle reached' : 'Adjust raking-light angle'}</strong><p>{ready ? 'Feature is legible. Capture will preserve this exact examination frame.' : 'Move the control to examine the shoulder relief.'}</p></div>
            </div>
            <div className="feature-spec"><span>TRACKED AREA</span><strong>Upper-right shoulder</strong><p>No feature has been automatically detected or classified.</p></div>
          </>}
          {step === 'compare' && <ComparisonView observation={observation} observationAngle={lightAngle} />}
          {step === 'finding' && <>
            <p className="lead">The available chain supports a qualified finding about the documentation record—not physical cause.</p>
            <div className="period-card">
              <span className="section-kicker">PERIOD REQUIRING REVIEW</span>
              <div><strong>Alder House Museum</strong><span>Return handoff · Aug 1</span></div>
              <ArrowRight />
              <div><strong>North Archive Museum</strong><span>Return arrival · Aug 3</span></div>
            </div>
            <dl className="finding-list">
              <div><dt>Prior record</dt><dd>Feature not visible</dd></div>
              <div><dt>Current record</dt><dd>Feature observed</dd></div>
              <div><dt>Comparison limitation</dt><dd>Different examination conditions</dd></div>
              <div><dt>Conclusion strength</dt><dd>Qualified</dd></div>
              <div><dt>Review status</dt><dd><Check size={14} /> Human review required</dd></div>
            </dl>
            <div className="notice bronze"><FileText size={17} /><p><strong>Documentation gap</strong>Equivalent examination unavailable at departure.</p></div>
          </>}
          {buttons[step] && (
            <button className="primary-action" onClick={onNext} disabled={step === 'inspect' && !ready}>
              {buttons[step]} <ArrowRight size={17} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </aside>
  )
}
