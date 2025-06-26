import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PlanoContext = createContext();

export const PlanoProvider = ({ children }) => {
  const { token } = useAuth();
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = "http://localhost:8080/api/planos";

  const buscarPlanos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar planos");
      const data = await response.json();
      setPlanos(data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarPlano = async (plano) => {
    if (!token) return;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plano),
      });
      if (!response.ok) throw new Error("Erro ao cadastrar plano");
      await buscarPlanos();
    } catch (error) {
      console.error("Erro ao cadastrar plano:", error);
    }
  };

  const atualizarPlano = async (id, plano) => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plano),
      });
      if (!response.ok) throw new Error("Erro ao atualizar plano");
      await buscarPlanos();
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
    }
  };

  const deletarPlano = async (id) => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao deletar plano");
      await buscarPlanos();
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
    }
  };

  useEffect(() => {
    if (token) {
      buscarPlanos();
    }
  }, [token]); // 🔥 Aqui está o ajuste

  return (
    <PlanoContext.Provider
      value={{
        planos,
        loading,
        buscarPlanos,
        cadastrarPlano,
        atualizarPlano,
        deletarPlano,
      }}
    >
      {children}
    </PlanoContext.Provider>
  );
};

export const usePlano = () => useContext(PlanoContext);
