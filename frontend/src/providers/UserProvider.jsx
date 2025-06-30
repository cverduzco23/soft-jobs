import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL;
const initialStateToken = localStorage.getItem("token") || null;

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(initialStateToken);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const loginWithEmailAndPassword = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setToken(data.token || null);
    return data;
  };

  const registerWithEmailAndPassword = async (email, password, rol, lenguage) => {
    const response = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rol, lenguage }),
    });

    const data = await response.text();
    return { message: data };
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{
        token,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
