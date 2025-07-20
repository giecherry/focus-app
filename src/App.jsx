import React, { useState, useEffect, useRef } from "react";
import logoBig from "./assets/logo-big.png";
import Header from "./components/Header";
import Timer from "./components/Timer";
import SessionLog from "./components/SessionLog";
import Footer from "./components/Footer";

function App() {
  // Configurable session and interval durations
  const [sessionHours, setSessionHours] = useState(1);
  const [intervalMinutes, setIntervalMinutes] = useState(25);

  // Convert to seconds for internal logic
  const totalSessionSeconds = sessionHours * 3600;
  const intervalSeconds = intervalMinutes * 60;

  // State
  const [elapsedSessionTime, setElapsedSessionTime] = useState(0);
  const [intervalTimeLeft, setIntervalTimeLeft] = useState(intervalSeconds);
  const [intervalRunning, setIntervalRunning] = useState(false);
  const [waitingForCheckIn, setWaitingForCheckIn] = useState(false);
  const [sessionLog, setSessionLog] = useState([]);
  const [intervalCount, setIntervalCount] = useState(0);

  // Refs to store interval timers & speech recognition
  const intervalTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Setup Web Speech API (once)
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const timeStamp = formatTime(elapsedSessionTime);
      // Add transcript as professional bullet point
      setSessionLog((log) => [
        ...log,
        `• ${timeStamp} - Worked on: ${transcript.charAt(0).toUpperCase() + transcript.slice(1)}.`,
      ]);
      onVoiceInputComplete();
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      onVoiceInputComplete();
    };
  }, [elapsedSessionTime]);

  // Effect to run timers when interval is running
  useEffect(() => {
    if (intervalRunning) {
      // Interval countdown timer every second
      intervalTimerRef.current = setInterval(() => {
        setIntervalTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            clearInterval(intervalTimerRef.current);
            triggerCheckIn();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);

      // Session elapsed time tracking every second
      sessionTimerRef.current = setInterval(() => {
        setElapsedSessionTime((elapsed) => {
          if (elapsed + 1 >= totalSessionSeconds) {
            // Session finished
            clearInterval(sessionTimerRef.current);
            clearInterval(intervalTimerRef.current);
            setIntervalRunning(false);
            setWaitingForCheckIn(false);
            return totalSessionSeconds;
          }
          return elapsed + 1;
        });
      }, 1000);
    }

    // Cleanup on unmount or when intervalRunning changes
    return () => {
      clearInterval(intervalTimerRef.current);
      clearInterval(sessionTimerRef.current);
    };
  }, [intervalRunning, totalSessionSeconds]);

  // Format seconds into HH:MM:SS or MM:SS string
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  }
  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  // Trigger voice check-in after interval or on force stop
  function triggerCheckIn() {
    setIntervalRunning(false);
    setWaitingForCheckIn(true);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // sometimes start throws if called too soon after stop
        setWaitingForCheckIn(false);
      }
    }
  }

  // Called when voice input finishes or errors
  function onVoiceInputComplete() {
    setWaitingForCheckIn(false);
    setIntervalCount((count) => count + 1);

    // If session time left, restart next interval
    if (elapsedSessionTime < totalSessionSeconds) {
      setIntervalTimeLeft(intervalSeconds);
      setIntervalRunning(true);
    } else {
      // Session fully done
      setIntervalRunning(false);
    }
  }

  // Force stop current interval, trigger check-in immediately
  function handleForceStop() {
    clearInterval(intervalTimerRef.current);
    clearInterval(sessionTimerRef.current);
    triggerCheckIn();
  }

  // Start or restart session and interval timers
  function handleStart() {
    if (elapsedSessionTime >= totalSessionSeconds) {
      // Reset session if finished
      setElapsedSessionTime(0);
      setIntervalCount(0);
      setSessionLog([]);
    }
    setIntervalTimeLeft(intervalSeconds);
    setIntervalRunning(true);
  }

  // Percent calculations for progress bars
  const sessionProgressPercent = Math.min(
    (elapsedSessionTime / totalSessionSeconds) * 100,
    100
  );
  const intervalProgressPercent = Math.min(
    ((intervalSeconds - intervalTimeLeft) / intervalSeconds) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-white text-dark px-6 py-10 flex flex-col items-center font-lexend">
      <Header />

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Timer onAddLogEntry={setSessionLog} />
        <SessionLog log={sessionLog} onResetLog={setSessionLog} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
