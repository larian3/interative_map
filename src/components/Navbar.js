"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = "a5ba1a27-d713-4b6b-8583-64293b406bb3"; 
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
    <nav className="bg-white p-4 shadow-md">
      <div className="container flex justify-start items-center space-x-3">
        <Image
          src={user?.image || "/avatar.png"} 
          alt="Foto de perfil"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-gray-800 text-lg">
          Olá, {user?.name || "Usuário"}
        </span>
      </div>
    </nav>
  );
}
