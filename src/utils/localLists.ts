export const LOCAL_LISTS_KEY = 'localShoppingLists';

export const saveListsToLocal = (lists: any[]) => {
  localStorage.setItem(LOCAL_LISTS_KEY, JSON.stringify(lists));
};

export const getListsFromLocal = (): any[] => {
  const raw = localStorage.getItem(LOCAL_LISTS_KEY);
  return raw ? JSON.parse(raw) : [];
};