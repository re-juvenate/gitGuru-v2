# GitGuru V2 Frontend

One stop solution to your github issues and PRs

## Features

- Automatic detection of the active web page to determine if it is a GitHub issue page.
- Injection of the extension UI into the GitHub issue page.
- Default fetch request to the backend API to retrieve the summary of the issue conversation.
- Explanation tab: Provides an explanation of the entire issue.
- Solution tab: Offers possible solutions to the issue.

## Workflow

1. **Repository Analysis**:
    - Fetch repository data from GitHub.
    - Analyze the structure, README, languages, and documentation.
    - Generate a summary of the repository.

2. **Issue Summarization**:
    - Fetch issue data and comments from GitHub.
    - Summarize the issue and its comments.

3. **Chat Interactions**:
    - Provide chat-based interactions for various tasks.
    - Use language models to generate responses.

4. **Instructions and Fixes**:
    - Generate instructions and fixes based on repository data and conversations.


### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/re-juvenate/gitguru-v2.git
    cd gitguru-v2
    ```

2. Install dependencies:

    ```sh
    npm i
    ```

3. Build the application:

    ```sh
    npm run build
    ```
4. Load the extension in your browser:
   
  - Chrome: Open the Extensions page (chrome://extensions), enable Developer mode, click on "Load unpacked", and select the GitGuru Fronend folder.
  - Firefox: Open the Add-ons Manager (about:addons), click on the gear icon, select "Debug Add-ons", click on "Load Temporary Add-on", and select the manifest.json file.
  - The extension should now be loaded. Visit any GitHub issue to see it in action.


## License

This project is licensed under the [MIT License](LICENSE).

