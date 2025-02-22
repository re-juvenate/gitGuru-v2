import React, { useState, useEffect } from 'react';
// import Repo from './components/Repo';

function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState({
    summary: '',
    possible_fixes: '',
    problems: {},
    code_extracts: []
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
    summary: "Some summary goes hereee.",
    possible_fixes: "This possible fixes goes into depth about the underlying causes and context of the situation. It provides background information and detailed analysis of various factors involved.",
    problems: {
      "Implement a new monitoring system": "",
      "Update existing protocols": "",
      "Provide additional training to team members": "",
      "Establish regular review cycles": ""
    },
    code_extracts: [
      "",
      "",
      "",
      "",
    ]
  };

  return (
    <div className="flex flex-col min-h-3/4 gap-6">
    <div className="flex-1 min-h-[400px] w-full rounded-lg shadow-md border">
      <nav className="w-full flex flex-row border">
        <button
          className={`w-1/2 py-4 font-semibold transition-colors hover:bg-green-600 hover:text-white${
            activeTab === 'summary'
              ? 'text-green-600 border-b border-green-600'
              : 'text-white'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`w-1/2 py-4 font-semibold transition-colors hover:bg-green-600 hover:text-white${
            activeTab === 'possible_fixes'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-white'
          }`}
          onClick={() => setActiveTab('possible_fixes')}
        >
          Possible fixes
        </button>
      </nav>

      <div className="p-4 sm:p-6 text-sm sm:text-sm text-white h-[calc(100%-3.5rem)] overflow-y-auto">
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

      <div
      className="w-auto max-w-full border border-white rounded-lg p-2 px-3 mx-2 text-white bg-transparent outline-none break-words"
      contentEditable
      suppressContentEditableWarning
    >
      Enter your message here...
    </div>


    </div>
  </div>
  );
}

export default App;