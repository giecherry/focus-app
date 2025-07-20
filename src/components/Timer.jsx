import React, { useState, useEffect, useRef } from "react";

function Timer({ onAddLogEntry }) {
  const [sessionDuration, setSessionDuration] = useState(1 * 3600); // Default: 1 hour
  const [intervalDuration, setIntervalDuration] = useState(25 * 60); // Default: 25 minutes
  const [sessionRemaining, setSessionRemaining] = useState(sessionDuration);
  const [intervalRemaining, setIntervalRemaining] = useState(intervalDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voicePromptVisible, setVoicePromptVisible] = useState(false);
  const [transcriptBuffer, setTranscriptBuffer] = useState(""); // Placeholder for transcript
  const [finalTranscript, setFinalTranscript] = useState(""); // Placeholder for final transcript

  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSessionRemaining((prev) => Math.max(prev - 1, 0));
      setIntervalRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setVoicePromptVisible(true); // Show voice prompt
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const startVoiceCheckIn = () => {
    console.log("Starting voice check-in...");
    setIsRecording(true);
    setTranscriptBuffer(""); // Clear the buffer
  };

  const stopVoiceCheckIn = () => {
    console.log("Stopping voice check-in...");
    setIsRecording(false);
    setFinalTranscript(transcriptBuffer.trim()); // Finalize the transcript
  };

  const saveLogEntry = () => {
    const timestamp = formatTime(sessionDuration - sessionRemaining);
    const logEntry = `• ${timestamp} - Worked on: ${finalTranscript}`;
    onAddLogEntry((prevLog) => [...prevLog, logEntry]);
    setFinalTranscript(""); // Clear the final transcript
    setVoicePromptVisible(false); // Hide voice prompt
    setIntervalRemaining(intervalDuration);
    setIsRunning(true);
  };

  const retryVoiceCheckIn = () => {
    setFinalTranscript(""); // Clear the final transcript
    setTranscriptBuffer(""); // Clear the buffer
    startVoiceCheckIn(); // Restart voice check-in
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const handleStart = () => {
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const handleForceStop = () => {
    handleStop();
    setVoicePromptVisible(true); // Show voice prompt immediately
  };

  const handleRestart = () => {
    handleStop();
    setSessionRemaining(sessionDuration);
    setIntervalRemaining(intervalDuration);
  };

  const handleExitSession = () => {
    handleStop();
    alert("Session ended. You can now export the session summary.");
  };

  return (
    <section className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-yellow-400 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Focus Timer</h2>

      <div className="w-full mb-4">
        <label className="block text-sm text-yellow-300 mb-2">Session Duration (hours):</label>
        <select
          value={sessionDuration / 3600}
          onChange={(e) => setSessionDuration(e.target.value * 3600)}
          disabled={isRunning || isRecording}
          className="w-full bg-gray-800 text-white rounded-lg p-2"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} hour{(i + 1) > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm text-yellow-300 mb-2">Interval Duration (minutes):</label>
        <select
          value={intervalDuration / 60}
          onChange={(e) => setIntervalDuration(e.target.value * 60)}
          disabled={isRunning || isRecording}
          className="w-full bg-gray-800 text-white rounded-lg p-2"
        >
          {[15, 20, 25, 30, 45, 60].map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mb-4">
        <div className="text-6xl font-mono">{formatTime(intervalRemaining)}</div>
        <div className="text-sm mt-1 text-yellow-300">Interval Timer</div>
      </div>

      <div className="text-center mb-4">
        <div className="text-6xl font-mono">{formatTime(sessionRemaining)}</div>
        <div className="text-sm mt-1 text-yellow-300">Session Timer</div>
      </div>

      <div className="flex gap-4">
        {!isRunning && (
          <button
            onClick={handleStart}
            className="px-5 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition"
          >
            Start Session
          </button>
        )}
        {isRunning && (
          <button
            onClick={handleStop}
            className="px-5 py-2 font-semibold text-black bg-red-500 rounded-lg shadow-md hover:bg-red-400 transition"
          >
            Stop Session
          </button>
        )}
        {isRunning && (
          <button
            onClick={handleForceStop}
            className="px-5 py-2 font-semibold text-black bg-blue-500 rounded-lg shadow-md hover:bg-blue-400 transition"
          >
            Force Stop
          </button>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleRestart}
          className="px-5 py-2 font-semibold text-black bg-gray-500 rounded-lg shadow-md hover:bg-gray-400 transition"
        >
          Restart Session
        </button>
        <button
          onClick={handleExitSession}
          className="px-5 py-2 font-semibold text-black bg-gray-500 rounded-lg shadow-md hover:bg-gray-400 transition"
        >
          Exit Session
        </button>
      </div>

      {voicePromptVisible && (
        <div className="mt-6 text-center">
          <p className="text-yellow-300 font-semibold mb-4">
            What have you been working on?
          </p>
          <button
            onClick={startVoiceCheckIn}
            className="px-5 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition"
          >
            Start Talking
          </button>
          {isRecording && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={stopVoiceCheckIn}
                className="px-5 py-2 font-semibold text-black bg-red-500 rounded-lg shadow-md hover:bg-red-400 transition"
              >
                Stop Talking
              </button>
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-yellow-300"></div>
            </div>
          )}
          {finalTranscript && (
            <div className="mt-4">
              <p className="text-yellow-300 font-semibold mb-2">Transcript:</p>
              <p className="text-white italic">{finalTranscript}</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={saveLogEntry}
                  className="px-5 py-2 font-semibold text-black bg-green-500 rounded-lg shadow-md hover:bg-green-400 transition"
                >
                  Save Log
                </button>
                <button
                  onClick={retryVoiceCheckIn}
                  className="px-5 py-2 font-semibold text-black bg-blue-500 rounded-lg shadow-md hover:bg-blue-400 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Timer;
