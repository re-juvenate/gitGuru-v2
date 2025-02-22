// contentScript.js
function mountGitGuruRoot() {
    // Try to find issue viewer sidebar
    let issueSidebar = document.querySelector('div[data-testid="issue-viewer-metadata-container"]');
    // Try to find PR sidebar
    let prSidebar = document.querySelector('.Layout-sidebar');
    
    // Get the appropriate sidebar based on the URL
    let sidebar = window.location.href.includes('/pull/') ? prSidebar : issueSidebar;

    if (sidebar) {
        let div = document.createElement("div");
        div.id = "git-guru-root";
        sidebar.insertBefore(div, sidebar.firstChild);
        let script = document.createElement("script");
        script.src = chrome.runtime.getURL("index.js");
        script.type = "module";
        document.body.appendChild(script);
    }
}

// Run when content script loads
mountGitGuruRoot();