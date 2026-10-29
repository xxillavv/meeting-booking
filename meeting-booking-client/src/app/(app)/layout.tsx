import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </>
  );
}
