// src/components/ListManager.tsx
import React, { useState } from 'react';
import type { ShoppingList } from '../types';
import { formatDate } from '../utils/formatDate';

interface Props {
  lists: ShoppingList[];
  activeListId: string | null;
  onSelectList: (id: string) => void;
  onShowArchived: () => void;
  onCreateList: (name: string) => void;
}

const ListManager: React.FC<Props> = ({ lists, activeListId, onSelectList, onShowArchived, onCreateList }) => {
  const [newListName, setNewListName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Minhas Listas</h2>
        <form onSubmit={handleCreate} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nome da nova lista"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">+</button>
        </form>
        <ul className="space-y-2">
          {lists.map(list => (
            <li
              key={list.id}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                list.id === activeListId ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{list.name}</span>
                <span className={`text-xs ${list.id === activeListId ? 'text-blue-200' : 'text-gray-500'}`}>
                  {formatDate(list.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={onShowArchived}
          className="w-full text-center p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors font-medium"
        >
          Ver Arquivadas
        </button>
      </div>
    </div>
  );
};
export default ListManager;