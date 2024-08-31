chrome.runtime.onMessage.addListener((msg, sender) => {
  console.log('Message received:', msg, sender);
  // First, validate the message's structure.
  if (msg.from === 'content' && msg.subject === 'showPageAction') {
    // Enable the page-action for the requesting tab.
    chrome.pageAction?.show(sender?.tab?.id!);
  }
});
