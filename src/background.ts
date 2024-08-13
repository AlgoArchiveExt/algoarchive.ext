function findLastLeetCodeTab(): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve) => {
    chrome.tabs.query({url: "https://leetcode.com/*"}, (tabs) => {
      if (tabs.length > 0) {
        // Sort tabs by lastAccessed time in descending order
        tabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
        if (tabs[0].id) resolve(tabs[0]);
        else resolve(null);
      } else {
        resolve(null);
      }
    });
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab updated:", tabId, changeInfo, tab);

  if (changeInfo.status === 'complete' && tab.url?.startsWith('https://example.com/')) {
    const url = new URL(tab.url);
    const code = url.searchParams.get('code');

    //? Note: github auth token never expires, until the user revokes it
    if (code) {
      console.log("Authorization code found:", code);
      // Find and focus the last LeetCode tab, or open a new one
      findLastLeetCodeTab().then((leetCodeTab) => {
        if (leetCodeTab?.id) {
          chrome.tabs.update(leetCodeTab.id, {active: true});
        } else {
          chrome.tabs.create({url: "https://leetcode.com/"});
        }
      });
      // Close the Example tab
      chrome.tabs.remove(tabId);

      // Store the code in chrome.storage instead of sending a message
      chrome.storage.local.set({githubAuthCode: code}, () => {
        console.log('Authorization code saved in storage');
      });
    }
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction?.show(sender?.tab?.id!);
  }
});