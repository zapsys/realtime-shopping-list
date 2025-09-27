// src/pages/PublicListPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore'; // getDoc pode ser removido se onSnapshot for usado
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
  const [newItemPrice, setNewItemPrice] = useState('');
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
    }, (err) => {
      setError('Erro ao buscar a lista.');
      console.error(err);
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

    const newItem: ShoppingListItem = {
      id: uuidv4(),
      name: newItemName.trim(),
      quantity: parseInt(newItemQuantity, 10) || 1,
      price: parseFloat(newItemPrice) || 0,
      completed: false,
    };
    
    try {
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        items: arrayUnion(newItem)
      });
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemPrice('');
    } catch (err) {
      showToast('Erro ao adicionar o item.', 'error');
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
            <input type="text" inputMode="numeric" value={newItemQuantity} onChange={(e) => setNewItemQuantity(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Qtde" className="w-full sm:w-20 p-2 border rounded-md"/>
            <input type="text" inputMode="decimal" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} placeholder="R$ 0,00" className="w-full sm:w-28 p-2 border rounded-md"/>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Adicionar</button>
        </form>

        <ol className="space-y-3 list-decimal list-inside">
          {sortedItems.map(item => (
            <li key={item.id} className={`p-2 rounded-md ${item.completed ? 'bg-gray-100 text-gray-500 line-through' : ''}`}>
              <span>{item.name}</span>
              <span className="ml-4 font-semibold">
                ({item.quantity}x { (item.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
              </span>
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