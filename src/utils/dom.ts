// Every dom related utility functions should be here.

export const attachListener = (element: HTMLElement | null, event: string, callback: EventListener) => {
  if (element) {
    element.addEventListener(event, callback);
  }
};
