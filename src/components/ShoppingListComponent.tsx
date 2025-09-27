// src/components/ShoppingListComponent.tsx
import React, { useState, useEffect } from 'react';
import type { ShoppingList, ShoppingListItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from '../utils/formatDate';

interface Props {
  list: ShoppingList;
  onListUpdate: (updatedList: ShoppingList) => void;
  onListDelete: (listId: string) => void;
  isOnline: boolean;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ShoppingListComponent: React.FC<Props> = ({ list, onListUpdate, onListDelete, isOnline, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(list.name);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setEditingName(list.name);
  }, [list.name]);

  const handleToggleShare = () => {
    if (list.isPublic) {
      if (window.confirm('Você tem certeza que quer tornar esta lista privada? O link de compartilhamento deixará de funcionar.')) {
        onListUpdate({ ...list, isPublic: false });
        showToast('A lista agora é privada!', 'success');
      }
    } else {
      onListUpdate({ ...list, isPublic: true });
      showToast('A lista agora é pública! Copie o link para compartilhar.', 'success');
    }
  };

  const handleShareToWhatsApp = () => {
    // 1. Verifica se a lista é pública antes de compartilhar
    if (!list.isPublic) {
      showToast('Torne a lista pública antes de compartilhar no WhatsApp!', 'error');
      return;
    }

    // 2. Monta a mensagem simples com o nome da lista e o link
    const publicLink = `${window.location.origin}/list/${list.id}`;
    const message = `Confira minha lista de compras "${list.name}":\n${publicLink}`;

    // 3. Codifica a mensagem e abre o WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyPublicLink = () => {
    const link = `${window.location.origin}/list/${list.id}`;
    navigator.clipboard.writeText(link);
    showToast('Link copiado para a área de transferência!', 'success');
  };

  const handleSaveName = () => {
    if (editingName.trim() && editingName.trim() !== list.name) {
      onListUpdate({ ...list, name: editingName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveName();
    else if (e.key === 'Escape') {
      setEditingName(list.name);
      setIsEditing(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItemNameTrimmed = newItemName.trim();
    if (newItemNameTrimmed === '') return;

    const isDuplicate = (list.items || []).some(
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
      price: parseFloat(newItemPrice) || 0,
      completed: false
    };

    onListUpdate({ ...list, items: [...(list.items || []), newItem] });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQuantity('1');

    if (!isOnline) {
      showToast('Item salvo localmente!', 'success');
    }
  };

  const handleUpdateItem = (updatedItem: ShoppingListItem) => {
    const newItems = (list.items || []).map(item => item.id === updatedItem.id ? updatedItem : item);
    onListUpdate({ ...list, items: newItems });
  };

  const handleDeleteItem = (itemId: string) => {
    const newItems = (list.items || []).filter(item => item.id !== itemId);
    onListUpdate({ ...list, items: newItems });
    showToast('Item excluído!', 'success');
  };

  const filteredItems = (list.items || [])
    .filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

  const calculateTotal = () => {
    return (list.items || []).reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div>
      {/* --- Início da Alteração no Cabeçalho --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 border-b pb-4">
        {/* Container para o nome e a data, que também se ajusta */}
        <div className="flex flex-col jus w-full">
          {/* Linha 1 (Mobile): Nome da Lista */}
          <div className="flex-grow min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleSaveName}
                // onKeyDown={handleKeyDown}
                className="text-lg sm:text-xl font-semibold p-1 border rounded-md w-full"
                autoFocus
              />
            ) : (
              <div
                className="flex items-center justify-center gap-2 cursor-pointer group p-1 -ml-1 rounded-md"
                onClick={() => setIsEditing(true)}
              >
                <h2 className="text-lg sm:text-xl font-semibold truncate">{list.name}</h2>
                <span className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">✏️</span>
              </div>
            )}
          </div>
          {/* Linha 3 (Mobile): Data da Lista */}
          <div className='flex items-center justify-center'>
            <span className="text-xs sm:text-sm text-gray-500 ml-1 mt-1 sm:hidden">
              {formatDate(list.createdAt)}
            </span>
          </div>
        </div>

        {/* Linha 2 (Mobile): Botões */}
        <div className="flex gap-2 flex-shrink-0 self-center sm:self-center">
          <button
            onClick={handleShareToWhatsApp}
            className={`p-2 rounded-md transition-colors ${list.isPublic ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            title={list.isPublic ? 'Compartilhar no WhatsApp' : 'Torne a lista pública para compartilhar'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.847 6.062l-1.011 3.712 3.717-1.005zm11.319-4.705c-.272-.136-1.605-.79-1.855-.878-.25-.088-.431-.136-.612.136-.181.272-.699.878-.856 1.054-.158.176-.317.198-.599.062c-.282-.136-1.195-.442-2.278-1.406-1.082-.963-1.815-2.16-2.112-2.535-.298-.375-.015-.574.121-.71c.137-.136.272-.25.409-.426.136-.176.181-.297.272-.488.09-.191.045-.36-.045-.488-.09-.136-.612-1.46-1.011-2.025-.398-.564-.8-.488-1.1-.488h-.121c-.244 0-.612.062-1 .316-.388.25-.972.934-.972 2.276s1 2.64 1.144 2.816c.144.176 1.994 3.033 4.832 4.272.712.316 1.246.474 1.705.574.837.176 1.343.157 1.815-.088.513-.25 1.448-.995 1.642-1.324.195-.33.195-.612.137-.688-.059-.076-.244-.136-.514-.272z" />
            </svg>
          </button>
          <button
            onClick={handleToggleShare}
            className={`px-2 py-1 rounded-md text-xs sm:px-3 sm:text-sm transition-colors font-semibold ${list.isPublic
              ? 'bg-orange-100 hover:bg-orange-200 text-orange-800'
              : 'bg-blue-400 hover:bg-blue-500 text-white'
              }`}
          >
            {list.isPublic ? 'Tornar Privada' : 'Compartilhar'}
          </button>
          <button onClick={() => onListUpdate({ ...list, archived: true })} className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs sm:px-3 sm:text-sm hover:bg-yellow-600">Arquivar</button>
          <button onClick={() => { if (window.confirm(`Você tem certeza que quer excluir permanentemente "${list.name}"?`)) { onListDelete(list.id) } }} className="bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:px-3 sm:text-sm hover:bg-red-600">Excluir</button>
        </div>
      </div>
      {/* --- Fim da Alteração no Cabeçalho --- */}

      {list.isPublic && (
        <div className="bg-blue-50 p-3 rounded-md mb-4 flex items-center justify-between gap-2">
          <p className="text-sm text-blue-800 truncate">
            <span className="font-bold">Link público:</span> {`${window.location.origin}/list/${list.id}`}
          </p>
          <button onClick={copyPublicLink} className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm">
            Copiar
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Buscar itens..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      {/* --- Início da Alteração no Formulário --- */}
      <form onSubmit={handleAddItem} className="flex flex-col gap-2 mb-4">
        {/* Linha 1: Nome e Quantidade */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Adicionar novo item"
            className="flex-grow p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            inputMode="numeric"
            value={newItemQuantity}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setNewItemQuantity(value);
            }}
            onBlur={(e) => {
              if (parseInt(e.target.value, 10) < 1 || e.target.value === '') {
                setNewItemQuantity('1');
              }
            }}
            placeholder="Qtde"
            className="w-20 p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Linha 2: Preço e Botão */}
        <div className="flex gap-2">
          <input
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            placeholder="R$ 0,00"
            step="0.01"
            min="0"
            className="flex-grow p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold">
            Adicionar
          </button>
        </div>
      </form>

      <ol className="space-y-3 list-decimal list-inside">
        {filteredItems.map(item => (
          <li
            key={item.id}
            className={`flex flex-wrap items-center justify-between gap-y-2 p-2 rounded-md ${item.completed ? 'bg-gray-100' : 'bg-white'}`}
          >
            <div className="flex items-center flex-grow min-w-0 mr-2">
              <input type="checkbox" checked={item.completed}
                onChange={() => handleUpdateItem({ ...item, completed: !item.completed })}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <input type="text" value={item.name}
                onChange={(e) => handleUpdateItem({ ...item, name: e.target.value })}
                className={`flex-grow mx-3 bg-transparent focus:outline-none ${item.completed ? 'line-through text-gray-400' : ''}`}
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full justify-end sm:w-auto">
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
                className={`w-16 p-1 rounded-md border text-center bg-transparent ${item.completed ? 'line-through text-gray-400' : ''}`}
              />
              <span className="mx-1 text-gray-400">x</span>
              <input
                type="number"
                value={item.price || ''}
                onChange={(e) => handleUpdateItem({ ...item, price: parseFloat(e.target.value) || 0 })}
                placeholder="R$ 0,00"
                step="0.01"
                min="0"
                className={`w-24 p-1 rounded-md border text-right bg-transparent ${item.completed ? 'line-through text-gray-400' : ''}`}
              />
              <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-500 text-lg ml-2">🗑️</button>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 pt-4 border-t-2 border-dashed">
        <div className="flex justify-end items-center">
          <span className="text-lg font-semibold text-gray-600">Total:</span>
          <span className="text-xl font-bold text-gray-800 ml-4">
            {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ShoppingListComponent;