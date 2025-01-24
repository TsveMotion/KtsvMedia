'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSchedulePage = pathname === '/schedule';

  return (
    <>
      <LoadingScreen />
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow">
          {children}
        </main>
        {!isSchedulePage && <Footer />}
      </div>
    </>
  );
}
