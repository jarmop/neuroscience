import { useEffect, useState } from "react";
import "./App.css";
import { useData } from "./store.ts";
import { Path, Point } from "./types.ts";
import { Save } from "./Save.tsx";

function App() {
  const [pathType, setPathType] = useState("L");
  const [dragIndex, setDragIndex] = useState<number>();
  const [mouseOverIndex, setMouseOverIndex] = useState<number>();
  const [editMode, setEditMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [pathConnected, setPathConnected] = useState(false);

  const { path, setPath } = useData();

  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (e.key === "e") {
        setEditMode(true);
      }
    }
    function keyUpHandler(e: KeyboardEvent) {
      if (e.key === "e") {
        setEditMode(false);
      }
    }
    function keyPressHandler(e: KeyboardEvent) {
      if (e.key === "Delete" && selectedIndex !== undefined) {
        const newPath = path.filter((_, i) => i !== selectedIndex);
        setPath(newPath);
      }
    }

    globalThis.addEventListener("keypress", keyPressHandler);
    globalThis.addEventListener("keydown", keyDownHandler);
    globalThis.addEventListener("keyup", keyUpHandler);

    return () => {
      globalThis.removeEventListener("keypress", keyPressHandler);
      globalThis.removeEventListener("keydown", keyDownHandler);
      globalThis.removeEventListener("keyup", keyUpHandler);
    };
  }, [selectedIndex]);

  const [m, ...lPath] = path;

  const finalPath = pathType === "L" ? lPath : fromLtoQ(lPath);

  const dragPoint = path[dragIndex ?? -1];
  const selectedPoint = path[selectedIndex ?? -1];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <input
            type="radio"
            id="L"
            name="dType"
            value="L"
            checked={pathType === "L"}
            onChange={(e) => setPathType(e.target.value)}
          />
          <label htmlFor="L">L</label>
          <input
            type="radio"
            id="Q"
            name="dType"
            value="Q"
            checked={pathType === "Q"}
            onChange={(e) => setPathType(e.target.value)}
          />
          <label htmlFor="Q">Q</label>
        </div>
        <div>
          <input
            id="pathConnected"
            type="checkbox"
            checked={pathConnected}
            onChange={() => setPathConnected(!pathConnected)}
          />
          <label htmlFor="pathConnected">Path connected</label>
        </div>
        <Save />
      </div>

      <svg
        width="1000"
        height="900"
        style={{ border: "1px solid black" }}
        viewBox="-500 -450 1000 900"
        onMouseUp={() => {
          if (dragIndex !== undefined) {
            if (mouseOverIndex === 0) {
              // setPathConnected(true);
            } else {
              selectedIndex === dragIndex
                ? setSelectedIndex(undefined)
                : setSelectedIndex(dragIndex);
            }
            setDragIndex(undefined);
          }
        }}
        onMouseMove={(e) => {
          if (dragIndex === undefined) {
            return;
          }

          const newEPath = [...path];
          const point = newEPath[dragIndex];
          const newPoint: Point = [
            point[0] + e.movementX,
            point[1] + e.movementY,
          ];

          newEPath[dragIndex] = newPoint;

          setPath(newEPath);
        }}
      >
        <path
          stroke="#333333"
          d={`M ${m} ${pathType} ${finalPath} ${pathConnected ? "Z" : ""}`}
          fill="transparent"
        />
        {pathType === "Q" && (editMode || dragIndex !== undefined) &&
          (
            <path
              stroke="#333333"
              d={`M ${m} L ${lPath}`}
              fill="none"
              strokeDasharray={4}
            />
          )}
        {dragPoint && (
          <circle
            cx={dragPoint[0]}
            cy={dragPoint[1]}
            r={20}
            fill="none"
            stroke="red"
            strokeWidth={5}
            // onMouseUp={() => {
            //   dragIndex === selectedIndex
            //     ? setSelectedIndex(undefined)
            //     : setSelectedIndex(dragIndex);
            // }}
          />
        )}
        {selectedPoint && (
          <circle
            cx={selectedPoint[0]}
            cy={selectedPoint[1]}
            r={20}
            fill="none"
            stroke="red"
            strokeWidth={5}
          />
        )}
        {path.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={20}
            fill={(dragIndex === i) ? "none" : "transparent"}
            stroke={(editMode || mouseOverIndex === i)
              ? "black"
              : "transparent"}
            style={{
              cursor: "pointer",
            }}
            onMouseDown={() => {
              setDragIndex(i);
              setMouseOverIndex(undefined);
            }}
            onMouseOver={() => {
              setMouseOverIndex(i);
            }}
            onMouseOut={() => {
              setMouseOverIndex(undefined);
            }}
            // onClick={() => {
            //   console.log("onClick", i);
            //   i === selectedIndex
            //     ? setSelectedIndex(undefined)
            //     : setSelectedIndex(i);
            // }}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;

function fromLtoQ(lPath: Path) {
  const qPath: Path = [];
  for (let i = 0; i < lPath.length - 1; i++) {
    const controlPoint = lPath[i];
    const nextPoint = lPath[i + 1];
    qPath.push(controlPoint);

    if (!lPath[i + 2]) {
      qPath.push(nextPoint);
      continue;
    }

    const dx = nextPoint[0] - controlPoint[0];
    const dy = nextPoint[1] - controlPoint[1];

    const endPoint: Point = [
      controlPoint[0] + dx / 2,
      controlPoint[1] + dy / 2,
    ];

    qPath.push(endPoint);
  }

  return qPath;
}
