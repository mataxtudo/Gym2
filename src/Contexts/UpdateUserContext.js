import React, { createContext, useContext } from "react";

const UpdateUserContext = createContext();

export const UpdateUserProvider = ({ children }) => {
  const updateUser = async (data, token) => {
    try {
      const response = await fetch("http://localhost:8080/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro desconhecido ao atualizar usuário");
      }

      const responseData = await response.text(); // ou .json() se o backend mandar JSON
      alert("Usuário atualizado com sucesso!");
      return responseData;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário. Verifique a senha atual e tente novamente.");
    }
  };

  return (
    <UpdateUserContext.Provider value={{ updateUser }}>
      {children}
    </UpdateUserContext.Provider>
  );
};

export const useUpdateUser = () => useContext(UpdateUserContext);
