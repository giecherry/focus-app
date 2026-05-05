import { useState } from "react";
import { Clipboard, FileDown, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import useStore from "../store/useStore";

function SessionLog() {
  const sessionLog = useStore((state) => state.sessionLog);
  const resetLog = useStore((state) => state.resetLog);
  const resetSummary = useStore((state) => state.resetSummary);
  const [copyStatus, setCopyStatus] = useState("");

  const logText = sessionLog
    .map((entry) => entry.cleaned || entry.original)
    .join("\n\n");

  const copyToClipboard = async () => {
    if (!logText) return;

    await navigator.clipboard.writeText(logText);
    setCopyStatus("Copied");
    window.setTimeout(() => setCopyStatus(""), 1600);
  };

  const exportToPDF = () => {
    if (!logText) return;

    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    let y = 14;
    doc.text("Session Log", 10, y);
    y += 10;

    sessionLog.forEach((entry) => {
      const lines = doc.splitTextToSize(entry.cleaned || entry.original, 180);
      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 14;
        }
        doc.text(line, 10, y);
        y += 7;
      });
      y += 4;
    });

    doc.save("session-log.pdf");
  };

  const handleResetLog = () => {
    resetLog();
    resetSummary();
  };

  return (
    <section className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-400 flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300">
          Running Notes
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-white">Session Log</h2>
      </div>

      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg h-64 overflow-y-auto border border-white/10">
        {sessionLog.length > 0 ? (
          sessionLog.map((entry, index) => (
            <article key={`${entry.original}-${index}`} className="mb-4 last:mb-0">
              <p className="text-xs font-semibold text-yellow-300 mb-1">Check-in {index + 1}</p>
              <p className="text-sm text-gray-100 whitespace-pre-wrap">
                {entry.cleaned || entry.original}
              </p>
              {entry.cleanupStatus === "cleaning" && (
                <p className="mt-1 text-xs text-gray-400">Cleaning up transcript...</p>
              )}
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No entries yet. Start a session and use check-ins to capture what changed.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={copyToClipboard}
          disabled={!sessionLog.length}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#85d8ff] text-black rounded-lg shadow-md hover:bg-[#9de0ff] transition text-sm disabled:opacity-50"
        >
          <Clipboard className="h-4 w-4" />
          {copyStatus || "Copy"}
        </button>
        <button
          onClick={exportToPDF}
          disabled={!sessionLog.length}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-400 text-black rounded-lg shadow-md hover:bg-green-300 transition text-sm disabled:opacity-50"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </button>
        <button
          onClick={handleResetLog}
          disabled={!sessionLog.length}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#f7006b] text-white rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>
    </section>
  );
}

export default SessionLog;
