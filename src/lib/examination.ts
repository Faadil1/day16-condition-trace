export const toGrazingAngle = (controlValue: number) => {
  const clamped = Math.max(0, Math.min(90, controlValue))
  return Math.round(24 - (clamped / 90) * 19)
}
