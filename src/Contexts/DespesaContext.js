import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DespesaContext = createContext();

export const useDespesas = () => useContext(DespesaContext);

export const DespesaProvider = ({ children }) => {
  const { token } = useAuth(); // 🔐 Pega o token do AuthContext
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:8080/api/despesas';

  // Cabeçalhos padrão
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 🔎 Listar despesas
  const listarDespesas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, { headers });
      if (!res.ok) throw new Error('Erro ao listar despesas');
      const data = await res.json();
      setDespesas(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cadastrar despesa
  const cadastrarDespesa = async (despesa) => {
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(despesa),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar despesa');
      await listarDespesas();
    } catch (err) {
      setError(err.message);
    }
  };

  // ✍️ Editar despesa
  const editarDespesa = async (id, despesa) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(despesa),
      });
      if (!res.ok) throw new Error('Erro ao atualizar despesa');
      await listarDespesas();
    } catch (err) {
      setError(err.message);
    }
  };

  // ❌ Deletar despesa
  const deletarDespesa = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Erro ao deletar despesa');
      await listarDespesas();
    } catch (err) {
      setError(err.message);
    }
  };

  // ✔️ Baixar despesa
  const baixarDespesa = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/baixar/${id}`, {
        method: 'PUT',
        headers,
      });
      if (!res.ok) throw new Error('Erro ao baixar despesa');
      await listarDespesas();
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔄 Remover baixa
  const removerBaixa = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/removerBaixa/${id}`, {
        method: 'PUT',
        headers,
      });
      if (!res.ok) throw new Error('Erro ao remover baixa da despesa');
      await listarDespesas();
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔁 Carregar despesas sempre que o token mudar
  useEffect(() => {
    if (token) {
      listarDespesas();
    }
  }, [token]);

  return (
    <DespesaContext.Provider
      value={{
        despesas,
        loading,
        error,
        listarDespesas,
        cadastrarDespesa,
        editarDespesa,
        deletarDespesa,
        baixarDespesa,
        removerBaixa,
      }}
    >
      {children}
    </DespesaContext.Provider>
  );
};
