import Header from "./components/Header";
import Timer from "./components/Timer";
import SessionLog from "./components/SessionLog";
import Footer from "./components/Footer";
import Summary from "./components/Summary";
import FirstRunGuide from "./components/FirstRunGuide";
import useStore from "./store/useStore";
import { useEffect } from "react";
import { getSummary } from "./api/summarize";

function App() {
  const sessionLog = useStore((state) => state.sessionLog);
  const setSummary = useStore((state) => state.setSummary);
  const setSummaryStatus = useStore((state) => state.setSummaryStatus);
  const setSummaryError = useStore((state) => state.setSummaryError);
  const summary = useStore((state) => state.summary);
  const sessionState = useStore((state) => state.sessionState);
  const summaryStatus = useStore((state) => state.summaryStatus);

  useEffect(() => {
    const fetchSummary = async () => {
      if (sessionLog.length > 0 && summaryStatus === "idle" && !summary) {
        setSummaryStatus("loading");
        const text = sessionLog
          .map((entry) => entry.original)
          .join("\n");
        try {
          const generatedSummary = await getSummary(text);
          setSummary(generatedSummary);
        } catch (error) {
          setSummaryError(
            error.requestId
              ? `${error.message} Request ID: ${error.requestId}`
              : error.message
          );
        }
      }
    };

    if (sessionState === "finished" && sessionLog.length > 0) {
      fetchSummary();
    }
  }, [sessionLog, sessionState, setSummary, setSummaryError, setSummaryStatus, summary, summaryStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--color-surface)] text-[var(--color-dark)] px-4 py-8 sm:px-6 sm:py-10 font-lexend">
      <Header />
      <FirstRunGuide />
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Timer />
        <SessionLog />
        {sessionState === "finished" && <Summary />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
