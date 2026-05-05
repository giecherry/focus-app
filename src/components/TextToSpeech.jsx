"use client";

import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, MicOff, X } from "lucide-react";
import useStore from "../store/useStore";
import { cleanupText } from "../api/cleanup";

function TextToSpeech({ isOpen, onClose, disabled = false }) {
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
        useSpeechRecognition();
    const setTranscript = useStore((state) => state.setTranscript);
    const addLogEntry = useStore((state) => state.addLogEntry);
    const updateLogEntry = useStore((state) => state.updateLogEntry);
    const [isActive, setIsActive] = useState(false);
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isActive) {
            SpeechRecognition.startListening({ continuous: true, interimResults: true });
        } else {
            SpeechRecognition.stopListening();
        }
    }, [isActive]);

    useEffect(() => {
        setTranscript(transcript);
        if (transcript) {
            setDraft(transcript);
        }
    }, [transcript, setTranscript]);

    const handleClose = () => {
        if (isActive) {
            setIsActive(false);
            SpeechRecognition.stopListening();
        }
        onClose();
    };

    const toggleMic = (e) => {
        e.stopPropagation();
        if (disabled || !browserSupportsSpeechRecognition) return;
        setError("");
        setIsActive((prev) => !prev);
    };

    const saveTranscript = async () => {
        setError("");
        if (draft.trim()) {
            SpeechRecognition.stopListening();
            setIsActive(false);
            const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const logId = crypto.randomUUID();
            const savedDraft = draft.trim();
            const originalEntry = `${timestamp} - ${savedDraft}`;

            addLogEntry({
                id: logId,
                original: originalEntry,
                cleaned: null,
                cleanupStatus: "cleaning",
            });

            resetTranscript();
            setTranscript("");
            setDraft("");
            onClose();

            try {
                const cleanedTranscript = await cleanupText(savedDraft);
                const cleanedEntry = cleanedTranscript
                    ? `${timestamp} - ${cleanedTranscript}`
                    : null;
                updateLogEntry(logId, {
                    cleaned: cleanedEntry,
                    cleanupStatus: cleanedEntry ? "done" : "failed",
                });
            } catch {
                updateLogEntry(logId, { cleanupStatus: "failed" });
            }
        } else {
            setError("No text yet. Start the mic or type a quick note before saving.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative flex flex-col items-center animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    aria-label="Close check-in"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Check-In</h2>
                <p className="text-gray-500 text-sm mb-4 text-center">
                    {isActive ? "Listening now. Talk through the messy middle." : "Tap the microphone and brain dump what changed."}
                </p>

                {!browserSupportsSpeechRecognition && (
                    <div className="w-full rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 mb-4">
                        Speech recognition is not available in this browser. You can still type your check-in below.
                    </div>
                )}

                <div className="relative mb-6">
                    <button
                        type="button"
                        aria-label={isActive ? "Stop listening" : "Start listening"}
                        className={`relative z-10 p-8 rounded-full shadow-xl transition-all duration-300 ${isActive
                            ? "bg-red-500 text-white scale-110"
                            : "bg-yellow-400 hover:bg-yellow-500 text-black"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={toggleMic}
                        disabled={disabled}
                    >
                        {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>

                    {isActive && (
                        <span className="absolute inset-0 rounded-full bg-[#f7006b] animate-ping opacity-20"></span>
                    )}
                </div>

                <textarea
                    value={draft}
                    onChange={(event) => {
                        setDraft(event.target.value);
                        setTranscript(event.target.value);
                    }}
                    placeholder="Your check-in will appear here..."
                    className="w-full min-h-36 resize-y bg-gray-100 p-4 rounded-lg border border-gray-200 text-gray-700 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />

                {error && <p className="w-full text-sm text-[#f7006b] mb-3">{error}</p>}

                <button
                    onClick={saveTranscript}
                    className="px-6 py-2 bg-[#85d8ff] text-black rounded-lg shadow-md hover:bg-[#9de0ff] transition"
                >
                    Save Check-In
                </button>
            </div>
        </div>
    );
}

export default TextToSpeech;
