// Inform the background script that
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('(Content Script) Message received:', message);
  if (message.from === 'popup' && message.subject === 'problemData') {
    const problemDifficulty = document.querySelector("div > div.flex.w-full > div.flex.gap-1 > div")?.textContent;
    const problemTitle = document.querySelector("head > title")?.textContent;
    sendResponse({ problemTitle, problemDifficulty });
  }
});