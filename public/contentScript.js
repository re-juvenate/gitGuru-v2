let sidebar = document.querySelector('div[data-testid="issue-viewer-metadata-container"]');

window.gitGuruAssets = {
    viteLogo: chrome.runtime.getURL("vite.svg"),
    reactLogo: chrome.runtime.getURL("react.svg")
};

if (sidebar) {
    let div = document.createElement("div");
    div.id = "git-guru-root"; // Unique ID for mounting React
    sidebar.insertBefore(div, sidebar.firstChild);

    // Inject the React app dynamically
    let script = document.createElement("script");
    script.src = chrome.runtime.getURL("index.js"); // Load the bundled React app
    script.type = "module";
    document.body.appendChild(script);
}
