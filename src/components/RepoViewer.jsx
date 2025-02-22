import DynamicViewer from "./DynamicViewer";

export default function RepoViewer() {
    return (
        <DynamicViewer apiEndpoint="" tabs={{
            summary: "Summary",
            instructions: "Instructions"
        }} />
    )
}