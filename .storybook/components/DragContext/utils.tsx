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

export function findIntersectingTargets(
  point: Point,
  targets: Array<{ id: string; measurements: Measurements }>
): string[] {
  "worklet" // aw
  return targets
    .filter((target) => isPointInTarget(point, target.measurements))
    .map((target) => target.id);
}