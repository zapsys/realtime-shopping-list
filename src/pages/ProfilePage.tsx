// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { updateProfile, deleteUser, unlink, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verifica se o provedor de login é o Google
  const isGoogleProvider = currentUser?.providerData[0]?.providerId === GoogleAuthProvider.PROVIDER_ID;

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (currentUser && displayName.trim() && displayName !== currentUser.displayName) {
      try {
        await updateProfile(currentUser, { displayName: displayName.trim() });
        setSuccess('Nome atualizado com sucesso!');
      } catch (err) {
        setError('Falha ao atualizar o nome.');
        console.error(err);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (currentUser && window.confirm('Você tem certeza que quer excluir sua conta permanentemente? Esta ação não pode ser desfeita.')) {
      try {
        await deleteUser(currentUser);
        navigate('/login');
      } catch (err) {
        setError('Falha ao excluir a conta. Pode ser necessário fazer login novamente para concluir esta ação.');
      }
    }
  };

  const handleUnlinkGoogle = async () => {
    if (currentUser && window.confirm('Isso desconectará sua conta Google. Você não poderá mais fazer login com o Google. Deseja continuar?')) {
      try {
        await unlink(currentUser, GoogleAuthProvider.PROVIDER_ID);
        // Após desvincular, o usuário é deslogado automaticamente.
        // A lógica no AuthContext irá redirecioná-lo para a página de login.
        setSuccess('Conta Google desvinculada com sucesso.');
      } catch (err) {
        setError('Falha ao desvincular a conta Google. Você deve ter outro método de login configurado.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Meu Perfil</h2>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{success}</p>}

        {/* Seção de Nome de Exibição (Comum a todos) */}
        <div className="mb-8 p-4 border rounded-md">
           <form onSubmit={handleNameChange}>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="display-name">
                Nome de Exibição
              </label>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors">
                Salvar Nome
              </button>
           </form>
        </div>

        {/* Seção Condicional: Ações de Segurança */}
        {isGoogleProvider ? (
          // --- Opções para Usuário do Google ---
          <div className="mt-8 pt-6 border-t border-yellow-400">
             <h3 className="text-lg font-semibold mb-2 text-yellow-800">Conta Vinculada</h3>
             <p className="text-sm text-gray-600 mb-4">Você está logado com sua conta Google. Para gerenciar sua senha, acesse as configurações da sua conta Google.</p>
             <button onClick={handleUnlinkGoogle} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full">
               Desvincular Conta Google
             </button>
          </div>
        ) : (
          // --- Opções para Usuário de E-mail/Senha ---
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Alterar Senha</h3>
              <p className="text-sm text-gray-600 mb-4">Para sua segurança, a redefinição de senha é feita através de um link enviado para o seu e-mail.</p>
              <button onClick={() => navigate('/reset-password')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full">
                Redefinir Senha por E-mail
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-red-300">
               <h3 className="text-lg font-semibold mb-2 text-red-700">Excluir Conta</h3>
               <p className="text-sm text-gray-600 mb-4">Esta ação é permanente e removerá todos os seus dados.</p>
               <button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded w-full">
                 Excluir Minha Conta
               </button>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-blue-500 hover:underline">
                Voltar para as Listas
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;