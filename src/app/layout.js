import { Nunito } from 'next/font/google';
import "./globals.css";
import 'leaflet/dist/leaflet.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito',
});

export const metadata = {
  title: "CNPq ACC GF",
  description: "Sistema de busca de áreas degradadas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
