import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Path } from "./types.ts";
import pathJson from "./data/data.json" with { type: "json" };

type Store = {
  path: Path;
  setPath: (path: Path) => void;
  resetPath: () => void;
};

const defaultPath = pathJson as Path;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      path: defaultPath,
      setPath: (path) => set({ path }),
      resetPath: () => set({ path: defaultPath }),
    }),
    {
      name: "neuroscience",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useData() {
  return {
    path: useStore((s) => s.path),
    setPath: useStore((s) => s.setPath),
    resetPath: useStore((s) => s.resetPath),
  };
}
