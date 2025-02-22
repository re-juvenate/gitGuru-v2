import { useEffect, useState } from "react";
import IssueViewer from "./components/IssueViewer";
import PullRequestViewer from "./components/PullRequestViewer";
import RepoViewer from "./components/RepoViewer";

const COMPONENTS = {
  IssueViewer,
  PullRequestViewer,
  RepoViewer,
};

export default function App() {
  const [componentToRender, setComponentToRender] = useState(null);
  
  useEffect(() => {
    const path = window.location.pathname;
    console.log("GitGuru: Detected Path -", path);
    if (path.includes("/issues/")) {
      setComponentToRender("IssueViewer");
    } else if (path.includes("/pull/")) {
      setComponentToRender("PullRequestViewer");
    } else {
      setComponentToRender("RepoViewer");
    }
  }, []);

  if (!componentToRender) return null;

  const Component = COMPONENTS[componentToRender];
  return <Component />;
}
