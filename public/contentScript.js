let sidebar = document.querySelector('div[data-testid="issue-viewer-metadata-container"]');

if (sidebar) {
    let div = document.createElement("div");
    div.id = "git-guru-root";
    sidebar.insertBefore(div, sidebar.firstChild);

    let script = document.createElement("script");
    script.src = chrome.runtime.getURL("index.js");
    script.type = "module";
    document.body.appendChild(script);
}
