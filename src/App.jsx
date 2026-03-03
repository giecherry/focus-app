import Header from "./components/Header";
import Timer from "./components/Timer";
import SessionLog from "./components/SessionLog";
import Footer from "./components/Footer";
import Summary from "./components/Summary";
import useStore from "./store/useStore";
import { useEffect } from "react";
import { getSummary } from "./api/summarize";


function App() {
  const sessionLog = useStore((state) => state.sessionLog);
  const setSummary = useStore((state) => state.setSummary);
  const summary = useStore((state) => state.summary);
  const sessionState = useStore((state) => state.sessionState);


  useEffect(() => {
    const fetchSummary = async () => {
      if (sessionLog.length > 0) {
        const text = sessionLog
          .map((entry) => entry.original)
          .join("\n");
        const summary = await getSummary(text);
        setSummary(summary);
      }
    };

    if (sessionState === "finished") {
      fetchSummary();
    }
  }, [sessionLog, sessionState]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--color-surface)] text-[var(--color-dark)] px-6 py-10 font-lexend">
      <Header />
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Timer />
        <SessionLog />
        {sessionState === "finished" && summary && <Summary />}
      </main>
      <Footer />
    </div>
  );
}

export default App;