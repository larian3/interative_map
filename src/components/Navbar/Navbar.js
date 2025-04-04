"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import DropdownNavbar from "./DropDownNavbar";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = "8724dd9b-74db-4b5e-8caf-20259a4795ea";
        const response = await fetch(`/api/user/${userId}`);

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Falha ao buscar usuário`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUser();
  }, []);

  return (
    <nav className="bg-white shadow-md h-[80px] px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Image
          src={user?.image || "/avatar.png"}
          alt="Foto de perfil"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="hidden sm:block text-gray-800 text-lg font-bold">
          Olá, {user?.name || "Usuário"}
        </span>

      </div>

      <button
        className="lg:hidden p-2 text-gray-800"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      <div className="hidden lg:flex">
        <DropdownNavbar />
      </div>

      {isMenuOpen && (
        <div className="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg p-2 flex flex-col space-y-4 lg:hidden">
          <button className="self-end p-2" onClick={() => setIsMenuOpen(false)}>
            <FiX size={28} />
          </button>
          <div className="flex flex-col space-y-4">
            <DropdownNavbar />
          </div>
        </div>
      )}
    </nav>
  );
}