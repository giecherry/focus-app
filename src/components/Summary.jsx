import { useState } from "react";
import { Clipboard, FileDown, RefreshCw } from "lucide-react";
import { jsPDF } from "jspdf";
import useStore from "../store/useStore";

function Summary() {
  const summary = useStore((state) => state.summary);
  const summaryStatus = useStore((state) => state.summaryStatus);
  const summaryError = useStore((state) => state.summaryError);
  const sessionLog = useStore((state) => state.sessionLog);
  const resetSession = useStore((state) => state.resetSession);
  const setSummaryStatus = useStore((state) => state.setSummaryStatus);
  const [logsIncluded, setLogsIncluded] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");

  const buildSummaryText = () => {
    const timestamp = new Date().toLocaleString();
    let text = "=== Session Summary ===\n";
    text += `Generated on: ${timestamp}\n\n`;
    text += `${summary || "Summary unavailable."}\n\n`;

    if (logsIncluded && sessionLog.length) {
      text += "=== Session Log ===\n";
      text += sessionLog
        .map((entry, index) => `Check-in ${index + 1}\n${entry.cleaned || entry.original}`)
        .join("\n\n");
    }

    return text;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(buildSummaryText());
    setCopyStatus("Copied");
    window.setTimeout(() => setCopyStatus(""), 1600);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    let y = 14;
    const lines = doc.splitTextToSize(buildSummaryText(), 180);
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 14;
      }
      doc.text(line, 10, y);
      y += 7;
    });

    doc.save("session-summary.pdf");
  };

  return (
    <section className="col-span-full bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-400 flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300">
          Reflection
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-white">Session Summary</h2>
      </div>

      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg min-h-48 max-h-96 overflow-y-auto border border-white/10">
        {summaryStatus === "loading" && (
          <p className="text-sm text-gray-300">Generating your summary...</p>
        )}

        {summaryStatus === "idle" && !summary && (
          <p className="text-sm text-gray-300">
            Finish with at least one check-in to generate a reflection summary.
          </p>
        )}

        {summaryStatus === "error" && (
          <div className="space-y-2">
            <p className="text-sm text-[#ff8ab5]">Summary could not be generated.</p>
            <p className="text-sm text-gray-300">{summaryError}</p>
            <button
              onClick={() => setSummaryStatus("idle")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg shadow-md hover:bg-yellow-300 transition text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {summary && (
          <p className="text-sm text-gray-100 whitespace-pre-wrap">
            {summary}
            {logsIncluded &&
              `\n\n=== Session Log ===\n\n${sessionLog
                .map((entry, index) => `Check-in ${index + 1}\n${entry.cleaned || entry.original}`)
                .join("\n\n")}`}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={copyToClipboard}
          disabled={!summary && summaryStatus !== "error"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#85d8ff] text-black rounded-lg shadow-md hover:bg-[#9de0ff] transition text-sm disabled:opacity-50"
        >
          <Clipboard className="h-4 w-4" />
          {copyStatus || "Copy"}
        </button>
        <button
          onClick={exportToPDF}
          disabled={!summary && summaryStatus !== "error"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-400 text-black rounded-lg shadow-md hover:bg-green-300 transition text-sm disabled:opacity-50"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </button>

        <label className="inline-flex items-center gap-2 text-sm text-gray-100">
          <input
            type="checkbox"
            checked={logsIncluded}
            onChange={(event) => setLogsIncluded(event.target.checked)}
            className="h-4 w-4 accent-yellow-400"
          />
          Add logs
        </label>

        <button
          onClick={resetSession}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#f7006b] text-white rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:ml-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Start New Session
        </button>
      </div>
    </section>
  );
}

export default Summary;
