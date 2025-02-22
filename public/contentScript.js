function mountGitGuruRoot() {
    let issueSidebar = document.querySelector('div[data-testid="issue-viewer-metadata-container"]');
    let prSidebar = document.querySelector('.Layout-sidebar');
    let repoSidebar = document.querySelector('.BorderGrid');

    let sidebar;
    if (window.location.pathname.includes('/pull/')) {
        sidebar = prSidebar;
    } else if (window.location.pathname.includes('/issues/')) {
        sidebar = issueSidebar;
    } else {
        sidebar = repoSidebar;
    }

    if (sidebar) {
        console.log("GitGuru: Sidebar found!", sidebar);

        let div = document.createElement("div");
        div.id = "git-guru-root";
        sidebar.insertBefore(div, sidebar.firstChild);

        let script = document.createElement("script");
        script.src = chrome.runtime.getURL("index.js");
        script.type = "module";
        document.body.appendChild(script);
    } else {
        console.log("GitGuru: No valid sidebar found.");
    }
}

mountGitGuruRoot();
