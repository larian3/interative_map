'use client';
import { createContext, useContext, useState } from 'react';

const MesoContext = createContext();

export const MesoProvider = ({ children }) => {
  const [selectedMesoNome, setSelectedMesoNome] = useState('');
  const [selectedMesoId, setSelectedMesoId] = useState('');
  const [selectedMicroNome, setSelectedMicroNome] = useState('');

  return (
    <MesoContext.Provider value={{ selectedMesoNome, setSelectedMesoNome, selectedMesoId, setSelectedMesoId, selectedMicroNome, setSelectedMicroNome }}>
      {children}
    </MesoContext.Provider>
  );
};

export const useMeso = () => useContext(MesoContext);
