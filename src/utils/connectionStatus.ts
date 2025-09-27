//src/utils/isOnline.ts

// Utility function to check online status and listen for connection changes
export const isOnline = () => navigator.onLine;
// Function to add event listeners for online and offline events
export const onConnectionChange = (callback: (online: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};