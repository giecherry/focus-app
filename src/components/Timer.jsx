import { useRef, useEffect, useState } from "react";
import useStore from "../store/useStore";
import TextToSpeech from "./TextToSpeech";

function Timer() {
  const sessionState = useStore((state) => state.sessionState); // Access session state
  const startSession = useStore((state) => state.startSession);
  const pauseSession = useStore((state) => state.pauseSession);
  const resumeSession = useStore((state) => state.resumeSession);
  const finishSession = useStore((state) => state.finishSession);
  const resetSession = useStore((state) => state.resetSession);

  const [sessionDuration, setSessionDuration] = useState(1 * 3600); // Default: 1 hour
  const [intervalDuration, setIntervalDuration] = useState(25 * 60); // Default: 25 minutes
  const [sessionRemaining, setSessionRemaining] = useState(1 * 3600);
  const [intervalRemaining, setIntervalRemaining] = useState(25 * 60);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timerRef = useRef(null);

  // Start the session
  const handleStartSession = () => {
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    resetSession(); // Reset session state to "not_started"
    startSession(); // Set session state to "running"

    timerRef.current = setInterval(() => {
      setSessionRemaining((prev) => Math.max(prev - 1, 0));
      setIntervalRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishSession(); // Mark session as finished
          setIsModalOpen(true); // Open the check-in modal
          return intervalDuration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause the session
  const handlePauseSession = () => {
    pauseSession(); // Set session state to "paused"
    clearInterval(timerRef.current);
  };

  // Resume the session
  const handleResumeSession = () => {
    resumeSession(); // Set session state to "running"

    timerRef.current = setInterval(() => {
      setSessionRemaining((prev) => Math.max(prev - 1, 0));
      setIntervalRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishSession(); // Mark session as finished
          setIsModalOpen(true); // Open the check-in modal
          return intervalDuration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop the session completely
  const handleStopSession = () => {
    finishSession(); // Set session state to "finished"
    clearInterval(timerRef.current);
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    setIsModalOpen(false);
  };

  // Open the check-in modal
  const handleCheckIn = () => {
    pauseSession(); // Pause the session during check-in
    clearInterval(timerRef.current);
    setIsModalOpen(true);
  };

  // Close the check-in modal and resume the session
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (sessionState === "paused") {
      handleResumeSession(); // Resume the session if it was paused
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, []);

  return (
    <section className="bg-gray-900 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-yellow-400 flex flex-col items-center">
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-yellow-300">Focus Timer</h2>

      {/* Session Duration Selector */}
      <div className="w-full mb-4">
        <label className="block text-xs sm:text-sm text-yellow-300 mb-2">Session Duration (hours):</label>
        <select
          value={sessionDuration / 3600}
          onChange={(e) => {
            const newDuration = e.target.value * 3600;
            setSessionDuration(newDuration);
            setSessionRemaining(newDuration);
          }}
          disabled={sessionState === "running" || sessionState === "paused"}
          className="w-full bg-gray-800 text-white rounded-lg p-2 text-xs sm:text-sm"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} hour{(i + 1) > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Interval Duration Selector */}
      <div className="w-full mb-4">
        <label className="block text-xs sm:text-sm text-yellow-300 mb-2">Interval Duration (minutes):</label>
        <select
          value={intervalDuration / 60}
          onChange={(e) => {
            const newInterval = e.target.value * 60;
            setIntervalDuration(newInterval);
            setIntervalRemaining(newInterval);
          }}
          disabled={sessionState === "running" || sessionState === "paused"}
          className="w-full bg-gray-800 text-white rounded-lg p-2 text-xs sm:text-sm"
        >
          {[15, 20, 25, 30, 45, 60].map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes
            </option>
          ))}
        </select>
      </div>

      {/* Timers */}
      <div className="text-center mb-4">
        <div className="text-4xl sm:text-6xl font-mono">
          {Math.floor(intervalRemaining / 60)}:{(intervalRemaining % 60).toString().padStart(2, "0")}
        </div>
        <div className="text-xs sm:text-sm mt-1 text-yellow-300">Interval Timer</div>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl sm:text-6xl font-mono">
          {Math.floor(sessionRemaining / 3600)}:
          {Math.floor((sessionRemaining % 3600) / 60).toString().padStart(2, "0")}:
          {(sessionRemaining % 60).toString().padStart(2, "0")}
        </div>
        <div className="text-xs sm:text-sm mt-1 text-yellow-300">Session Timer</div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {sessionState === "not_started" && (
          <button
            onClick={handleStartSession}
            className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition text-sm sm:text-base"
          >
            Start Session
          </button>
        )}
        {sessionState === "running" && (
          <>
            <button
              onClick={handlePauseSession}
              className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-blue-500 rounded-lg shadow-md hover:bg-blue-400 transition text-sm sm:text-base"
            >
              Pause Session
            </button>
            <button
              onClick={handleStopSession}
              className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-[#f7006b] rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:text-base"
            >
              Stop Session
            </button>
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-[#85d8ff] rounded-lg shadow-md hover:bg-[#9de0ff] transition text-sm sm:text-base"
            >
              Start Check-In
            </button>
          </>
        )}
        {sessionState === "paused" && (
          <button
            onClick={handleResumeSession}
            className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-green-500 rounded-lg shadow-md hover:bg-green-400 transition text-sm sm:text-base"
          >
            Resume Session
          </button>
        )}
      </div>

      {/* Text-to-Speech Modal */}
      <TextToSpeech
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default Timer;