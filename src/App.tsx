import { useState } from 'react';
import { DiffViewer } from './components/DiffViewer';
import { testCases } from './examples/testCases';

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentTest = testCases[selectedIndex];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Delta Studio</h1>
          <p className="text-sm text-gray-500">Visual diff viewer for HTML document comparison</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Example Selector Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <label
                htmlFor="example-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Example
              </label>
              <p className="text-xs text-gray-500">Choose a test case to view the HTML differences</p>
            </div>
            <select
              id="example-select"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="w-full sm:w-72 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
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
        </div>

        {/* Current Example Info */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{currentTest.name}</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Level 1: Basic Diff Viewer</span>
        </div>

        {/* Diff Viewer */}
        <DiffViewer
          original={currentTest.original}
          modified={currentTest.modified}
        />

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-400">Built with React + TypeScript + Tailwind</footer>
      </main>
    </div>
  );
}

export default App;
