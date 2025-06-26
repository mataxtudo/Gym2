import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext'; // ajuste o caminho se necessário

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { token } = useAuth(); // pega o token do AuthContext
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // <- NOVO

  const fetchProdutos = async () => {
    if (!token || hasFetched) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/produtos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async (produto) => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8080/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) throw new Error('Erro ao adicionar produto');
      const novoProduto = await response.json();
      setProdutos((prev) => [...prev, novoProduto]);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [token]); // atualiza quando o token muda

  return (
    <ProductContext.Provider value={{ produtos, loading, fetchProdutos, adicionarProduto }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProdutos = () => useContext(ProductContext);
