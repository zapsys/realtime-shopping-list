//src/utils/offlineQueue.ts

// Utility functions to manage a queue of offline actions using localStorage
type OfflineAction = {
  type: 'add' | 'update' | 'delete' | 'addItem' | 'deleteItem' | 'deleteList';
  payload: any;
};

const QUEUE_KEY = 'offlineActions';

export const addToQueue = (action: OfflineAction) => {
  const queue = getQueue();
  queue.push(action);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const getQueue = (): OfflineAction[] => {
  const raw = localStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const setQueue = (queue: OfflineAction[]) => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const clearQueue = () => {
  localStorage.removeItem(QUEUE_KEY);
};

export const getOfflineItemsForList = (listId: string): any[] => {
  const queue = getQueue();
  return queue
    .filter(action => action.type === 'addItem' && action.payload.listId === listId)
    .map(action => action.payload.item);
};