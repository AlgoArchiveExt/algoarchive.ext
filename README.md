# AlgoArchive Extension

### Control Flow:
1. **Content Script Injection:** A content script is automatically injected into every webpage that meets [specified criteria](/public/manifest.json), allowing the script to interact with the page's content.

2. **Message to Background Worker:** After injection, the [content script](/src/scripts/content.ts) sends a message to the [background script](/src/background.ts) (aka service worker). The background script then activates a [page action](https://developer.chrome.com/docs/extensions/mv2/reference/pageAction), attaching it to the current tab.

3. **Page Action Popup Initialization:** When the user clicks on the page action icon, the popup is loaded. Upon initialization, the popup sends a request message back to the content script to retrieve the necessary information.

4. **Content Script Response:** The content script processes the request, gathers the required data, and sends a response back to the popup. The popup then displays the retrieved information to the user.