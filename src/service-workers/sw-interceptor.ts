import { UserSettings } from '@/types/storage';
import { getFromStorage } from '@/utils';
import { LeetCodeSubmission } from '@/types/leetcode';

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log('Request intercepted:', details);
    // get the payload from the request
    const payload = details.requestBody?.raw;
    // decode the payload
    const decodedPayload = payload ? new TextDecoder().decode(payload[0].bytes) : '';
    const submission = JSON.parse(decodedPayload) as LeetCodeSubmission;
    console.log('Request payload:', submission);
    getFromStorage<UserSettings>('algoArchive', (result) => {
      if (result?.githubAccessToken && result?.selectedRepo) {
        //TODO: send request to the algo archive api to save the submission
      }
    });
  },
  { urls: ['https://leetcode.com/problems/*/submit/*'] },
  ['requestBody'],
);
