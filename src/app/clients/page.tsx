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
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clientes</h1>
                <NewClientDialog />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Buscar clientes..." className="pl-9" />
                </div>
            </div>

            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">Listagem de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">Carregando...</TableCell>
                                </TableRow>
                            ) : clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">Nenhum cliente encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.fullName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{client.type}</Badge>
                                        </TableCell>
                                        <TableCell>{client.email || "-"}</TableCell>
                                        <TableCell>{client.phone || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Editar</Button>
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
