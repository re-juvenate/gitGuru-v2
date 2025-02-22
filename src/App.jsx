import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState({
    summary: '',
    possible_fixes: '',
    problems: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mockData = {
    summary: "Some summary goes here.",
    possible_fixes: "This possible fixes goes into depth about the underlying causes and context of the situation. It provides background information and detailed analysis of various factors involved.",
    problems: [
      "Implement a new monitoring system",
      "Update existing protocols",
      "Provide additional training to team members",
      "Establish regular review cycles"
    ]
  };

  return (
    <div className="flex flex-col min-h-screen  w-screen mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <div className="flex-1 min-h-[400px] w-full rounded-lg shadow-md border">
        <nav className="w-full flex flex-row text-xl border">
          <button
            className={`w-1/2 py-4 font-semibold transition-colors hover:bg-green-600 ${
              activeTab === 'summary'
                ? 'text-green-600 border-b border-green-600'
                : 'text-white hover:text-green-500'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`w-1/2 py-4 font-semibold transition-colors ${
              activeTab === 'possible_fixes'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-white hover:text-green-500'
            }`}
            onClick={() => setActiveTab('possible_fixes')}
          >
            Possible fixes
          </button>
        </nav>

        <div className="p-4 sm:p-6 text-base sm:text-lg text-white h-[calc(100%-3.5rem)] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-pulse text-white">Loading...</div>
            </div>
          ) : (
            <div className="prose prose-lg prose-invert max-w-none">
              {activeTab === 'summary' ? mockData.summary : mockData.possible_fixes}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[400px] w-full rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Problems</h2>
        <div className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
          {mockData.problems.map((solution, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-green-600 transition-colors w-full"
            >
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full font-semibold">
                  {index + 1}
                </span>
                <p className="text-base sm:text-lg text-white flex-1">{solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;