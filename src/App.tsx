import { useState } from 'react';
import { DiffViewer } from './components/DiffViewer';
import { InteractiveDiff } from './components/InteractiveDiff';
import { testCases } from './examples/testCases';

type ViewMode = 'interactive' | 'basic';

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<ViewMode>('interactive');
  const currentTest = testCases[selectedIndex];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delta Studio</h1>
              <p className="text-sm text-gray-500">HTML diff viewer with accept/reject functionality</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setMode('interactive')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'interactive' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Interactive</span>
                <span className="sm:hidden">L2</span>
              </button>
              <button
                onClick={() => setMode('basic')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Basic Diff</span>
                <span className="sm:hidden">L1</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Example Selector */}
            <div className="flex-1">
              <label
                htmlFor="example-select"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Test Example
              </label>
              <select
                id="example-select"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="w-full lg:w-80 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
              >
                {testCases.map((test, index) => (
                  <option
                    key={index}
                    value={index}
                  >
                    {test.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Mode Info */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  mode === 'interactive' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {mode === 'interactive' ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    Level 2: Interactive
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Level 1: Basic Diff
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Example Title */}
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">{currentTest.name}</h2>
        </div>

        {/* Content based on mode */}
        {mode === 'basic' ? (
          <DiffViewer
            original={currentTest.original}
            modified={currentTest.modified}
          />
        ) : (
          <InteractiveDiff
            key={selectedIndex} // Reset state when example changes
            original={currentTest.original}
            modified={currentTest.modified}
          />
        )}

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
            <span>Built with React + TypeScript + Tailwind</span>
            <span>
              {mode === 'interactive'
                ? 'Accept or reject changes individually'
                : 'View raw HTML diff with syntax highlighting'}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
