import type { Measurements, Point } from "./types"

export const isPointInTarget = (
  point: Point,
  measurements: Measurements,
  radius: number = 0
): boolean => {
  "worklet"
  const minX = measurements.x - radius
  const maxX = measurements.x + measurements.width + radius
  const minY = measurements.y - radius
  const maxY = measurements.y + measurements.height + radius

  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  )
}

export const upsert = <T extends { id: string | number }>(
  array: T[],
  item: T
): T[] => {
  const index = array.findIndex((existing) => existing.id === item.id)
  if (index >= 0) {
    const newArray = [...array]
    newArray[index] = item
    return newArray
  }
  return [...array, item]
}

export const remove = <T extends { id: string | number }>(
  array: T[],
  id: string | number
): T[] => {
  return array.filter((target) => target.id !== id)
}

export const areSetsEqual = (a: Set<string>, b: Set<string>) => {
  "worklet"
  return a.size === b.size && a.size === new Set([...a, ...b]).size
}
