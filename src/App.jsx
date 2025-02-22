import React, { useState, useEffect } from 'react';
import Repo from './components/Repo';

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
    summary: "Some summary goes here.",
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
    <Repo />
  );
}

export default App;