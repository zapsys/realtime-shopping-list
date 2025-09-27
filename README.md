# 🛒 Lista de Compras em Tempo Real

[![React Badge](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase Badge](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Um aplicativo web completo de lista de compras construído com React, TypeScript e Firebase. O projeto oferece sincronização em tempo real, suporte completo offline e autenticação de usuários, sendo totalmente responsivo e instalável como um PWA.

---
## ✨ Funcionalidades

* **Autenticação de Usuários:** Cadastro e login com E-mail/Senha e conta Google.
* **Gerenciamento de Perfil:** Usuários podem alterar nome de exibição, avatar (foto), e-mail, senha e excluir a própria conta.
* **Listas Múltiplas:** Crie, edite, arquive e exclua múltiplas listas de compras.
* **Gerenciamento de Itens:** Adicione, edite (nome, quantidade, preço), marque como concluído e exclua itens de uma lista.
* **Sincronização em Tempo Real:** Alterações são refletidas instantaneamente em todos os dispositivos conectados, graças ao Firestore.
* **Suporte Offline Completo:** O aplicativo continua funcionando sem conexão com a internet. Todas as alterações são salvas localmente e sincronizadas automaticamente ao reconectar.
* **Cálculo de Total:** Soma automática dos valores dos itens (preço x quantidade).
* **Compartilhamento Público:** Usuários podem tornar suas listas públicas e compartilhar um link de apenas leitura.
* **Interface Responsiva:** O layout se adapta perfeitamente a smartphones, tablets e desktops.
* **PWA (Progressive Web App):** O aplicativo pode ser "instalado" na tela inicial de qualquer dispositivo para uma experiência nativa.
* **Notificações (Toast):** Alertas visuais para ações como adicionar itens, excluir, etc.

---
## 🚀 Tecnologias Utilizadas

* **Frontend:**
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/)
    * [React Router](https://reactrouter.com/)
* **Backend & Infraestrutura:**
    * **Firebase:**
        * [Authentication](https://firebase.google.com/docs/auth) para gerenciamento de usuários.
        * [Firestore](https://firebase.google.com/docs/firestore) como banco de dados NoSQL em tempo real.
        * [Storage](https://firebase.google.com/docs/storage) para armazenamento de avatares.
        * [Hosting](https://firebase.google.com/docs/hosting) para publicação do projeto.

---
## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* `npm` ou `yarn`

### Configuração do Firebase
1.  Vá para o **[Console do Firebase](https://console.firebase.google.com/)** e crie um novo projeto.
2.  **Authentication:** Habilite os provedores de login **E-mail/Senha** e **Google**.
3.  **Firestore Database:** Crie um novo banco de dados no modo de produção.
4.  **Storage:** Ative o Cloud Storage.
5.  **Regras de Segurança:** Copie o conteúdo dos arquivos `firestore.rules` e `storage.rules` deste projeto e cole nas respectivas abas de "Regras" do seu projeto no console.
6.  **Credenciais:** No painel do seu projeto, vá para **Configurações do Projeto** (ícone de engrenagem ⚙️), crie um novo "Aplicativo da Web" e copie o objeto `firebaseConfig`.

### Instalação Local
1.  Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/nome-do-repositorio.git](https://github.com/seu-usuario/nome-do-repositorio.git)
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd nome-do-repositorio
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Crie o arquivo de configuração do Firebase em `src/firebaseConfig.ts`:
    ```bash
    touch src/firebaseConfig.ts
    ```
5.  Abra o arquivo `src/firebaseConfig.ts` e cole suas credenciais copiadas do console do Firebase:
    ```typescript
    // src/firebaseConfig.ts
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    ```
6.  Execute o servidor de desenvolvimento:
    ```bash
    npm start
    ```
O aplicativo estará disponível em `http://localhost:3000`.

---
## 🌐 Publicação (Deploy)

O projeto está configurado para ser implantado facilmente com o Firebase Hosting.

1.  Instale o Firebase CLI globalmente (se ainda não o tiver):
    ```bash
    npm install -g firebase-tools
    ```
2.  Faça login e inicialize o Firebase no projeto (se ainda não o fez):
    ```bash
    firebase login
    firebase init
    ```
    * Escolha **Hosting**.
    * Selecione seu projeto existente.
    * Use **`build`** como o diretório público.
    * Configure como um **single-page app (SPA)**.
3.  Compile a versão de produção do aplicativo:
    ```bash
    npm run build
    ```
4.  Implante no Firebase Hosting:
    ```bash
    firebase deploy
    ```
O terminal fornecerá a URL onde seu aplicativo está no ar.