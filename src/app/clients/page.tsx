"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewClientDialog } from "@/components/NewClientDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Client = {
    id: number;
    fullName: string;
    type: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/clients")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch clients");
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setClients(data);
                } else {
                    console.error("API response is not an array:", data);
                    setClients([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch clients", err);
                setClients([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
                <NewClientDialog />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar clientes..." className="pl-9 bg-background/50 border-white/5 text-foreground focus:border-primary/50 focus:ring-primary/20" />
                </div>
            </div>

            <Card className="floating-surface">
                <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-base text-foreground">Listagem de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-white/5 hover:bg-transparent">
                                <TableHead className="text-muted-foreground">Nome</TableHead>
                                <TableHead className="text-muted-foreground">Tipo</TableHead>
                                <TableHead className="text-muted-foreground">Email</TableHead>
                                <TableHead className="text-muted-foreground">Telefone</TableHead>
                                <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="border-b border-white/5">
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Carregando...</TableCell>
                                </TableRow>
                            ) : clients.length === 0 ? (
                                <TableRow className="border-b border-white/5">
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Nenhum cliente encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="font-medium text-foreground">{client.fullName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{client.type}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{client.email || "-"}</TableCell>
                                        <TableCell className="text-muted-foreground">{client.phone || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary text-muted-foreground">Ver Detalhes</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
