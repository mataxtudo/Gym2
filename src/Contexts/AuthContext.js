import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // 👈 NOVO: controla o carregamento inicial

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserInfo(storedToken);
    }
    setLoadingAuth(false);
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/auth/validar', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ id: data.id, login: data.login });
      }
    } catch (error) {
      console.error('Erro ao carregar informações do usuário', error);
    }
  };

  const login = async (loginData) => {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Login falhou');
    }

    const data = await response.json();
    setToken(data.token);
    localStorage.setItem('token', data.token);
    await fetchUserInfo(data.token);
    return data.token;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
