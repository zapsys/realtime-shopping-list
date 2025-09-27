// src/components/Toast.tsx
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    // Fecha o toast automaticamente após 3 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Limpa o timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-opacity duration-300";
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  );
};

export default Toast;