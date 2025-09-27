// src/ShoppingApp.tsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, doc, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { ShoppingList } from './types';
import { loadListsFromLocal, saveListsToLocal, loadPendingChanges, saveChange, clearPendingChanges } from './utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

import ListManager from './components/ListManager';
import ShoppingListComponent from './components/ShoppingListComponent';
import ArchivedListsView from './components/ArchivedListsView';
import ConnectionStatusBadge from './components/ConnectionStatusBadge';
import Toast from './components/Toast';
import Header from './components/Header';
import { useAuth } from './auth/AuthContext';

const ShoppingApp: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lists, setLists] = useState<ShoppingList[]>(() => loadListsFromLocal() || []);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const syncOfflineChanges = async () => {
      const changes = loadPendingChanges();
      if (changes.length === 0 || !currentUser) return;
      
      console.log(`Sincronizando ${changes.length} alterações offline...`);
      const batch = writeBatch(db);
      changes.forEach(change => {
        const docRef = doc(db, 'shoppingLists', change.payload.id);
        if (change.type === 'DELETE_LIST') {
          batch.delete(docRef);
        } else {
          const payload = change.type === 'CREATE_LIST' 
            ? { ...change.payload, userId: currentUser.uid, createdAt: serverTimestamp() } 
            : { ...change.payload, userId: currentUser.uid };
          batch.set(docRef, payload);
        }
      });
      try {
        await batch.commit();
        clearPendingChanges();
        showToast('Dados sincronizados!', 'success');
      } catch (error) {
        console.error("Falha ao sincronizar alterações offline: ", error);
        showToast('Falha na sincronização!', 'error');
      }
    };

    if (isOnline) {
      syncOfflineChanges();
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, currentUser]);

  useEffect(() => {
    if (!isOnline) {
      setIsLoading(false);
      return;
    }
    if (!currentUser) {
      setLists([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'shoppingLists'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const serverLists: ShoppingList[] = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as ShoppingList);
      setLists(serverLists);
      saveListsToLocal(serverLists);
      if (!activeListId && serverLists.length > 0) {
        setActiveListId(serverLists.find(l => !l.archived)?.id || null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Erro no listener do Firebase:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [isOnline, currentUser, activeListId]);

  const handleListUpdate = (updatedList: ShoppingList) => {
    const isArchiving = updatedList.archived && updatedList.id === activeListId;
    setLists(currentLists => {
      const newLists = currentLists.map(l => l.id === updatedList.id ? updatedList : l);
      saveListsToLocal(newLists);
      if (isArchiving) {
        const nextActiveList = newLists.find(l => !l.archived);
        setActiveListId(nextActiveList ? nextActiveList.id : null);
      }
      return newLists;
    });

    if (isOnline) {
      setDoc(doc(db, "shoppingLists", updatedList.id), updatedList, { merge: true }).catch(e => console.error(e));
    } else {
      saveChange({ type: 'UPDATE_LIST', payload: updatedList });
    }
  };

  const handleCreateList = (name: string) => {
    if (!currentUser) return;
    const newList: any = {
      id: uuidv4(),
      userId: currentUser.uid,
      name,
      createdAt: new Date(),
      archived: false,
      items: []
    };
    setLists(currentLists => {
      const newLists = [newList, ...currentLists];
      saveListsToLocal(newLists);
      return newLists;
    });
    setActiveListId(newList.id);

    if (isOnline) {
      const listWithTimestamp = { ...newList, createdAt: serverTimestamp() };
      setDoc(doc(db, "shoppingLists", newList.id), listWithTimestamp).catch(e => console.error(e));
    } else {
      saveChange({ type: 'CREATE_LIST', payload: newList });
      showToast('Lista criada localmente!', 'success');
    }
  };

  const handleDeleteList = (listId: string) => {
    setLists(currentLists => {
      const newLists = currentLists.filter(l => l.id !== listId);
      saveListsToLocal(newLists);
      if (activeListId === listId) {
        setActiveListId(newLists.find(l => !l.archived)?.id || null);
      }
      return newLists;
    });
    
    if (isOnline) {
      writeBatch(db).delete(doc(db, "shoppingLists", listId)).commit().catch(e => console.error(e));
    } else {
      saveChange({ type: 'DELETE_LIST', payload: { id: listId } });
      showToast('Lista excluída localmente!', 'success');
    }
  };

  const activeList = lists.find(list => list.id === activeListId);
  const activeLists = lists.filter(list => !list.archived);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <ConnectionStatusBadge />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          {isLoading ? <p>Carregando...</p> : (
            <ListManager
              lists={activeLists}
              activeListId={activeListId}
              onSelectList={setActiveListId}
              onShowArchived={() => setShowArchived(true)}
              onCreateList={handleCreateList}
            />
          )}
        </aside>
        <section className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          {showArchived ? (
            <ArchivedListsView
              onBack={() => setShowArchived(false)}
              lists={lists.filter(l => l.archived)}
              onListUpdate={handleListUpdate}
            />
          ) : (
            <>
              {activeList ? (
                <ShoppingListComponent
                  list={activeList}
                  onListUpdate={handleListUpdate}
                  onListDelete={handleDeleteList}
                  isOnline={isOnline}
                  showToast={showToast}
                />
              ) : (
                !isLoading && <p className="text-center text-gray-500 pt-10">Crie uma nova lista ou selecione uma para começar!</p>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};
export default ShoppingApp;