import { jsPDF } from "jspdf";
import useStore from "../store/useStore";

function SessionLog() {
  const sessionLog = useStore((state) => state.sessionLog);
  const resetLog = useStore((state) => state.resetLog);

  const copyToClipboard = () => {
    const logText = sessionLog.join("\n");
    navigator.clipboard.writeText(logText);
    alert("Session log copied to clipboard!");
  };

  const exportToPDF = () => {
    const logText = sessionLog.join("\n");
    const doc = new jsPDF();
    doc.text(logText, 10, 10);
    doc.save("session-log.pdf");
  };

  return (
    <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-yellow-400">
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-yellow-300">Session Log</h2>
      <div className="bg-gray-900 p-3 sm:p-4 rounded-lg h-48 sm:h-64 overflow-y-auto">
        {sessionLog.length > 0 ? (
          sessionLog.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm text-yellow-300 mb-2">
              {entry}
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
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400 transition text-sm sm:text-base"
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
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-400 transition text-sm sm:text-base"
        >
          Reset Log
        </button>
      </div>
    </div>
  );
}

export default SessionLog;