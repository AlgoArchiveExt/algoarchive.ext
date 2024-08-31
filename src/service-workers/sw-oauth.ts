import {
  GITHUB_BASE_URL,
  GITHUB_ACCESS_TOKEN_PATH,
  GITHUB_API_BASE_URL,
  GITHUB_INSTALLATIONS_PATH,
  GITHUB_APP_INSTALL_PATH,
} from '@/constants';
import { findLastLeetCodeTab, setInStorage, ApiClient } from '@/utils';
import { AccessTokenResponse, InstallationsResponse } from '@/types';

async function handleAuthCode(code: string, tabId: number) {
  const apiClient = new ApiClient({ baseUrl: GITHUB_BASE_URL });

  const response = await apiClient.post<undefined, AccessTokenResponse>(
    `${GITHUB_ACCESS_TOKEN_PATH}&code=${code}`,
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

  // Store the code in chrome.storage instead of sending a message
  setInStorage('algoArchive', algoArchiveData, () => {
    console.log('Authorization code saved in storage');
  });

  await checkInstallations(response.access_token, tabId);
}

async function checkInstallations(accessToken: string, tabId: number) {
  const apiClient = new ApiClient({ baseUrl: GITHUB_API_BASE_URL });
  try {
    const installations = await apiClient.get<InstallationsResponse>(GITHUB_INSTALLATIONS_PATH, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (installations.total_count === 0) {
      console.log('No installations found');
      chrome.tabs.update({ url: GITHUB_BASE_URL + '/' + GITHUB_APP_INSTALL_PATH });
    } else {
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
    }
  } catch (error) {
    console.error('Error fetching installations:', error);
  }
}

async function handleTabUpdate(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  console.log('Tab updated:', tabId, changeInfo, tab);

  if (changeInfo.status === 'complete' && tab.url?.startsWith('https://example.com/')) {
    const url = new URL(tab.url);
    const code = url.searchParams.get('code');

    //? Note: github auth token never expires, until the user revokes it
    if (code) {
      console.log('Authorization code found:', code);
      await handleAuthCode(code, tabId);
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
