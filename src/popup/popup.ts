import { GITHUB_OAUTH_URL } from '@/constants';
import { attachListener, getFromStorage, removeFromStorage } from '@/utils';
import { UserSettings } from '@/types';

// Wait for the popup DOM toload
document.addEventListener('DOMContentLoaded', () => {
  const signin = document.getElementById('github-signin'); // Use id for the button
  const deleteAuth = document.getElementById('delete-auth')!;
  const problemDetails = document.getElementsByClassName('problem-details')[0]! as HTMLElement;
  const problemName = document.getElementById('problem-name')!;
  const problemDifficulty = document.getElementById('problem-difficulty')!;
  const selectedRepoClass = document.getElementsByClassName('selected-repo')[0]! as HTMLElement;
  const selectedRepo = document.getElementById('selected-repo')!;
  const selectRepoButton = document.getElementById('select-repo-button')!;

  getFromStorage<UserSettings>('algoArchive', (result) => {
    if (result?.githubAccessToken) {
      console.log('Authorization code (Popup):', result.githubAccessToken);

      // Update the UI to show that the user is signed in
      updateUIForSignedInState(result);
    } else {
      console.log('Authorization code not found in storage');
      if (signin)
        attachListener(signin, 'click', () => {
          // Open a new tab to start the OAuth flow
          chrome.tabs.create({ url: GITHUB_OAUTH_URL });
        });
    }
  });

  const setInfo = (message: any) => {
    if (message) problemDetails.style.display = 'block';
    else problemDetails.style.display = 'none';

    problemName.textContent = message?.problemTitle || 'Not found';
    problemDifficulty.textContent = message?.problemDifficulty || 'Not found';
  };

  // send a message to the content script to get the problem data
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url && tabs[0].url.startsWith('https://leetcode.com/problems/')) {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { from: 'popup', subject: 'problemData' },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log('Error:', chrome.runtime.lastError.message);
            setInfo(null);
          } else if (response) {
            setInfo(response);
          } else {
            setInfo(null);
          }
        },
      );
    } else {
      setInfo(null);
      console.log('Not on a LeetCode problem page');
    }
  });

  // Add event listener to delete authorization code
  deleteAuth.addEventListener('click', () => {
    deleteAuthorizationCode();
    // hide the delete button
    deleteAuth.style.display = 'none';
    selectedRepoClass.style.display = 'none';
    selectRepoButton.style.display = 'none';
    // show the sign in button
    const signin = document.getElementById('github-signin');
    if (signin) {
      signin.style.display = 'block';
      attachListener(signin, 'click', () => {
        // Open a new tab to start the OAuth flow
        chrome.tabs.create({ url: GITHUB_OAUTH_URL });
      });
    }
  });

  // Add event listener to select a repository, redirect to the getting-started page
  selectRepoButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'getting-started.html' });
  });

  function deleteAuthorizationCode() {
    removeFromStorage('algoArchive', () => {
      console.log('Authorization code removed from storage');
    });
  }

  function updateUIForSignedInState(result?: UserSettings) {
    // Update your UI here
    const signin = document.getElementById('github-signin');
    // hide the sign in button
    if (signin) signin.style.display = 'none';

    // show the delete button
    const deleteAuth = document.getElementById('delete-auth');
    if (deleteAuth) deleteAuth.style.display = 'block';

    if (result?.selectedRepo) {
      selectRepoButton.style.display = 'none';
      selectedRepoClass.style.display = 'block';
      selectedRepo.textContent = result.selectedRepo;
    } else {
      selectRepoButton.style.display = 'block';
      selectedRepo.textContent = 'None';
    }
  }
});
