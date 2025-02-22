import DynamicViewer from "./DynamicViewer";

export default function PullRequestViewer() {
    return (
        <DynamicViewer apiEndpoint="" tabs={{ conflicts: "Conflicts", issues: "Issues" }} />
    )
}