// app/page.js
import Navbar from "../components/Navbar/Navbar";
import Mapa from "../components/Mapa/Mapa";
import "@fontsource/nunito";

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
