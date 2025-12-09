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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Delta Studio</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">HTML diff viewer with accept/reject</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
              <button
                onClick={() => setMode('interactive')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === 'interactive'
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">Interactive</span>
                <span className="sm:hidden">Review</span>
              </button>
              <button
                onClick={() => setMode('basic')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === 'basic'
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">Basic Diff</span>
                <span className="sm:hidden">Diff</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm shadow-gray-200/50 p-4 sm:p-5 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Example Selector */}
            <div className="flex-1 max-w-sm">
              <label
                htmlFor="example-select"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Test Example
              </label>
              <div className="relative">
                <select
                  id="example-select"
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:bg-gray-100/50"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mode Badge */}
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  mode === 'interactive'
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                }`}
              >
                {mode === 'interactive' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Level 2: Interactive Review
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Level 1: Basic Diff View
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Example Title */}
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{currentTest.name}</h2>
        </div>

        {/* Content based on mode */}
        <div className="transition-all duration-300">
          {mode === 'basic' ? (
            <DiffViewer
              original={currentTest.original}
              modified={currentTest.modified}
            />
          ) : (
            <InteractiveDiff
              key={selectedIndex}
              original={currentTest.original}
              modified={currentTest.modified}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 border-t border-gray-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
            <span className="font-medium">Built with React + TypeScript + Tailwind</span>
            <span className="text-gray-300">
              {mode === 'interactive' ? 'Accept or reject changes individually' : 'View raw HTML diff'}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
