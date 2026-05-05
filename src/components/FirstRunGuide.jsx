import { useEffect, useState } from "react";
import { Check, Mic, Sparkles, TimerReset, X } from "lucide-react";

const STORAGE_KEY = "bee-focused-guide-dismissed";

function FirstRunGuide() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(window.localStorage.getItem(STORAGE_KEY) !== "true");
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section className="w-full max-w-5xl mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-gray-900 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            First Run
          </p>
          <h2 className="text-xl font-semibold text-gray-950">How a session works</h2>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss first run guide"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm hover:bg-yellow-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="flex gap-3">
          <TimerReset className="mt-0.5 h-5 w-5 shrink-0 text-gray-800" />
          <p className="text-sm text-gray-700">Pick a session length and check-in rhythm.</p>
        </div>
        <div className="flex gap-3">
          <Mic className="mt-0.5 h-5 w-5 shrink-0 text-gray-800" />
          <p className="text-sm text-gray-700">Talk naturally when the check-in opens.</p>
        </div>
        <div className="flex gap-3">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-gray-800" />
          <p className="text-sm text-gray-700">Save adds the note right away.</p>
        </div>
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gray-800" />
          <p className="text-sm text-gray-700">Finish creates a reflection summary.</p>
        </div>
      </div>
    </section>
  );
}

export default FirstRunGuide;
