"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    CalendarIcon,
    Briefcase,
    Users,
    Settings,
    User,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Digite um comando ou busque..." />
                <CommandList>
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    <CommandGroup heading="Acesso Rápido">
                        <CommandItem
                            onSelect={() => {
                                runCommand(() => router.push("/clients"));
                            }}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            <span>Clientes</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => {
                                runCommand(() => router.push("/cases"));
                            }}
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Processos</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => {
                                runCommand(() => router.push("/calendar"));
                            }}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Agenda</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Configurações">
                        <CommandItem
                            onSelect={() => {
                                runCommand(() => router.push("/settings"));
                            }}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
