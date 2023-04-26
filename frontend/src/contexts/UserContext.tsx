import React, { createContext, useState } from "react";
import { User } from "@/types/User";
interface Props {
  children: React.ReactNode;
}
export const default_user: User = {
  isAuthenticated: false,
  name: "",
  login: () => {},
  logout: () => {},
  setUsername: () => {},
};
export const UserContext = createContext<User>({
  isAuthenticated: false,
  name: "",
  login: () => {},
  logout: () => {},
  setUsername: () => {},
});

export const UserContextProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const login = () => {
    setIsAuthenticated(true);
  };
  const logout = () => {
    setIsAuthenticated(false);
  };
  const setUsername = (username: string) => {
    setName(username);
  };
  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout, name, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
