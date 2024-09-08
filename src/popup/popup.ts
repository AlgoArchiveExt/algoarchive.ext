import { GITHUB_OAUTH_PATH, GITHUB_BASE_URL } from '@/constants';
import { attachListener, getFromStorage, removeFromStorage } from '@/utils';
import { UserSettings } from '@/types';

// Wait for the popup DOM toload
document.addEventListener('DOMContentLoaded', () => {
  const signin = document.getElementById('github-signin'); // Use id for the button
  const deleteAuth = document.getElementById('delete-auth')!;
  const currentUser = document.getElementById('current-user')!;
  const problemDetails = document.getElementsByClassName('problem-details')[0]! as HTMLElement;
  const problemName = document.getElementById('problem-name')!;
  const problemDifficulty = document.getElementById('problem-difficulty')!;
  const selectedRepo = document.getElementById('selected-repo')!;
  const changeRepoButton = document.getElementById('change-repo-button')! as HTMLButtonElement;

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
          chrome.tabs.create({ url: GITHUB_BASE_URL + '/' + GITHUB_OAUTH_PATH });
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
    currentUser.textContent = 'N/A';
    // selectedRepoClass.style.display = 'none';
    selectedRepo.textContent = 'N/A';
    changeRepoButton.textContent = 'Select a repository';
    changeRepoButton.disabled = true;
    // show the sign in button
    const signin = document.getElementById('github-signin');
    if (signin) {
      signin.style.display = 'block';
      attachListener(signin, 'click', () => {
        // Open a new tab to start the OAuth flow
        chrome.tabs.create({ url: GITHUB_BASE_URL + '/' + GITHUB_OAUTH_PATH });
      });
    }
  });

  // Add event listener to select a repository, redirect to the getting-started page
  changeRepoButton.addEventListener('click', () => {
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

    currentUser.textContent = result?.currentUser || 'N/A';

    if (result?.selectedRepoFullName || result?.selectedRepo) {
      changeRepoButton.textContent = 'Change repository';
      changeRepoButton.disabled = false;
      // selectedRepoClass.style.display = 'block';
      // selectedRepoClass.style.cursor = 'pointer';
      // selectedRepoClass.addEventListener('click', () => {
      //   chrome.tabs.create({ url: 'getting-started.html' });
      // });
      selectedRepo.textContent = result.selectedRepoFullName || result.selectedRepo || 'N/A';
    } else {
      changeRepoButton.textContent = 'Select a repository';
      changeRepoButton.disabled = false;
      selectedRepo.textContent = 'N/A';
    }
  }
});
