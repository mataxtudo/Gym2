import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // para pegar o token JWT

const PlanoClienteContext = createContext();

export const PlanoClienteProvider = ({ children }) => {
  const { token } = useAuth();

  const apiUrlPlanoCliente = "http://localhost:8080/api/planoClientes";
  const apiUrlPlanos = "http://localhost:8080/api/planos";

  const [planos, setPlanos] = useState([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);

  const [planoCliente, setPlanoCliente] = useState(null); // objeto único
  const [loadingPlanoCliente, setLoadingPlanoCliente] = useState(false);

  // Busca todos os planos disponíveis
  const buscarPlanos = async () => {
    if (!token) return;
    setLoadingPlanos(true);
    try {
      const res = await fetch(apiUrlPlanos, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ao buscar planos: ${res.status}`);
      const data = await res.json();
      setPlanos(data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    } finally {
      setLoadingPlanos(false);
    }
  };

  // Busca o plano vinculado ao cliente pelo id (objeto único)
  const buscarPlanosPorCliente = async (clienteId) => {
    if (!token) return;
    if (!clienteId) return;

    setLoadingPlanoCliente(true);
    try {
      const res = await fetch(`${apiUrlPlanoCliente}/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Se 404, pode ser que não tenha plano vinculado
        if (res.status === 404) {
          setPlanoCliente(null);
          return;
        }
        throw new Error(`Erro ao buscar plano do cliente: ${res.status}`);
      }
      const data = await res.json();
      setPlanoCliente(data);
    } catch (error) {
      console.error("Erro ao buscar plano do cliente:", error);
      setPlanoCliente(null);
    } finally {
      setLoadingPlanoCliente(false);
    }
  };

  // Vincular plano a cliente
  const vincularPlanoCliente = async ({ clienteId, planoId }) => {
    if (!token) return;
    try {
      const body = { clienteId, planoId };
      const res = await fetch(apiUrlPlanoCliente, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao vincular plano");
      // Atualiza plano vinculado
      await buscarPlanosPorCliente(clienteId);
    } catch (error) {
      console.error("Erro ao vincular plano:", error);
    }
  };

  useEffect(() => {
    if (token) {
      buscarPlanos();
    }
  }, [token]);

  return (
    <PlanoClienteContext.Provider
      value={{
        planos,
        loadingPlanos,
        planoCliente,             // objeto único
        loadingPlanoCliente,
        buscarPlanosPorCliente,
        vincularPlanoCliente,
      }}
    >
      {children}
    </PlanoClienteContext.Provider>
  );
};

export const usePlanoCliente = () => useContext(PlanoClienteContext);
