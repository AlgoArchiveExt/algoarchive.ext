/**
 * Gets an item from Chrome storage with a callback.
 * @param key - The key of the item to retrieve.
 * @param callback - A callback function to handle the retrieved data.
 */
export function getFromStorage<T>(key: string, callback: (data: T | undefined) => void): void {
  chrome.storage.local.get([key], (result) => {
    callback(result[key]);
  });
}

/**
 * Sets an item in Chrome storage with a callback.
 * @param key - The key of the item to set.
 * @param value - The value to store.
 * @param callback - A callback function to handle completion.
 */
export function setInStorage<T>(key: string, value: T, callback?: () => void): void {
  const data = { [key]: value } as { [key: string]: T };
  chrome.storage.local.set(data, () => {
    if (callback) {
      callback();
    }
  });
}

/**
 * Removes an item from Chrome storage with a callback.
 * @param key - The key of the item to remove.
 * @param callback - A callback function to handle completion.
 */
export function removeFromStorage(key: string, callback: () => void): void {
  chrome.storage.local.remove([key], () => {
    callback();
  });
}