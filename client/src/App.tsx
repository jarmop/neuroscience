import { useState } from "react";
import "./App.css";
import { radiusToDegree } from "./mathHelpers.ts";

type Point = [number, number];

// const path1 = ["-100, 0", "-250, 75", "-275, 150", "-280, 200", "-200, 225"];
// const path1 = "-100 0, -250 75, -275 150, -280 200, -200 225";
const path1 =
  "-100 0, -250 75, -275 150, -280 200, -200 250, 200 120, 250 120, 280 50, 250 -30, 100 -180, -50 -210, -200 -180, -300 -130, -400 -50, -420 50, -400 130, -380 150, -300 160, -275 150";

let qPath = "";
const points = path1.split(", ");
points.forEach((p, i) => {
  if (!points[i + 1]) {
    return;
  }
  const nextPoint = points[i + 1].split(" ").map((n) => parseInt(n));
  const controlPoint = p.split(" ").map((n) => parseInt(n));
  const dx = nextPoint[0] - controlPoint[0];
  const dy = nextPoint[1] - controlPoint[1];

  const endPoint = points[i + 2]
    ? [controlPoint[0] + dx / 2, controlPoint[1] + dy / 2]
    : nextPoint;

  // qPath += `${controlPoint.join(" ")}, ${endPointX} ${endPointY}, `;
  qPath += `${controlPoint.join(" ")}, ${endPoint.join(" ")}, `;
});

// console.log("qPath");
// console.log(path1);
// console.log(qPath);

function App() {
  return (
    <svg
      width="1000"
      height="1000"
      style={{ border: "1px solid black" }}
      viewBox="-500 -500 1000 1000"
    >
      <path
        stroke="#333333"
        // d={`M 0 0 L -100 0 -200 50 -250 75 -275 150 -280 200 -200 225`}
        // d={`M 0 0 L -100 0, -250 75, -275 150, -280 200, -200 225`}
        // d={`M 0 0 Q -100 0, -175 37.5, -250 75, -262.5 112.5, -275 150, -277.5 175, -280 200, -240 212.5, -200 225`}
        d={`M 0 0 Q ${qPath}`}
        fill="none"
      />
    </svg>
  );
}

export default App;

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
