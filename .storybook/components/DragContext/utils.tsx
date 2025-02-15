
// intersection.ts
export type Point = {
  x: number;
  y: number;
};

export type Measurements = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function isPointInTarget(point: Point, measurements: Measurements): boolean {
  "worklet" // aw
  return (
    point.x >= measurements.x &&
    point.x <= measurements.x + measurements.width &&
    point.y >= measurements.y &&
    point.y <= measurements.y + measurements.height
  );
}

export const upsert = <T extends { id: string | number }>(
  array: T[],
  item: T
): T[] => {
  const index = array.findIndex(existing => existing.id === item.id);
  if (index >= 0) {
    const newArray = [...array];
    newArray[index] = item;
    return newArray;
  }
  return [...array, item];
};

export const remove = <T extends { id: string | number }>(
  array: T[],
  id: string | number
): T[] => {
  return array.filter(target => target.id !== id)
};