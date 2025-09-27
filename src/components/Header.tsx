// src/components/Header.tsx
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(getAuth());
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold">🛒 Lista de Compras</h1>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3 hover:bg-blue-700 p-2 rounded-md">
              <img
                src={currentUser?.photoURL || 'https://avatar.iran.liara.run/public'}
                alt="Foto do perfil"
                className="h-10 w-10 rounded-full"
              />
              <span className="font-medium">{currentUser?.displayName || currentUser?.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md"
            >
              Sair
            </button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-blue-700">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown do Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">
            Meu Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-md"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;