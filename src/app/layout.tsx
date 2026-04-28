import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { CommandMenu } from "@/components/CommandMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão Jurídica",
  description: "Sistema de Gerenciamento de Casos e Clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex h-screen bg-slate-50">
          <Sidebar />
          <CommandMenu />
          <main className="flex-1 overflow-y-auto p-8 pl-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
