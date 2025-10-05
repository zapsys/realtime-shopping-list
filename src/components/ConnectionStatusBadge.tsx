// src/components/ConnectionStatusBadge.tsx
import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

const ConnectionStatusBadge: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // --- Início da Correção ---
      
      // Variável para guardar a referência do listener
      let networkListenerHandle: PluginListenerHandle | null = null;

      const setupNativeListener = async () => {
        // addListener agora retorna uma Promise, então usamos await
        networkListenerHandle = await Network.addListener('networkStatusChange', (status) => {
          setIsOnline(status.connected);
        });
      };

      setupNativeListener();
      // --- Fim da Correção ---

      const checkNetworkStatus = async () => {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
      };
      checkNetworkStatus();

      return () => {
        // Remove o listener se ele foi registrado com sucesso
        if (networkListenerHandle) {
          networkListenerHandle.remove();
        }
      };

    } else {
      // Lógica para a web (PWA) permanece a mesma
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 flex items-center px-3 py-1 rounded-full text-white text-xs font-bold transition-all
        ${isOnline ? 'bg-green-500' : 'bg-gray-500'}
      `}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-300' : 'bg-gray-300'}`}></span>
      {isOnline ? 'Conectado' : 'Offline'}
    </div>
  );
};

export default ConnectionStatusBadge;