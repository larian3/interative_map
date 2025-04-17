'use client';
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useMeso } from "@/context/MesoContext";

export default function DropdownNavbar({ onSelect }) {
  const [mesoRegioes, setMesoRegioes] = useState([]);
  const [microRegioes, setMicroRegioes] = useState([]);

  const {
    selectedMesoId,
    setSelectedMesoId,
    selectedMesoNome,
    setSelectedMesoNome,
    selectedMicroNome,
    setSelectedMicroNome,
  } = useMeso();

  useEffect(() => {
    async function fetchMesoRegioes() {
      try {
        const response = await fetch("/api/regioes");
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
    setSelectedMicroNome("");

    if (onSelect) onSelect();
  };

  const handleMicroChange = (e) => {
    setSelectedMicroNome(e.target.value);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-3 lg:space-y-0 items-center p-4 w-full overflow-x-hidden">
      <div className="w-full sm:w-[200px] max-w-full">
        <label className="block text-sm font-medium text-gray-700">Mesorregião:</label>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleMesoChange}
            value={selectedMesoId}
          >
            <option value="">Selecione</option>
            {mesoRegioes.map((meso) => (
              <option key={meso.id} value={meso.id}>{meso.nome}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FiChevronDown />
          </div>
        </div>
      </div>

      <div className="w-full sm:w-[200px] max-w-full">
        <label className="block text-sm font-medium text-gray-700">Microrregião:</label>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleMicroChange}
            value={selectedMicroNome}
            disabled={!selectedMesoId}
          >
            <option value="">Selecione</option>
            {microRegioes.map((micro) => (
              <option key={micro.id} value={micro.nome}>{micro.nome}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FiChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
}
