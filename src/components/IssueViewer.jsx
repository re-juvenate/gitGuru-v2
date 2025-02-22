import DynamicViewer from "./DynamicViewer";

export default function IssueViewer() {
    return (
        <DynamicViewer
            apiEndpoint=""
            tabs={{
                summary: "Summary",
                possible_fixes: "Possible Fixes"
            }}
        />
    );
}
