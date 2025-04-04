"use client";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi"; 

export default function DropdownNavbar() {
  const [mesoRegioes, setMesoRegioes] = useState([]);
  const [microRegioes, setMicroRegioes] = useState([]);
  const [selectedMeso, setSelectedMeso] = useState("");
  const [selectedMicro, setSelectedMicro] = useState("");

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
      if (!selectedMeso) {
        setMicroRegioes([]);
        return;
      }

      try {
        const response = await fetch(`/api/regioes?mesoId=${selectedMeso}`);
        if (!response.ok) throw new Error("Erro ao carregar microrregiões");

        const data = await response.json();
        setMicroRegioes(data.micro || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMicroRegioes();
  }, [selectedMeso]);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-3 lg:space-y-0 items-center p-4 w-full overflow-x-hidden">
      
      {/* Mesorregião */}
      <div className="w-full sm:w-[200px] max-w-full">
        <label className="block text-sm font-medium text-gray-700">Mesorregião:</label>
        <div className="relative">
          <select
            className="w-full h-[44px] text-[16px] text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm 
            px-3 pr-10 text-left transition-all duration-200 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
            hover:border-gray-400 appearance-none"
            value={selectedMeso}
            onChange={(e) => setSelectedMeso(e.target.value)}
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

      {/* Microrregião */}
      <div className="w-full sm:w-[200px] max-w-full">
        <label className="block text-sm font-medium text-gray-700 ">Microrregião:</label>
        <div className="relative">
          <select
            className="w-full h-[44px] text-[16px] text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm 
            px-3 pr-10 text-left transition-all duration-200 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
            hover:border-gray-400 appearance-none
            disabled:bg-gray-200 disabled:cursor-not-allowed"
            value={selectedMicro}
            onChange={(e) => setSelectedMicro(e.target.value)}
            disabled={!selectedMeso}
          >
            <option value="">Selecione</option>
            {microRegioes.map((micro) => (
              <option key={micro.id} value={micro.nome}>
                {micro.nome.replace(/^Microrregião de\s+/i, "")}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-2xl pointer-events-none" />
        </div>
      </div>

    </div>
  );
}
