import { jsPDF } from "jspdf";
import useStore from "../store/useStore";

function SessionLog() {
  const sessionLog = useStore((state) => state.sessionLog);
  const resetLog = useStore((state) => state.resetLog);


  const copyToClipboard = () => {
    const logText = sessionLog
      .map((entry) => entry.cleaned || entry.original)
      .join("\n");
    navigator.clipboard.writeText(logText);
    alert("Session log copied to clipboard!");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    let y = 10;
    doc.text("Session Log:", 10, y);
    y += 10;

    sessionLog.forEach((entry) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(entry.cleaned || entry.original, 10, y);
      y += 10;
    });

    doc.save("session-log.pdf");
  };

  return (
    <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-yellow-400">
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-yellow-300">Session Log</h2>
      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg h-48 sm:h-64 overflow-y-auto">
        {sessionLog.length > 0 ? (
          sessionLog.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm text-yellow-300 mb-2">
              {entry.cleaned ? entry.cleaned : entry.original}
            </p>
          ))
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">
            No entries yet. Start a session to log your progress!
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-[#85d8ff] text-white rounded-lg shadow-md hover:bg-[#9de0ff] transition text-sm sm:text-base"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-400 transition text-sm sm:text-base"
        >
          Export to PDF
        </button>
        <button
          onClick={resetLog}
          className="px-4 py-2 bg-[#f7006b] text-white rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:text-base"
        >
          Reset Log
        </button>
      </div>
    </div>
  );
}

export default SessionLog;