<div align="center">
  <img src="public/algo-archive.png" alt="AlgoArchive Logo" />
</div>

<h2> Table of Contents </h2>

- [Overview](#overview)
- [Control Flow](#control-flow)
- [Project Structure](#project-structure)
- [Development](#development)
- [Commit Message Guidelines \& Conventions](#commit-message-guidelines--conventions)
  - [File Naming Conventions](#file-naming-conventions)

### Overview
**AlgoArchive** is a Chrome extension that automatically grabs the leetcode or hackerrank problem and its solution from the web page and pushes it to github. The extension is designed to help users save and organize their submissions on GitHub, making it easier to track their progress and share their solutions with others.

### Control Flow
1. **Content Script Injection:** A content script is automatically injected into every webpage that meets [specified criteria](/public/manifest.json), allowing the script to interact with the page's content.

2. **Message to Background Worker:** After injection, the [content script](/src/scripts/content.ts) sends a message to the [background script](/src/background/background.ts) (aka service worker). The background script then activates a [page action](https://developer.chrome.com/docs/extensions/mv2/reference/pageAction), attaching it to the current tab.

3. **Page Action Popup Initialization:** When the user clicks on the page action icon, the popup is loaded. Upon initialization, the popup sends a request message back to the content script to retrieve the necessary information.

4. **Content Script Response:** The content script processes the request, gathers the required data, and sends a response back to the popup. The popup then displays the retrieved information to the user.


### Project Structure
```sh
src/
│
├── service-workers/
│   ├── sw-interceptor.ts           // Service worker for intercepting leetcode submissions
|   ├── sw-oauth.ts                 // Oauth service worker for github
│   └── service-worker.ts           // Entry point for the extension's background service worker, registers all service workers
│
├── content/
│   └── content.ts                  // Handles communication with the web page content
│
├── popup/
│   ├── popup.ts                    // Entry point for the extension's popup interface
│   ├── popup.html                  // HTML structure for the popup
│   └── popup.css                   // Styling for the popup
|
├── getting-started/
│   ├── getting-started.ts          // Logic for the 'Getting Started' page
│   ├── getting-started.html        // HTML structure for the 'Getting Started' page
│   └── getting-started.css         // Styling for the 'Getting Started' page
|
├── types/
|   ├── index.ts                    // Aggregate type definitions
│   ├── api-client.ts               // Type definitions for API client interactions
│   ├── leetcode.ts                 // Type definitions for LeetCode graphql API interactions
│   ├── storage.ts                  // Type definitions for storage objects
│   └── github.ts                   // Type definitions for GitHub API interactions
│
├── constants/
│   └── index.ts                    // Constants used throughout the extension
│
└── utils/
    ├── index.ts                    // Aggregate utility functions
    ├── api.ts                      // Utility functions for making API requests to AlgoArchive API
    ├── storage.ts                  // Utility functions for managing storage
    ├── dom.ts                      // Utility functions for DOM manipulation
    └── tabs.ts                     // Utility functions for tab management
```

### Development
1. **Setup:** 
    - Clone the repository: 
      ```bash
      git clone https://github.com/AlgoArchiveExt/algoarchive.ext.git
      cd algoarchive.ext
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
2. **Run development server:**
    ```bash
    npm run dev
    ```
3. **Load the extension in Chrome:**
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable `Developer mode` by toggling the switch in the top right corner
    - Click on `Load unpacked` and select the `dist` directory in the project folder
    - The extension should now be loaded and visible in the extensions toolbar
4. **Debugging:**
    - Open the Chrome DevTools by right-clicking on the extension icon and selecting `Inspect popup`
    - Use `console.log` statements to debug the extension's behavior
    - Estensions will be reloaded automatically when changes are made to the source code (thanks to webpack)
    - If you encounter any issues, refer to the [Chrome Extension documentation](https://developer.chrome.com/docs/extensions/mv2/getstarted/)

### Commit Message Guidelines & Conventions

To maintain consistency and clarity in our project’s commit history, please follow these guidelines for commit messages:

- **Type**: Specifies the type of commit being made. Common types include:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `style`: Code style updates (formatting, missing semicolons, etc.)
  - `refactor`: Code changes that neither fix a bug nor add a feature
  - `test`: Adding or modifying tests
  - `chore`: Other changes that do not modify src or test files (e.g., updates to build scripts)

- **Scope**: Indicates the area or module affected by the commit. For example:
  - `content`
  - `popup`
  - `service-worker`
  - `utils`
  
- **Subject**: A concise description of the changes introduced by the commit.

**Format:**

```sh
<type>(<scope>): <subject>
```

**Examples:**

- `feat(content): add message passing functionality`
- `fix(popup): resolve issue with button alignment`
- `docs(utils): update README with development instructions`
- `style(service-worker): format code using Prettier`
- `refactor(content): extract helper function for DOM manipulation`
- `test(utils): add unit tests for storage functions`
- `chore: update dependencies in package.json`
- `build: update webpack configuration for production build`
- `ci: add GitHub Actions workflow for linting`
- `perf: optimize storage retrieval in service worker`
- `revert: revert previous commit due to incorrect implementation`
- `merge: merge branch 'feature' into 'main'`
- `deploy: deploy to production server`

For more detailed information on commit message conventions, please refer to [Conventional Commits](https://www.conventionalcommits.org).

**Optional:** You may use emojis to visually represent commit types (e.g., 🚀 for `feat`, 🐛 for `fix`, 📚 for `docs`, etc.).

#### File Naming Conventions

- Use `kebab-case` for everything (e.g., `sw-cache.ts`, `welcome-popup.html`).