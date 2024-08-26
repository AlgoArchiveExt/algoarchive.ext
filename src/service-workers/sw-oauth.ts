import { GITHUB_ACCESS_TOKEN_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '@/constants';
import { findLastLeetCodeTab, setInStorage, ApiClient } from '@/utils';
import { AccessTokenResponse } from '@/types';

async function handleTabUpdate(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  console.log('Tab updated:', tabId, changeInfo, tab);

  const apiClient = new ApiClient({ baseUrl: GITHUB_ACCESS_TOKEN_URL });

  if (changeInfo.status === 'complete' && tab.url?.startsWith('https://example.com/')) {
    const url = new URL(tab.url);
    const code = url.searchParams.get('code');

    //? Note: github auth token never expires, until the user revokes it
    if (code) {
      console.log('Authorization code found:', code);
      const response = await apiClient.post<undefined, AccessTokenResponse>(
        `login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`,
        undefined,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const algoArchiveData = {
        githubAccessToken: response.access_token,
      };

      // Find and focus the last LeetCode tab, or open a new one
      findLastLeetCodeTab().then((leetCodeTab) => {
        if (leetCodeTab?.id) {
          chrome.tabs.update(leetCodeTab.id, { active: true });
        } else {
          chrome.tabs.create({ url: 'https://leetcode.com/problems/two-sum' });
        }
      });
      // Close the Example tab
      chrome.tabs.remove(tabId);

      // Store the code in chrome.storage instead of sending a message
      setInStorage('algoArchive', algoArchiveData, () => {
        console.log('Authorization code saved in storage');
      });
    }
  }
}

// Add a listener for tab updates
chrome.tabs.onUpdated.addListener(handleTabUpdate);

chrome.runtime.onMessage.addListener((msg, sender) => {
  console.log('Message received:', msg, sender);
  // First, validate the message's structure.
  if (msg.from === 'content' && msg.subject === 'showPageAction') {
    // Enable the page-action for the requesting tab.
    chrome.pageAction?.show(sender?.tab?.id!);
  }
});
