// App.jsx
import { useEffect, useState } from 'react';
import IssueViewer from './components/IssueViewer';
import PullRequestViewer from './components/PullRequestViewer';

const COMPONENTS = {
  IssueViewer,
  PullRequestViewer
};

export default function App() {
  const [componentToRender, setComponentToRender] = useState(null);

  useEffect(() => {
    // Determine which component to render based on URL
    if (window.location.href.includes('/issues/')) {
      setComponentToRender('IssueViewer');
    } else if (window.location.href.includes('/pull/')) {
      setComponentToRender('PullRequestViewer');
    }
  }, []);

  if (!componentToRender) return null;

  const Component = COMPONENTS[componentToRender];
  return <Component />;
}

