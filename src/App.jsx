import { useState } from "react";
import Header from "./components/Header";
import Timer from "./components/Timer";
import SessionLog from "./components/SessionLog";
import Footer from "./components/Footer";

function App() {
  const [sessionLog, setSessionLog] = useState([]);

  const handleResetLog = () => {
    if (window.confirm("Are you sure you want to reset the session log?")) {
      setSessionLog([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--color-surface)] text-[var(--color-dark)] px-6 py-10 font-lexend">
      <Header />
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Timer onAddLogEntry={setSessionLog} />
        <SessionLog log={sessionLog} onResetLog={handleResetLog} />
      </main>
      <Footer />
    </div>
  );
}

export default App;