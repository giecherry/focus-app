import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  sessionLog: [],
  transcript: "",
  summary: "",
  summaryStatus: "idle",
  summaryError: "",
  sessionState: "not_started",
};

const useStore = create(
  persist(
    (set) => ({
      ...initialState,

      setTranscript: (text) => set({ transcript: text }),
      addLogEntry: (entry) =>
        set((state) => ({
          sessionLog: [...state.sessionLog, entry],
        })),
      updateLogEntry: (id, updates) =>
        set((state) => ({
          sessionLog: state.sessionLog.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),
      setSummary: (summary) => set({ summary, summaryStatus: "success", summaryError: "" }),
      setSummaryStatus: (summaryStatus) => set({ summaryStatus }),
      setSummaryError: (summaryError) => set({ summaryError, summaryStatus: "error" }),
      resetLog: () => set({ sessionLog: [] }),
      resetTranscript: () => set({ transcript: "" }),
      resetSummary: () => set({ summary: "", summaryStatus: "idle", summaryError: "" }),

      startSession: () =>
        set({
          sessionState: "running",
          summary: "",
          summaryStatus: "idle",
          summaryError: "",
        }),
      pauseSession: () => set({ sessionState: "paused" }),
      resumeSession: () => set({ sessionState: "running" }),
      finishSession: () => set({ sessionState: "finished" }),
      resetSession: () => set({ ...initialState }),
    }),
    {
      name: "bee-focused-session",
      partialize: (state) => ({
        sessionLog: state.sessionLog,
        summary: state.summary,
        summaryStatus: state.summaryStatus,
        summaryError: state.summaryError,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        sessionLog: persistedState?.sessionLog || currentState.sessionLog,
        summary: persistedState?.summary || currentState.summary,
        summaryStatus:
          persistedState?.summaryStatus === "loading"
            ? "idle"
            : persistedState?.summaryStatus || currentState.summaryStatus,
        summaryError: persistedState?.summaryError || currentState.summaryError,
      }),
    }
  )
);

export default useStore;
