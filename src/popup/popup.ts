document.addEventListener('DOMContentLoaded', () => {
  const signin = document.getElementById('github-signin'); // Use id for the button
  const deleteAuth = document.getElementById('delete-auth');
  const githubOauthUrl = "https://github.com/login/oauth/authorize?client_id=Ov23liyoaQCz1BeILe7M&scope=repo";
  const attachListener = (element: HTMLElement | null, event: string, callback: EventListener) => {
    if (element) {
      element.addEventListener(event, callback);
    }
  }

  chrome.storage.local.get(['githubAuthCode'], function(result) {
    if (result.githubAuthCode) {
      console.log('Authorization code (content-script):', result.githubAuthCode);

      // Update the UI to show that the user is signed in
      updateUIForSignedInState(result.githubAuthCode);

    } else {
      if (signin)
        attachListener(signin, 'click', () => {
          // Open a new tab to start the OAuth flow
          chrome.tabs.create({url: githubOauthUrl});
        });
    }
  });

  const setInfo = (message: any) => {
    console.log('Problem data:', message);
    document.getElementById('problem-name')!.textContent = message?.problemTitle || 'Not found';
    document.getElementById('problem-difficulty')!.textContent = message?.problemDifficulty || 'Not found';
  }

  // send a message to the content script to get the problem data
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, {from: 'popup', subject: 'problemData'}, setInfo);
  });

  // Add event listener to delete authorization code
  if (deleteAuth)
    deleteAuth.addEventListener('click', () => {
      deleteAuthorizationCode();
      // hide the delete button
      deleteAuth.style.display = 'none';
      // show the sign in button
      const signin = document.getElementById('github-signin');
      if (signin) {
        signin.style.display = 'block';
        attachListener(signin, 'click', () => {
          // Open a new tab to start the OAuth flow
          chrome.tabs.create({url: githubOauthUrl});
        });
      }
    });


function deleteAuthorizationCode() {
  chrome.storage.local.remove(['githubAuthCode'], () => {
    console.log('Authorization code deleted from storage');
  });
}

function updateUIForSignedInState(code: string) {
  // Update your UI here
  const signin = document.getElementById('github-signin');
  // hide the sign in button
  if (signin)
    signin.style.display = 'none';

  // show the delete button
  const deleteAuth = document.getElementById('delete-auth');
  if (deleteAuth)
    deleteAuth.style.display = 'block';
}
});