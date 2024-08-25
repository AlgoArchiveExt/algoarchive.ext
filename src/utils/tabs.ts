/**
 * Finds the last accessed LeetCode tab
 * @returns A promise that resolves to the last accessed LeetCode tab, or null if not found
 */
export async function findLastLeetCodeTab(): Promise<chrome.tabs.Tab | null> {
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
