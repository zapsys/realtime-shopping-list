// src/types.ts
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  completed: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: any;
  archived: boolean;
  items: ShoppingListItem[];
  isPublic?: boolean;
}