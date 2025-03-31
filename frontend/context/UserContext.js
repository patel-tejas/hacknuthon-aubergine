"use client";
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { jwtDecode } from 'jwt-decode'; 


const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const login = useCallback((token) => {
    console.log("Login token:", token);
    
    try {
      const decodedUser = jwtDecode(token);
      console.log("Decoded User:", decodedUser);
      
      if (decodedUser.exp && decodedUser.exp < Date.now() / 1000) {
        throw new Error("Token expired");
      }
      setUser(decodedUser);
      
      // Auto-logout on expiration
      if (decodedUser.exp) {
        const expiresIn = decodedUser.exp * 1000 - Date.now();
        setTimeout(logout, expiresIn);
      }
    } catch (error) {
      console.error("Login failed:", error);
      logout();
    }
    
    console.log("User logged in:", user);
  }, [logout]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp && decodedUser.exp < Date.now() / 1000) {
          logout();
        } else {
          setUser(decodedUser);
          // Auto-logout setup
          if (decodedUser.exp) {
            const expiresIn = decodedUser.exp * 1000 - Date.now();
            const timeout = setTimeout(logout, expiresIn);
            return () => clearTimeout(timeout);
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [logout]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          logout();
        } else {
          try {
            const decodedUser = jwtDecode(e.newValue);
            setUser(decodedUser);
          } catch (error) {
            logout();
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout]);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext);