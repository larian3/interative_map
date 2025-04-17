'use client';
import { createContext, useContext, useState } from "react";

const MesoContext = createContext();

export const useMeso = () => useContext(MesoContext);

export const MesoProvider = ({ children }) => {
  const [selectedMesoNome, setSelectedMesoNome] = useState("");

  return (
    <MesoContext.Provider value={{ selectedMesoNome, setSelectedMesoNome }}>
      {children}
    </MesoContext.Provider>
  );
};
