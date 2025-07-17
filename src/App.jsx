import Timer from "./components/Timer";
import logoBig from "./assets/logo-big.png";

function App() {
  return (
    <div className="min-h-screen bg-white text-dark font-sans px-6 py-10 flex flex-col items-center">
      {/* Header */}
      <header className="mb-8 text-center">
        <img src={logoBig} alt="" />
        <p className="text-gray-400 mt-2">Stay aware. Stay focused. Reflect better.</p>
      </header>

      {/* Main Grid */}
      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timer Section */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Focus Session</h2>
          <Timer />
        </section>

        {/* Log Section */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Session Log</h2>
            <ul className="space-y-2 text-sm text-dark h-60 overflow-y-auto border border-gray-700 p-2 rounded">
              <li>🗣️ 00:20 - "Writing my portfolio about the Pokémon app"</li>
              <li>🗣️ 00:40 - "Stuck on layout, switching to CSS fixes"</li>
              <li>🗣️ 01:00 - "Refactoring component structure"</li>
            </ul>
          </div>

          <button>
            End Session & Reflect
          </button>
        </section>
      </main>

      {/* Future: Reflection Modal or Section */}
      <footer className="mt-10 text-center text-sm">
        Built with ❤️ by Angie C.
      </footer>
    </div>
  );
}

export default App;
