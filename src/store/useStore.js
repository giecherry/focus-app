import { create } from "zustand";

const useStore = create((set) => ({
  sessionLog: [],
  transcript: "",
  setTranscript: (text) => set({ transcript: text }),
  addLogEntry: (entry) =>
    set((state) => ({ sessionLog: [...state.sessionLog, entry] })),
  resetLog: () => set({ sessionLog: [] }),
  resetTranscript: () => set({ transcript: "" }),
}));

export default useStore;