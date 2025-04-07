'use client';
import Navbar from "../components/Navbar/Navbar";
import "@fontsource/nunito";
import dynamic from 'next/dynamic';
const Mapa = dynamic(() => import('@/components/Mapa/Mapa'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow">
        <Mapa />
      </div>
    </div>
  );
}
