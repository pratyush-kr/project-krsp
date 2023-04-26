import { Scheme } from "@/types/Scheme";
import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const SchemeContext = createContext<Scheme>({
  id: 0,
  name: "",
  cost: "",
  time: "",
  message: "",
  set: (scheme: Scheme) => {},
});

export const SchemeContextProvider: React.FC<Props> = ({ children }) => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const set = (scheme: Scheme) => {
    setId(scheme.id);
    setName(scheme.name);
    setCost(scheme.cost);
    setTime(scheme.time);
    setMessage(scheme.message);
  };

  return (
    <SchemeContext.Provider
      value={{
        id: id,
        name: name,
        cost: cost,
        time: time,
        message: message,
        set: set,
      }}
    >
      {children}
    </SchemeContext.Provider>
  );
};
