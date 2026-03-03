import { create } from "zustand";

const useStore = create((set) => ({
  sessionLog: [],
  transcript: "",
  summary: "",
  sessionState: "not_started", 

  setTranscript: (text) => set({ transcript: text }),
  addLogEntry: (entry) =>
    set((state) => ({
      sessionLog: [...state.sessionLog, entry],
    })),
  setSummary: (summary) => set({ summary: summary }),
  resetLog: () => set({ sessionLog: [] }),
  resetTranscript: () => set({ transcript: "" }),
  resetSummary: () => set({ summary: "" }),

  // Functions to update session state
  startSession: () => set({ sessionState: "running" }),
  pauseSession: () => set({ sessionState: "paused" }),
  resumeSession: () => set({ sessionState: "running" }),
  finishSession: () => set({ sessionState: "finished" }),
  resetSession: () => set({ sessionState: "not_started" }),
}));

export default useStore;