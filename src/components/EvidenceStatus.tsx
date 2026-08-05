import type { EvidenceStatus as Status } from '../types/evidence'

export function EvidenceStatus({ status }: { status: Status }) {
  return <span className={`evidence-status status-${status.toLowerCase()}`}><i />{status}</span>
}
