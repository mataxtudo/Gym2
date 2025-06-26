import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReceitaContext = createContext();

export const useReceita = () => useContext(ReceitaContext);

export const ReceitaProvider = ({ children }) => {
  const { token } = useAuth(); // Pega o token do AuthContext
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:8080/api/receitas';

  // Cabeçalhos comuns para requisições autenticadas
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const listarReceitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        headers,
      });
      if (!res.ok) throw new Error('Erro ao listar receitas');
      const data = await res.json();
      setReceitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarReceita = async (receita) => {
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(receita),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar receita');
      await listarReceitas();
    } catch (err) {
      setError(err.message);
    }
  };

  const atualizarReceita = async (id, receita) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(receita),
      });
      if (!res.ok) throw new Error('Erro ao atualizar receita');
      await listarReceitas();
    } catch (err) {
      setError(err.message);
    }
  };

  const deletarReceita = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Erro ao deletar receita');
      await listarReceitas();
    } catch (err) {
      setError(err.message);
    }
  };

  const baixarReceita = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/baixar/${id}`, {
        method: 'PUT',
        headers,
      });
      if (!res.ok) throw new Error('Erro ao baixar receita');
      await listarReceitas();
    } catch (err) {
      setError(err.message);
    }
  };

  const removerBaixa = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/removerBaixa/${id}`, {
        method: 'PUT',
        headers,
      });
      if (!res.ok) throw new Error('Erro ao remover baixa da receita');
      await listarReceitas();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      listarReceitas();
    }
  }, [token]);

  return (
    <ReceitaContext.Provider
      value={{
        receitas,
        loading,
        error,
        listarReceitas,
        cadastrarReceita,
        atualizarReceita,
        deletarReceita,
        baixarReceita,
        removerBaixa,
      }}
    >
      {children}
    </ReceitaContext.Provider>
  );
};
