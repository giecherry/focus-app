import { jsPDF } from "jspdf";
import useStore from "../store/useStore";
import { Switch } from "radix-ui";
import { useState } from "react";

function Summary() {
    const summary = useStore((state) => state.summary);
    const sessionLog = useStore((state) => state.sessionLog);
    const resetSession = useStore((state) => state.resetSession);
    const resetSummary = useStore((state) => state.resetSummary);
    const resetLog = useStore((state) => state.resetLog);
    const [logsIncluded, setLogsIncluded] = useState(true);

    const copyToClipboard = () => {
        let logText = "";

        const timestamp = new Date().toLocaleString();
        logText += "=== Today's Summary ===\n";
        logText += `Generated on: ${timestamp}\n\n`;
        logText += `${summary}\n\n`;

        if (logsIncluded) {
            logText += "=== Session Log ===\n";
            sessionLog.forEach((entry, index) => {
                logText += `Entry ${index + 1}:\n`;
                logText += `Timestamp: ${entry.original.split(" - ")[0]}\n`;
                logText += `Cleaned: ${entry.cleaned || "N/A"}\n\n`;
            });
        }

        navigator.clipboard.writeText(logText);
        alert("Summary log copied to clipboard!");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);

        let y = 10;
        if (summary) {
            doc.addPage();
            doc.text("Summary:", 10, y);
            y += 10;

            const lines = doc.splitTextToSize(summary, 180);
            lines.forEach((line) => {
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
                doc.text(line, 10, y);
                y += 10;
            });
        }
        if (logsIncluded) {
            sessionLog.forEach((entry, index) => {
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
                doc.text("Session Logs:", 10, y);
                y += 10;

                doc.text(`Entry ${index + 1}:`, 10, y);
                y += 10;
                doc.text(`Timestamp: ${entry.original.split(" - ")[0]}`, 10, y);
                y += 10;
            });
        }

        doc.save("session-summary.pdf");
    };

    const handleRestartSession = () => {
        resetSession();
        resetSummary();
        resetLog();
    };

    return (
        <div className="col-span-full bg-gray-800 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-yellow-400">
            <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-yellow-300">Session Summary</h2>
            {summary ? (
                <div className="bg-gray-700 p-4 rounded-lg mt-4">
                    <div className="bg-gray-900 p-3 sm:p-4 rounded-lg h-48 sm:h-64 overflow-y-auto">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{summary}
                            {logsIncluded && `\n\n=== Session Logs ===\n\n${sessionLog.map((entry, index) => `Entry ${index + 1}:\nTimestamp: ${entry.original.split(" - ")[0]}\nContent: ${entry.cleaned || "N/A"}`).join("\n\n")}`}
                        </p>
                    </div>
                </div>
            ) : <p className="text-xs sm:text-sm text-gray-500">
                Generating your summary!
            </p>}
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
                <div className="flex items-center">
                    <label
                        className="pr-[15px] text-[15px] leading-none text-white"
                        htmlFor="logs-included"
                    >
                        Add logs
                    </label>
                    <Switch.Root
                        className="relative flex items-center h-[2rem] w-[3.6rem] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=unchecked]:bg-black"
                        id="logs-included"
                        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" }}
                        defaultChecked={true}
                        checked={logsIncluded}
                        onCheckedChange={setLogsIncluded}
                    >
                        <Switch.Thumb className="block size-[1.2rem] translate-x-[0.8rem] rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[-0.8rem]" />
                    </Switch.Root>
                </div>
                <button
                    onClick={handleRestartSession}
                    className="px-4 py-2 ml-72 bg-[#f7006b] text-white rounded-lg shadow-md hover:bg-[#ff4c7d] transition text-sm sm:text-base"
                >
                    Start New Session
                </button>
            </div>
        </div>
    );
}

export default Summary;