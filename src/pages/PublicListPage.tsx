// src/pages/PublicListPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { ShoppingList, ShoppingListItem } from '../types';
import { formatDate } from '../utils/formatDate';
import { v4 as uuidv4 } from 'uuid';
import Toast from '../components/Toast';

const PublicListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [sessionAddedItemIds, setSessionAddedItemIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!listId) return;
    const docRef = doc(db, 'shoppingLists', listId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ShoppingList;
        if (data.isPublic) {
          setList({ ...data, id: docSnap.id });
        } else {
          setError('Esta lista não é pública.');
        }
      } else {
        setError('Lista não encontrada.');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [listId]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listId || newItemName.trim() === '') return;

    const newItemNameTrimmed = newItemName.trim();
    const isDuplicate = (list?.items || []).some(
      item => item.name.toLowerCase() === newItemNameTrimmed.toLowerCase()
    );

    if (isDuplicate) {
      showToast('Este item já está na lista!', 'error');
      return;
    }

    const newItem: ShoppingListItem = {
      id: uuidv4(),
      name: newItemNameTrimmed,
      quantity: parseInt(newItemQuantity, 10) || 1,
      completed: false,
    };
    
    try {
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        items: arrayUnion(newItem)
      });
      
      setSessionAddedItemIds(prevIds => [...prevIds, newItem.id]);
      setNewItemName('');
      setNewItemQuantity('1');
    } catch (err) {
      showToast('Erro ao adicionar o item.', 'error');
    }
  };

  const handleDeleteItem = async (itemToDelete: ShoppingListItem) => {
    if (!listId) return;
    try {
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        items: arrayRemove(itemToDelete)
      });
      showToast('Item removido!', 'success');
    } catch (err) {
      showToast('Erro ao remover o item.', 'error');
    }
  };

  const handleUpdateItem = async (updatedItem: ShoppingListItem) => {
    if (!listId || !list) return;

    const newItems = list.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );

    try {
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, { items: newItems });
    } catch (err) {
      showToast('Erro ao atualizar o item.', 'error');
    }
  };

  const sortedItems = (list?.items || []).sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  if (loading) return <div className="p-8 text-center">Carregando lista...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{list?.name}</h1>
          <p className="text-sm text-gray-500">Criada em: {formatDate(list?.createdAt)}</p>
        </div>
        
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2 mb-6 border-b pb-6">
            <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Novo item" className="flex-grow p-2 border rounded-md"/>
            <input type="text" inputMode="numeric" value={newItemQuantity} onChange={(e) => setNewItemQuantity(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Qtde" className="w-full sm:w-24 p-2 border rounded-md"/>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Adicionar</button>
        </form>

        <ol className="space-y-3 list-decimal list-inside">
          {sortedItems.map(item => (
            <li key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
              
              {sessionAddedItemIds.includes(item.id) ? (
                // --- Início da Alteração ---
                <div className="flex items-center flex-grow gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem({ ...item, name: e.target.value })}
                    className="flex-grow p-1 bg-transparent focus:outline-none focus:bg-gray-100 rounded"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.quantity || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleUpdateItem({ ...item, quantity: parseInt(value, 10) || 0 });
                    }}
                    onBlur={() => {
                      if (!item.quantity || item.quantity < 1) {
                        handleUpdateItem({ ...item, quantity: 1 });
                      }
                    }}
                    className="w-16 p-1 text-center bg-transparent focus:outline-none focus:bg-gray-100 rounded border"
                  />
                </div>
                // --- Fim da Alteração ---
              ) : (
                <span className={`${item.completed ? 'text-gray-500 line-through' : ''}`}>
                  {item.name} ({item.quantity})
                </span>
              )}

              {sessionAddedItemIds.includes(item.id) && (
                <button onClick={() => handleDeleteItem(item)} className="text-gray-400 hover:text-red-500 text-lg ml-4 flex-shrink-0">
                  🗑️
                </button>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-500 hover:underline">
                Criar sua própria lista
            </Link>
        </div>
      </div>
    </div>
  );
};
export default PublicListPage;