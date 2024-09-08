import { API_BASE_URL, CACHE_DURATION_MS } from '@/constants';
import { ApiClient, getFromStorage, setInStorage } from '@/utils';
import { UserSettings } from '@/types';
import { AllSolutionsCount, AllSolutionsCountByDifficulty } from '@/types/algoarchive';

async function sendAsyncronously(sendResponse: (response: any) => void) {
  try {
    // Perform your async operations
    await Promise.all([fetchSolutionsCount(), fetchSolutionsCountByDifficulty()]);

    // Send the results back
    sendResponse({ success: true });
  } catch (error) {
    // Handle errors and send error response
    sendResponse({ success: false, error });
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('Message received:', message, sender);
  if (message.subject === 'all-count') {
    sendAsyncronously(sendResponse);
    return true;
  }
});

async function fetchSolutionsCount() {
  const apiClient = new ApiClient({ baseUrl: API_BASE_URL });
  const now = new Date().getTime();

  return new Promise<void>(async (resolve, reject) => {
    getFromStorage<UserSettings>('algoArchive', async (result) => {
      if (result && result.githubAccessToken) {
        if (
          result.stats?.selectedRepoFullName === result.selectedRepoFullName &&
          result.stats?.lastFetchTime &&
          now - result.stats.lastFetchTime < CACHE_DURATION_MS &&
          !isNaN(result.stats?.total)
        ) {
          console.log('Using cached data:', result);
          resolve();
          return result;
        }
      }

      if (result?.githubAccessToken && result.selectedRepoFullName) {
        // Fetch the data
        console.log('Fetching COUNT from API...');
        const response = await apiClient.get<AllSolutionsCount>(
          `v1/solutions/${result?.selectedRepoFullName}/count`,
          {
            headers: {
              Authorization: `Bearer ${result.githubAccessToken}`,
            },
          },
        );

        // Store the data in storage
        getFromStorage<UserSettings>('algoArchive', (result2) => {
          setInStorage('algoArchive', {
            ...result2,
            stats: {
              ...result2?.stats,
              total: response.solutions_count,
              lastFetchTime: now,
              selectedRepoFullName: result2?.selectedRepoFullName,
            },
          });
        });
      }

      resolve();
    });
  });
}

async function fetchSolutionsCountByDifficulty() {
  try {
    const apiClient = new ApiClient({ baseUrl: API_BASE_URL });
    const now = new Date().getTime();
    return new Promise<void>(async (resolve, reject) => {
      getFromStorage<UserSettings>('algoArchive', async (result) => {
        if (result && result.githubAccessToken) {
          if (
            result.stats?.selectedRepoFullName === result.selectedRepoFullName &&
            result.stats?.lastFetchTime &&
            now - result.stats.lastFetchTime < CACHE_DURATION_MS &&
            !isNaN(result.stats?.easy) &&
            !isNaN(result.stats?.medium) &&
            !isNaN(result.stats?.hard)
          ) {
            console.log('Using cached data:', result);
            resolve();
            return result;
          }
        }

        if (result?.githubAccessToken && result.selectedRepoFullName) {
          // Fetch the data
          console.log('Fetching ALL DIFFICULTIES from API...');
          const response = await apiClient.get<AllSolutionsCountByDifficulty>(
            `v1/solutions/${result?.selectedRepoFullName}/all-count-by-difficulty`,
            {
              headers: {
                Authorization: `Bearer ${result.githubAccessToken}`,
              },
            },
          );

          console.log('Done fetching all difficulties:', response);

          // Store the data in storage
          getFromStorage<UserSettings>('algoArchive', (result2) => {
            setInStorage('algoArchive', {
              ...result2,
              stats: {
                ...result2?.stats,
                ...response.difficulties,
                lastFetchTime: now,
                selectedRepoFullName: result2?.selectedRepoFullName,
              },
            });
          });
        }

        resolve();
      });
    });
  } catch (error) {
    console.error('Error fetching or caching problems solved data:', error);
  }
}
