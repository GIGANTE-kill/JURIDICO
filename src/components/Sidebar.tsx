"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Briefcase, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Users, label: "Clientes", href: "/clients" },
  { icon: Briefcase, label: "Processos", href: "/cases" },
  { icon: Calendar, label: "Agenda", href: "/calendar" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 hover:w-64 bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800 flex flex-col overflow-hidden group shadow-xl">
      <div className="flex h-16 items-center justify-center border-b border-slate-800 shrink-0 relative">
        {/* Icon only when collapsed / Logo when expanded - or just an icon that stays */}
        <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
          <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center font-bold text-white">A</div>
        </div>
        <span className="ml-16 text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          Advocacia
        </span>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 transition-colors relative h-12",
                isActive ? "bg-slate-800 text-blue-400" : "hover:bg-slate-800 text-slate-300 hover:text-white"
              )}
            >
              <item.icon className={cn("h-6 w-6 shrink-0 absolute left-5", isActive && "text-blue-400")} />
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-12">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="/settings" className="flex items-center gap-4 hover:text-white text-slate-400 h-10 relative">
          <Settings className="h-6 w-6 shrink-0 absolute left-1" />
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-12">Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
