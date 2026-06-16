import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollScene } from "@/components/three/ScrollScene";

export function AppShell({ children, noFooter = false }: { children: ReactNode; noFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ScrollScene />
      <Header />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
