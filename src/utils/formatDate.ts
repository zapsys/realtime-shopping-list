// src/utils/formatDate.ts

export const formatDate = (timestamp: any): string => {
  // Se não houver timestamp, retorne uma string vazia
  if (!timestamp) {
    return '';
  }

  let date: Date;

  // 1. Verifica se é um objeto Timestamp do Firebase (possui o método toDate)
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  }
  // 2. Senão, tenta converter para um objeto Date (funciona para strings e objetos Date)
  else {
    date = new Date(timestamp);
  }

  // 3. Garante que a data é válida antes de formatar
  if (isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};