import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Square, TimerReset } from "lucide-react";
import useStore from "../store/useStore";
import TextToSpeech from "./TextToSpeech";

const formatClock = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

function Timer() {
  const sessionState = useStore((state) => state.sessionState);
  const startSession = useStore((state) => state.startSession);
  const pauseSession = useStore((state) => state.pauseSession);
  const resumeSession = useStore((state) => state.resumeSession);
  const finishSession = useStore((state) => state.finishSession);
  const resetSession = useStore((state) => state.resetSession);
  const resetSummary = useStore((state) => state.resetSummary);

  const [sessionDuration, setSessionDuration] = useState(1 * 3600);
  const [intervalDuration, setIntervalDuration] = useState(25 * 60);
  const [sessionRemaining, setSessionRemaining] = useState(1 * 3600);
  const [intervalRemaining, setIntervalRemaining] = useState(25 * 60);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timerRef = useRef(null);
  const pausedForCheckInRef = useRef(false);

  const handleStartSession = () => {
    resetSummary();
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    setIsModalOpen(false);
    pausedForCheckInRef.current = false;
    startSession();
  };

  const handlePauseSession = () => {
    pausedForCheckInRef.current = false;
    pauseSession();
  };

  const handleResumeSession = () => {
    pausedForCheckInRef.current = false;
    resumeSession();
  };

  const handleFinishSession = () => {
    pausedForCheckInRef.current = false;
    setIsModalOpen(false);
    finishSession();
  };

  const handleCheckIn = () => {
    pausedForCheckInRef.current = true;
    pauseSession();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (pausedForCheckInRef.current && sessionRemaining > 0) {
      pausedForCheckInRef.current = false;
      resumeSession();
    }
  };

  const handleResetSession = () => {
    pausedForCheckInRef.current = false;
    setIsModalOpen(false);
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    resetSession();
  };

  useEffect(() => {
    if (sessionState !== "running") {
      clearInterval(timerRef.current);
      return undefined;
    }

    timerRef.current = setInterval(() => {
      setSessionRemaining((previous) => {
        const next = Math.max(previous - 1, 0);

        if (next === 0) {
          pausedForCheckInRef.current = false;
          setIsModalOpen(false);
          finishSession();
        }

        return next;
      });

      setIntervalRemaining((previous) => {
        if (sessionRemaining <= 1) {
          return previous;
        }

        if (previous <= 1) {
          pausedForCheckInRef.current = true;
          pauseSession();
          setIsModalOpen(true);
          return intervalDuration;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [finishSession, intervalDuration, pauseSession, sessionRemaining, sessionState]);

  const isConfigLocked = sessionState === "running" || sessionState === "paused";

  return (
    <section className="bg-[#161616] text-white p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-400 flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300">
          Current Session
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-white">Focus Timer</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-2 text-xs sm:text-sm text-yellow-300">
          Session length
          <select
            value={sessionDuration / 3600}
            onChange={(event) => {
              const newDuration = Number(event.target.value) * 3600;
              setSessionDuration(newDuration);
              setSessionRemaining(newDuration);
            }}
            disabled={isConfigLocked}
            className="w-full bg-gray-900 text-white rounded-lg border border-white/10 p-2 text-sm disabled:opacity-50"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} hour{(i + 1) > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-xs sm:text-sm text-yellow-300">
          Check-in every
          <select
            value={intervalDuration / 60}
            onChange={(event) => {
              const newInterval = Number(event.target.value) * 60;
              setIntervalDuration(newInterval);
              setIntervalRemaining(newInterval);
            }}
            disabled={isConfigLocked}
            className="w-full bg-gray-900 text-white rounded-lg border border-white/10 p-2 text-sm disabled:opacity-50"
          >
            {[5, 10, 15, 20, 25, 30, 45, 60].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-900 p-4 border border-white/10">
          <div className="text-4xl sm:text-5xl font-mono text-white tabular-nums">
            {formatClock(intervalRemaining)}
          </div>
          <div className="text-xs sm:text-sm mt-1 text-yellow-300">Next check-in</div>
        </div>

        <div className="rounded-lg bg-gray-900 p-4 border border-white/10">
          <div className="text-4xl sm:text-5xl font-mono text-white tabular-nums">
            {formatClock(sessionRemaining)}
          </div>
          <div className="text-xs sm:text-sm mt-1 text-yellow-300">Session left</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sessionState === "not_started" && (
          <button
            onClick={handleStartSession}
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition text-sm sm:text-base"
          >
            <Play className="h-4 w-4" />
            Start
          </button>
        )}

        {sessionState === "running" && (
          <>
            <button
              onClick={handlePauseSession}
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black bg-[#85d8ff] rounded-lg shadow-md hover:bg-[#9de0ff] transition text-sm sm:text-base"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>
            <button
              onClick={handleCheckIn}
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition text-sm sm:text-base"
            >
              <TimerReset className="h-4 w-4" />
              Check In
            </button>
            <button
              onClick={handleFinishSession}
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-[#f7006b] rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:text-base"
            >
              <Square className="h-4 w-4" />
              Finish
            </button>
          </>
        )}

        {sessionState === "paused" && (
          <>
            <button
              onClick={handleResumeSession}
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black bg-green-400 rounded-lg shadow-md hover:bg-green-300 transition text-sm sm:text-base"
            >
              <Play className="h-4 w-4" />
              Resume
            </button>
            <button
              onClick={handleCheckIn}
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition text-sm sm:text-base"
            >
              <TimerReset className="h-4 w-4" />
              Check In
            </button>
            <button
              onClick={handleFinishSession}
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-[#f7006b] rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:text-base"
            >
              <Square className="h-4 w-4" />
              Finish
            </button>
          </>
        )}

        {sessionState === "finished" && (
          <button
            onClick={handleResetSession}
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition text-sm sm:text-base"
          >
            <RotateCcw className="h-4 w-4" />
            New Session
          </button>
        )}
      </div>

      <TextToSpeech isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
}

export default Timer;
