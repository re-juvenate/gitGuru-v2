import DynamicViewer from "./DynamicViewer";

export default function RepoViewer() {
    console.log("GitGuru: Rendering RepoViewer");
    return (
        <DynamicViewer apiEndpoint="" tabs={{
            summary: "Summary",
            instructions: "Instructions"
        }} />
    )
}