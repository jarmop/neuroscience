const radInDeg = 180 / Math.PI;

export function degreeToRadius(deg: number) {
  return deg / radInDeg;
}

export function radiusToDegree(rad: number) {
  return rad * radInDeg;
}