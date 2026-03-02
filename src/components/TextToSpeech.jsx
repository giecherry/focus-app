"use client";

import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, MicOff, X } from "lucide-react";
import useStore from "../store/useStore";

function TextToSpeech({ isOpen, onClose, disabled = false }) {
    const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } =
        useSpeechRecognition();
    const setTranscript = useStore((state) => state.setTranscript);
    const addLogEntry = useStore((state) => state.addLogEntry);
    const [isActive, setIsActive] = useState(false);

    // Start or stop the microphone based on `isActive`
    useEffect(() => {
        if (isActive) {
            SpeechRecognition.startListening({ continuous: true, interimResults: true });
        } else {
            SpeechRecognition.stopListening();
        }
    }, [isActive]);

    useEffect(() => {
        setTranscript(transcript);
    }, [transcript, setTranscript]);

    const handleClose = () => {
        if (isActive) {
            setIsActive(false);
            SpeechRecognition.stopListening();
        }
        onClose();
    };

    // Toggle microphone state
    const toggleMic = (e) => {
        e.stopPropagation();
        if (disabled || !browserSupportsSpeechRecognition) return;
        setIsActive((prev) => !prev);
    };

    // Save the transcript and reset states
    const saveTranscript = () => {
        if (transcript.trim()) {
            const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            addLogEntry(`${timestamp} - ${transcript}`);
            resetTranscript();
            setTranscript("");
            setIsActive(false);
            SpeechRecognition.stopListening();
            onClose();
        } else {
            alert("No text to save. Please speak into the microphone.");
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
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Check-In</h2>
                <p className="text-gray-500 text-sm mb-4 text-center">
                    {isActive ? "I'm listening... speak naturally." : "Tap the microphone to start your update."}
                </p>

                {/* Mic Button */}
                <div className="relative mb-6">
                    <button
                        type="button"
                        className={`relative z-10 p-8 rounded-full shadow-xl transition-all duration-300 ${isActive
                            ? "bg-red-500 text-white scale-110"
                            : "bg-yellow-400 hover:bg-yellow-500 text-black"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={toggleMic}
                        disabled={disabled}
                    >
                        {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>

                    {/* Pulsing Aura for active state */}
                    {isActive && (
                        <span className="absolute inset-0 rounded-full bg-[#f7006b] animate-ping opacity-20"></span>
                    )}
                </div>

                {/* Transcript Display */}
                <div className="w-full bg-gray-100 p-4 rounded-lg border border-gray-200 text-gray-700 text-sm mb-6">
                    {transcript ? (
                        <p>{transcript}</p>
                    ) : (
                        <p className="italic text-gray-400">Your speech will appear here...</p>
                    )}
                </div>

                {/* Save Button */}
                <button
                    onClick={saveTranscript}
                    className="px-6 py-2 bg-[#85d8ff] text-white rounded-lg shadow-md hover:bg-[#9de0ff] transition"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default TextToSpeech;