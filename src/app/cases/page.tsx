"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { NewCaseDialog } from "@/components/NewCaseDialog";
import { Button } from "@/components/ui/button";

type Case = {
    id: number;
    caseNumber: string | null;
    title: string;
    status: string;
    protocolStatus: string;
    expectedDeliveryDate: string | null;
    court: string | null;
    client: { fullName: string };
    updatedAt: string;
};

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/cases")
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch cases");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setCases(data);
                } else {
                    console.error("API response is not an array:", data);
                    setCases([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch cases", err);
                setCases([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
            case 'Pendente': return 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200';
            case 'In Progress':
            case 'Em Andamento': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200';
            case 'Suspended':
            case 'Cancelado': return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200';
            case 'Closed':
            case 'Concluído': return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Open': return 'Pendente';
            case 'In Progress': return 'Em Andamento';
            case 'Suspended': return 'Cancelado';
            case 'Closed': return 'Concluído';
            default: return status;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Casos Jurídicos</h1>
                <NewCaseDialog />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Buscar processos..." className="pl-9" />
                </div>
            </div>

            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">Processos Recentes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nº Processo</TableHead>
                                <TableHead>Título</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Tribunal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Protocolo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">Carregando...</TableCell>
                                </TableRow>
                            ) : cases.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">Nenhum processo encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                cases.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-mono text-xs">{c.caseNumber || "Sem número"}</TableCell>
                                        <TableCell className="font-medium">{c.title}</TableCell>
                                        <TableCell>{c.client.fullName}</TableCell>
                                        <TableCell>{c.court || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(c.status)}>
                                                {getStatusLabel(c.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={c.protocolStatus === 'Protocolado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                                                {c.protocolStatus || 'Não Protocolado'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={`/cases/${c.id}`}>Ver</a>
                                            </Button>
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
