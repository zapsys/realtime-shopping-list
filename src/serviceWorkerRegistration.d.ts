// src/serviceWorkerRegistration.d.ts

// Define a estrutura do objeto de configuração que a função register pode receber
interface Config {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

// Declara as funções que são exportadas pelo arquivo .js
export function register(config?: Config): void;
export function unregister(): void;