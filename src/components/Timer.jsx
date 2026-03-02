import { useState, useRef, useEffect } from "react";
import TextToSpeech from "./TextToSpeech";

function Timer() {
  const [sessionDuration, setSessionDuration] = useState(1 * 3600);
  const [intervalDuration, setIntervalDuration] = useState(25 * 60);
  const [sessionRemaining, setSessionRemaining] = useState(1 * 3600);
  const [intervalRemaining, setIntervalRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timerRef = useRef(null);

  const startSession = () => {
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setSessionRemaining((prev) => Math.max(prev - 1, 0));
      setIntervalRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setIsModalOpen(true);
          return intervalDuration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopSession = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    setIsModalOpen(false);
  };

  const startCheckIn = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setIsModalOpen(true);
  };

  const resumeSession = () => {
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setSessionRemaining((prev) => Math.max(prev - 1, 0));
      setIntervalRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setIsModalOpen(true);
          return intervalDuration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="bg-gray-900 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-yellow-400 flex flex-col items-center">
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-yellow-300">Focus Timer</h2>

      <div className="w-full mb-4">
        <label className="block text-xs sm:text-sm text-yellow-300 mb-2">Session Duration (hours):</label>
        <select
          value={sessionDuration / 3600}
          onChange={(e) => {
            const newDuration = e.target.value * 3600;
            setSessionDuration(newDuration);
            setSessionRemaining(newDuration);
          }}
          disabled={isRunning}
          className="w-full bg-gray-800 text-white rounded-lg p-2 text-xs sm:text-sm"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} hour{(i + 1) > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mb-4">
        <label className="block text-xs sm:text-sm text-yellow-300 mb-2">Interval Duration (minutes):</label>
        <select
          value={intervalDuration / 60}
          onChange={(e) => {
            const newInterval = e.target.value * 60;
            setIntervalDuration(newInterval);
            setIntervalRemaining(newInterval);
          }}
          disabled={isRunning}
          className="w-full bg-gray-800 text-white rounded-lg p-2 text-xs sm:text-sm"
        >
          {[15, 20, 25, 30, 45, 60].map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes
            </option>
          ))}
        </select>
      </div>

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

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {!isRunning && (
          <button
            onClick={startSession}
            className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition text-sm sm:text-base"
          >
            Start Session
          </button>
        )}
        {isRunning && (
          <>
            <button
              onClick={stopSession}
              className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-[#f7006b] rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:text-base"
            >
              Stop Session
            </button>
            <button
              onClick={startCheckIn}
              className="px-4 py-2 sm:px-5 sm:py-2 font-semibold text-black bg-[#85d8ff] rounded-lg shadow-md hover:bg-[#9de0ff] transition text-sm sm:text-base"
            >
              Start Check-In
            </button>
          </>
        )}
      </div>

      <TextToSpeech
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resumeSession();
        }}
      />
    </section>
  );
}

export default Timer;