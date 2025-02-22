function mountGitGuruRoot() {
    let issueSidebar = document.querySelector('div[data-testid="issue-viewer-metadata-container"]');
    let prSidebar = document.querySelector('.Layout-sidebar');
    let repoSidebar = document.querySelector('.repository-content .Layout-sidebar');

    let sidebar;
    if (window.location.pathname.includes('/pull/')) {
        sidebar = prSidebar;
    } else if (window.location.pathname.includes('/issues/')) {
        sidebar = issueSidebar;
    } else {
        sidebar = repoSidebar;
    }

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

mountGitGuruRoot();
