import Image from "next/image";
import { Ranking } from "./components/Ranking";
import Footer from "./components/Footer";

export const metadata = {
  title: "Ranking^2",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24">
        <Ranking />
      </main>
      <Footer />
    </div>
  );
}
