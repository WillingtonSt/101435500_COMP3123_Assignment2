import React, { createContext, useState, useEffect } from 'react';



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
 
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  const logout = () => {

    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
