import { createContext, useContext, useState, useEffect } from 'react';

const VendaContext = createContext();

export const useVenda = () => useContext(VendaContext);

export const VendaProvider = ({ children }) => {
  const [vendas, setVendas] = useState([]);

  const buscarVendas = async () => {
    const response = await fetch('/api/vendas');
    const data = await response.json();
    setVendas(data);
  };

  const cadastrarVenda = async (novaVenda) => {
    await fetch('/api/vendas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaVenda),
    });
    await buscarVendas();
  };

  const excluirVenda = async (id) => {
    await fetch(`/api/vendas/${id}`, {
      method: 'DELETE',
    });
    await buscarVendas();
  };

  useEffect(() => {
    buscarVendas();
  }, []);

  return (
    <VendaContext.Provider value={{ vendas, cadastrarVenda, excluirVenda }}>
      {children}
    </VendaContext.Provider>
  );
};
