// src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Sobre o Lista de Compras em Tempo Real</h1>
          <p className="mt-2 text-gray-600">Sua solução completa para listas de compras inteligentes.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">✨ Principais Funcionalidades</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Sincronização em Tempo Real:</strong> As alterações aparecem instantaneamente em todos os dispositivos.</li>
            <li><strong>Suporte Offline Completo:</strong> Crie e edite suas listas mesmo sem internet.</li>
            <li><strong>Autenticação Segura:</strong> Login com E-mail, Google e gerenciamento completo de perfil.</li>
            <li><strong>Listas Colaborativas:</strong> Compartilhe listas publicamente para que outros possam adicionar itens.</li>
            <li><strong>Cálculo de Custos:</strong> Adicione preço e quantidade para ver o total da sua compra.</li>
            <li><strong>Progressive Web App (PWA):</strong> Instale o app na tela inicial do seu dispositivo para acesso rápido.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">👤 Sobre o Autor</h2>
          <p className="text-gray-700">
            Este aplicativo foi desenvolvido por <strong>Aram Zap</strong>, um desenvolvedor apaixonado por criar soluções práticas e eficientes com as tecnologias mais modernas da web.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">🔗 Links Úteis</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://github.com/aramzap/realtime-shopping-list" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Repositório no GitHub
            </a>
            <a 
              href="https://github.com/aramzap/realtime-shopping-list/issues" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Reportar um Problema
            </a>
            <a 
              href="https://www.buymeacoffee.com/aramzap" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
            >
              Apoie o Projeto (Doação)
            </a>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/" className="text-sm text-blue-500 hover:underline">
            ← Voltar para as Listas
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;