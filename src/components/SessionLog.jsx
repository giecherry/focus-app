import React from "react";
import { jsPDF } from "jspdf"; 

function SessionLog({ log, onResetLog }) {
  const copyToClipboard = () => {
    const logText = log.join("\n");
    navigator.clipboard.writeText(logText).then(() => {
      alert("Session log copied to clipboard!");
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("BeeFocused Session Log", 10, 10);
    log.forEach((entry, index) => {
      doc.text(`${index + 1}. ${entry}`, 10, 20 + index * 10);
    });
    doc.save("session-log.pdf");
  };

  return (
    <section className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between gap-4 border border-yellow-400">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Session Log</h2>
        <ul className="space-y-2 text-sm h-60 overflow-y-auto border border-gray-700 p-3 rounded bg-gray-800">
          {log.length === 0 && (
            <li className="italic text-gray-400">No check-ins yet.</li>
          )}
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={copyToClipboard}
          className="px-5 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition"
        >
          Copy Log
        </button>
        <button
          onClick={exportToPDF}
          className="px-5 py-2 font-semibold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 transition"
        >
          Export as PDF
        </button>
      </div>

      <button
        className="bg-red-500 hover:bg-red-400 text-white font-semibold py-2 rounded-xl transition w-full mt-4"
        onClick={onResetLog}
      >
        Reset Log
      </button>
    </section>
  );
}

export default SessionLog;