// src/components/ArchivedListsView.tsx
import React from 'react';
import type { ShoppingList } from '../types';
import { formatDate } from '../utils/formatDate';

interface Props {
  lists: ShoppingList[];
  onBack: () => void;
  onListUpdate: (updatedList: ShoppingList) => void;
}

const ArchivedListsView: React.FC<Props> = ({ lists, onBack, onListUpdate }) => {
  const handleRestore = (listToRestore: ShoppingList) => {
    onListUpdate({ ...listToRestore, archived: false });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-semibold">Listas Arquivadas</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          ← Voltar para Listas Ativas
        </button>
      </div>
      {lists.length > 0 ? (
        <ul className="space-y-3">
          {lists.map((list) => (
            <li
              key={list.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm"
            >
              <div>
                <span className="text-gray-700 font-medium">{list.name}</span>
                <p className="text-xs text-gray-500">{formatDate(list.createdAt)}</p>
              </div>
              <button
                onClick={() => handleRestore(list)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
              >
                Restaurar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-8">Nenhuma lista arquivada encontrada.</p>
      )}
    </div>
  );
};
export default ArchivedListsView;