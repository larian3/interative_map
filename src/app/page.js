'use client';
import Navbar from "../components/Navbar/Navbar";
import dynamic from 'next/dynamic';
import { MesoProvider } from "../context/MesoContext";

const Mapa = dynamic(() => import('@/components/Mapa/Mapa'), { ssr: false });

export default function Page() {
  return (
    <MesoProvider>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow">
          <Mapa />
        </div>
      </div>
    </MesoProvider>
  );
}
