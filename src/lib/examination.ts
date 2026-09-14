export const toGrazingAngle = (controlValue: number) => {
  const clamped = Math.max(0, Math.min(90, controlValue))
  return Math.round(24 - (clamped / 90) * 19)
}

export type ExaminationBandId = 'diffuse' | 'relief' | 'review'

export type ExaminationBand = {
  id: ExaminationBandId
  label: string
  detail: string
}

export const getExaminationBand = (controlValue: number): ExaminationBand => {
  const angle = toGrazingAngle(controlValue)

  if (angle <= 9) {
    return {
      id: 'review',
      label: 'REVIEW RANGE',
      detail: 'Surface relief legible',
    }
  }

  if (angle <= 15) {
    return {
      id: 'relief',
      label: 'RELIEF EMERGING',
      detail: 'Continue toward a shallower angle',
    }
  }

  return {
    id: 'diffuse',
    label: 'DIFFUSE RANGE',
    detail: 'Relief not yet sufficient for capture',
  }
}

export const isCaptureReady = (controlValue: number) => getExaminationBand(controlValue).id === 'review'
