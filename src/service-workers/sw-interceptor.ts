import { API_BASE_URL } from '@/constants';
import { LeetCodeSubmission, UserSettings } from '@/types';
import { ApiClient, getFromStorage } from '@/utils';

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log('Request intercepted:', details);
    // request problem data from the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.startsWith('https://leetcode.com/problems/')) {
        chrome.tabs.sendMessage(
          tabs[0].id!,
          { from: 'service-worker', subject: 'problemData' },
          (response) => {
            const apiClient = new ApiClient({ baseUrl: API_BASE_URL });

            // get the payload from the request
            const payload = details.requestBody?.raw;
            // decode the payload
            const decodedPayload = payload ? new TextDecoder().decode(payload[0].bytes) : '';
            const submission = JSON.parse(decodedPayload) as LeetCodeSubmission;
            console.log('Request payload:', submission);
            getFromStorage<UserSettings>('algoArchive', async (result) => {
              if (result?.githubAccessToken && result?.selectedRepo) {
                try {
                  await apiClient.post(`v1/solutions/commits`, {
                    user_access_token: result.githubAccessToken,
                    user: {
                      owner: result.owner,
                      repo_name: result.selectedRepo,
                    },
                    solution: {
                      problem_name: response?.problemTitle || result?.currentProblem?.title,
                      description:
                        response?.problemDescription || result?.currentProblem?.description,
                      code: submission.typed_code,
                      language: submission.lang,
                      difficulty: response?.problemDifficulty || result?.currentProblem?.difficulty,
                    },
                  });

                  chrome.tabs.sendMessage(tabs[0].id!, {
                    from: 'service-worker',
                    subject: 'all-count',
                  });

                  console.log('Solution sent to server successfully');
                } catch (error) {
                  console.error('Failed to send solution to server:', error);
                }
              }
            });
          },
        );
      }
    });
  },
  { urls: ['https://leetcode.com/problems/*/submit/*'] },
  ['requestBody'],
);
