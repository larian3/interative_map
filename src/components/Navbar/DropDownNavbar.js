'use client';
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useMeso } from "@/context/MesoContext";

export default function DropdownNavbar({ onSelect }) {
  const [mesoRegioes, setMesoRegioes] = useState([]);
  const [microRegioes, setMicroRegioes] = useState([]);
  const [selectedMesoId, setSelectedMesoId] = useState("");
  const [selectedMicro, setSelectedMicro] = useState("");

  const { setSelectedMesoNome } = useMeso();

  useEffect(() => {
    async function fetchMesoRegioes() {
      try {
        const response = await fetch("/api/regioes");
        if (!response.ok) throw new Error("Erro ao carregar mesorregiões");
        const data = await response.json();
        setMesoRegioes(data.meso || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMesoRegioes();
  }, []);

  useEffect(() => {
    async function fetchMicroRegioes() {
      if (!selectedMesoId) return;
      try {
        const response = await fetch(`/api/regioes?mesoId=${selectedMesoId}`);
        if (!response.ok) throw new Error("Erro ao carregar microrregiões");
        const data = await response.json();
        setMicroRegioes(data.micro || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMicroRegioes();
  }, [selectedMesoId]);

  const handleMesoChange = (e) => {
    const id = e.target.value;
    const selected = mesoRegioes.find((meso) => meso.id.toString() === id);
    setSelectedMesoId(id);
    setSelectedMesoNome(selected?.nome || "");
    setSelectedMicro("");

    if (onSelect) onSelect();
  };

  const handleMicroChange = (e) => {
    const selected = e.target.value;
    setSelectedMicro(selected);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-3 lg:space-y-0 items-center p-4 w-full overflow-x-hidden">
      <div className="w-full sm:w-[200px] max-w-full">
        <label className="block text-sm font-medium text-gray-700">Mesorregião:</label>
        <div className="relative">
          <select
            className="w-full h-[44px] text-[16px] text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm 
              px-3 pr-10 text-left transition-all duration-200 ease-in-out 
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
              hover:border-gray-400 appearance-none"
            onChange={handleMesoChange}
            value={selectedMesoId}
          >
            <option value="">Selecione</option>
            {mesoRegioes.map((meso) => (
              <option key={meso.id} value={meso.id}>
                {meso.nome}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-2xl pointer-events-none" />
        </div>
      </div>
      
      <div className="w-full sm:w-[200px] max-w-full">
        <label className="block text-sm font-medium text-gray-700">Microrregião:</label>
        <div className="relative">
          <select
            className="w-full h-[44px] text-[16px] text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm 
              px-3 pr-10 text-left transition-all duration-200 ease-in-out 
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
              hover:border-gray-400 appearance-none"
            onChange={handleMicroChange}
            value={selectedMicro}
            disabled={!selectedMesoId}
          >
            <option value="">Selecione</option>
            {microRegioes.map((micro) => (
              <option key={micro.id} value={micro.nome}>
                {micro.nome}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
