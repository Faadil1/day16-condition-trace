import { ArrowRight, Link2, ScanLine, TriangleAlert } from 'lucide-react'
import { records } from '../data/objectRecord'
import type { CapturedObservation } from '../types/evidence'
import { EvidenceStatus } from './EvidenceStatus'

function EvidencePlate({ raking, reveal, imageDataUrl }: { raking: boolean; reveal: number; imageDataUrl?: string }) {
  const suffix = raking ? 'raking' : 'diffuse'

  return (
    <div className={`comparison-visual ${raking ? 'is-raking' : 'is-diffuse'}`} aria-hidden="true">
      {raking && imageDataUrl ? (
        <img className="comparison-captured-photo" src={imageDataUrl} alt="" />
      ) : (
        <svg className="evidence-vessel-plate" viewBox="0 0 260 150" role="presentation">
          <defs>
            <linearGradient id={`body-${suffix}`} x1="0" y1="0" x2="1" y2="1">
              {raking ? (
                <>
                  <stop offset="0" stopColor="#665a45" />
                  <stop offset=".46" stopColor="#857456" />
                  <stop offset=".60" stopColor="#d5c293" />
                  <stop offset=".69" stopColor="#827252" />
                  <stop offset="1" stopColor="#4b4133" />
                </>
              ) : (
                <>
                  <stop offset="0" stopColor="#a99670" />
                  <stop offset=".48" stopColor="#c7b58d" />
                  <stop offset="1" stopColor="#7a6e55" />
                </>
              )}
            </linearGradient>
            <linearGradient id={`shade-${suffix}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#190e0c" stopOpacity=".36" />
              <stop offset=".5" stopColor="#190e0c" stopOpacity="0" />
              <stop offset="1" stopColor="#190e0c" stopOpacity=".28" />
            </linearGradient>
          </defs>

          <path
            d="M112 24 C111 34 106 39 97 44 C83 52 75 66 72 84 C68 108 75 128 94 136 C104 140 116 142 130 142 C144 142 157 140 167 136 C186 128 193 108 188 84 C185 66 177 52 163 44 C154 39 149 34 148 24 Z"
            fill={`url(#body-${suffix})`}
            stroke="#d4c49c"
            strokeOpacity=".24"
            strokeWidth="1"
          />
          <path d="M112 27 C98 28 93 38 91 48" fill="none" stroke="#b8a47b" strokeWidth="5" strokeLinecap="round" opacity=".78" />
          <path d="M148 27 C162 28 167 38 169 48" fill="none" stroke="#b8a47b" strokeWidth="5" strokeLinecap="round" opacity=".78" />
          <ellipse cx="130" cy="24" rx="18" ry="5" fill="#8e7e5f" stroke="#d4c49c" strokeOpacity=".25" />
          <path d="M82 86 C97 81 112 79 130 79 C148 79 164 81 179 86" fill="none" stroke="#675f47" strokeWidth="2" opacity=".75" />
          <path d="M82 95 C99 91 113 89 130 89 C147 89 162 91 179 95" fill="none" stroke="#675f47" strokeWidth="2" opacity=".75" />
          {[96, 106, 116, 126, 136, 146, 156, 166].map((x, index) => (
            <path key={x} d={`M${x} 98 C${x + (index % 2 ? 4 : -3)} 105 ${x + (index % 2 ? -2 : 3)} 113 ${x} 122`} fill="none" stroke="#625b42" strokeWidth="2.2" strokeLinecap="round" opacity=".72" />
          ))}
          <path d="M75 52 C68 48 61 51 57 58 C51 69 53 88 63 97 C67 101 72 103 78 102" fill="none" stroke="#b29d72" strokeWidth="5" strokeLinecap="round" opacity=".72" />
          <path d="M185 52 C192 48 199 51 203 58 C209 69 207 88 197 97 C193 101 188 103 182 102" fill="none" stroke="#b29d72" strokeWidth="5" strokeLinecap="round" opacity=".72" />
          <path
            d="M112 24 C111 34 106 39 97 44 C83 52 75 66 72 84 C68 108 75 128 94 136 C104 140 116 142 130 142 C144 142 157 140 167 136 C186 128 193 108 188 84 C185 66 177 52 163 44 C154 39 149 34 148 24 Z"
            fill={`url(#shade-${suffix})`}
          />
          {raking && <path d="M157 47 C160 52 157 56 162 61 C158 66 163 71 160 78" fill="none" stroke="#2e261e" strokeWidth="1.7" strokeLinecap="round" opacity={Math.max(.45, reveal)} />}
        </svg>
      )}

      <div className="comparison-reticle"><ScanLine size={14} /><span>Upper-right shoulder</span></div>
      {raking && !imageDataUrl && <div className="comparison-light-band" />}
    </div>
  )
}

export function ComparisonView({ observationAngle, observation }: { observationAngle: number; observation: CapturedObservation | null }) {
  const previous = records[2]
  const current = records[3]
  const angle = Math.round(observation?.angle ?? observationAngle)

  return (
    <div className="comparison">
      <div className="comparison-pair-label">
        <span>A/B EVIDENCE PAIR</span>
        <strong>Same area · non-equivalent lighting</strong>
      </div>

      <div className="comparison-grid">
        <article className="comparison-frame prior">
          <div className="comparison-frame-head">
            <span className="eyebrow">A · RETURN HANDOFF</span>
            <EvidenceStatus status={previous.evidenceStatus} />
          </div>
          <EvidencePlate raking={false} reveal={0} />
          <div className="comparison-meta">
            <span>{previous.date}</span>
            <strong>{previous.institution}</strong>
            <p>{previous.lighting}</p>
            <div className="comparison-observation"><span>OBSERVATION</span><strong>{previous.featureStatus}</strong></div>
          </div>
        </article>

        <div className="comparison-sync-rail" aria-hidden="true">
          <Link2 size={15} />
          <span>AREA<br />ALIGNED</span>
        </div>

        <article className="comparison-frame current">
          <div className="comparison-frame-head">
            <span className="eyebrow">B · CAPTURED RETURN ARRIVAL</span>
            <EvidenceStatus status={current.evidenceStatus} />
          </div>
          <EvidencePlate raking reveal={1} imageDataUrl={observation?.imageDataUrl} />
          <div className="comparison-meta">
            <span>{current.date} · {observation?.id ?? 'OBS-04'}</span>
            <strong>{current.institution}</strong>
            <p>Raking light · {angle}°</p>
            <div className="comparison-observation verified"><span>OBSERVATION</span><strong>{observation?.feature ?? 'Hairline crack legible'}</strong></div>
          </div>
        </article>
      </div>

      <div className="comparison-limit">
        <TriangleAlert size={16} />
        <div><span>COMPARISON LIMITATION</span><strong>Lighting conditions are not equivalent.</strong><p>Departure documentation does not include raking-light examination, so prior physical absence cannot be established.</p></div>
      </div>

      <div className="comparison-finding">
        <ArrowRight size={18} />
        <p><strong>Qualified finding:</strong> the feature is first documented in the captured return-arrival examination. The record supports a documentation boundary, not a determination of when damage physically occurred.</p>
      </div>
    </div>
  )
}
