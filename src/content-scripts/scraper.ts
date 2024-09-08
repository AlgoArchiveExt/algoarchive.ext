import { Problem } from '@/types/leetcode';
import { getFromStorage, sanitize, setInStorage } from '@/utils';

// Inform the service worker that this tab should have a page-action.
chrome.runtime.sendMessage(
  {
    from: 'content',
    subject: 'showPageAction',
  },
  (response) => {
    if (chrome.runtime.lastError) {
      console.log('Error sending showPageAction message:', chrome.runtime.lastError.message);
    } else if (response) {
      console.log('showPageAction message sent successfully');
    }
  },
);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('(Content Script) Message received:', message);

  if (
    (message.from === 'popup' || message.from === 'service-worker') &&
    message.subject === 'problemData'
  ) {
    try {
      const problemDifficulty =
        document.querySelector('div > div.flex.w-full > div.flex.gap-1 > div')?.textContent ||
        'Not found';
      const problemTitle = document.querySelector('head > title')?.textContent || 'Not found';

      const problemDescription = Array.from(document.querySelectorAll('div')).filter(
        (div: HTMLDivElement) => div.getAttribute('data-track-load') === 'description_content',
      )[0].innerHTML;

      const problemLink = window.location.href;
      // get problem id by regex, \/problems\/([^\/]+)\/(?:description\/)?
      const problemName = problemLink.match(/\/problems\/([^\/]+)\/(?:description\/)?/)?.[1] || '';
      const problemId = Array.from(document.querySelectorAll('a')).find((a: HTMLAnchorElement) =>
        a.href.includes('/problems/' + problemName + '/'),
      )?.textContent;

      const problem: Problem = {
        title: problemTitle,
        difficulty: problemDifficulty,
        description: problemDescription,
        link: problemLink,
        id: problemId || undefined,
      };

      // sanitize problem data
      const { title, difficulty, description, id } = sanitize(problem);

      if (title !== 'Not found') {
        // save current problem data to storage
        getFromStorage('algoArchive', (result) => {
          setInStorage('algoArchive', {
            ...(result || {}),
            currentProblem: {
              title,
              difficulty,
              description,
              link: problemLink,
              id: id,
            },
          });
        });
      }

      sendResponse({
        problemTitle: title,
        problemDifficulty: difficulty,
        problemDescription: description,
        problemLink,
        problemId: id,
      });
    } catch (error) {
      console.error('Error fetching problem data:', error);
      sendResponse({ error: 'Failed to fetch problem data' });
    }
  }

  // Return true to indicate that we will send a response asynchronously
  return true;
});

// Check if we're on a LeetCode problem page
if (
  window.location.hostname === 'leetcode.com' &&
  window.location.pathname.startsWith('/problems/')
) {
  console.log('LeetCode problem page detected');
} else {
  console.log('Not a LeetCode problem page');
}
