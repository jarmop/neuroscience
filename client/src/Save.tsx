import { get, set } from "idb-keyval";
import storedPath from "./data/data.json" with { type: "json" };
import { isEqual } from "lodash";
import { useEffect, useMemo } from "react";
import { Path } from "./types.ts";
import { useData } from "./store.ts";

async function saveData(path: Path) {
  let fileHandle = await get("fileHandle");
  if (!fileHandle) {
    [fileHandle] = await globalThis.showOpenFilePicker();
    set("fileHandle", fileHandle);
  }

  const writable = await fileHandle.createWritable();

  const rawData = JSON.stringify(path);

  await writable.write(rawData);
  await writable.close();
}

export function Save() {
  const { path, resetPath } = useData();

  // const dataChanged = true;
  const dataChanged = useMemo(
    () => !isEqual(path, storedPath),
    [path],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveData(path);
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dataChanged]);

  return (
    <div className="flex">
      {dataChanged &&
        (
          <>
            <button
              type="button"
              onClick={resetPath}
              className="cursor-pointer px-1 mr-1 hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => saveData(path)}
              className="cursor-pointer px-1 bg-blue-300 hover:bg-blue-500"
            >
              Save
            </button>
          </>
        )}
    </div>
  );
}
