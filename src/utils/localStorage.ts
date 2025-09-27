// src/utils/localStorage.ts
import type { ShoppingList } from '../types';

const LISTS_KEY = 'shoppingLists';
const PENDING_CHANGES_KEY = 'pendingChanges';

// --- Gerenciamento de Listas ---
export const saveListsToLocal = (lists: ShoppingList[]): void => {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
};

export const loadListsFromLocal = (): ShoppingList[] | null => {
  const localData = localStorage.getItem(LISTS_KEY);
  return localData ? JSON.parse(localData) : null;
};

// --- Gerenciamento da Fila de Alterações Offline ---
export const saveChange = (change: any): void => {
  const changes = loadPendingChanges();
  changes.push(change);
  localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
};

export const loadPendingChanges = (): any[] => {
  const localChanges = localStorage.getItem(PENDING_CHANGES_KEY);
  return localChanges ? JSON.parse(localChanges) : [];
};

export const clearPendingChanges = (): void => {
  localStorage.removeItem(PENDING_CHANGES_KEY);
};