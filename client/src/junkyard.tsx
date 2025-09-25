type Point = [number, number];

function Q(p1: Point, p2: Point) {
  return `Q ${p1} ${p2}`;
}

function pointToString(point: Point) {
  return point.join(" ");
}

interface QuadraticBezierCurveProps {
  start: Point;
  end: Point;
  // curve: number;
  curve: Point;
}

function QuadraticBezierCurve(
  { start, end, curve }: QuadraticBezierCurveProps,
) {
  return (
    <>
      <path
        d={`M ${pointToString(start)} Q ${pointToString(curve)} ${
          pointToString(end)
        }`}
        stroke="black"
        strokeWidth="1"
        fill="none"
      />
    </>
  );
}

function QuadraticBezierCurve2(
  { start, end, curve }: QuadraticBezierCurveProps,
) {
  const a = (end[0] - start[0]) / 2;
  const b = (end[1] - start[1]) / 2;

  // console.log(a, b);

  const beta = Math.abs(Math.atan(b / a));
  const alpha = (Math.PI / 2) - beta;

  // console.log(radiusToDegree(beta));
  // console.log(radiusToDegree(alpha));

  // const centerPoint: Point = [start[0] + a, start[1] + b];
  const centerPointX = start[0] + a, centerPointY = start[1] + b;
  const controlPointX = start[0] + a * Math.cos(beta),
    controlPointY = start[1] + a * Math.sin(alpha);

  console.log(controlPointX, controlPointY);

  return (
    <>
      <path
        d={`M ${pointToString(start)} Q 300 50 ${pointToString(end)}`}
        stroke="#fa3838"
        strokeWidth="20"
        fill="none"
      />
      <circle cx={centerPointX} cy={centerPointY} r={10} />
      <circle cx={controlPointX} cy={controlPointY} r={10} />
    </>
  );
}

function CubicBezierCurve() {
  return (
    <path
      d="M 100 350 C 70 100 380 100 350 350"
      stroke="#fa3838"
      strokeWidth="20"
      fill="none"
    />
  );
}
