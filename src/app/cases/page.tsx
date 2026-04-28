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
            case 'Pendente': return 'bg-primary/10 text-primary border-primary/30';
            case 'In Progress':
            case 'Em Andamento': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'Suspended':
            case 'Cancelado': return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'Closed':
            case 'Concluído': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            default: return 'bg-gray-500/10 text-gray-400 border-white/5';
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Casos Jurídicos</h1>
                <NewCaseDialog />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar processos..." className="pl-9 bg-background/50 border-white/5 text-foreground focus:border-primary/50 focus:ring-primary/20" />
                </div>
            </div>

            <Card className="floating-surface">
                <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-base text-foreground">Processos Recentes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-white/5 hover:bg-transparent">
                                <TableHead className="text-muted-foreground">Nº Processo</TableHead>
                                <TableHead className="text-muted-foreground">Título</TableHead>
                                <TableHead className="text-muted-foreground">Cliente</TableHead>
                                <TableHead className="text-muted-foreground">Tribunal</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                                <TableHead className="text-muted-foreground">Protocolo</TableHead>
                                <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="border-b border-white/5">
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Carregando...</TableCell>
                                </TableRow>
                            ) : cases.length === 0 ? (
                                <TableRow className="border-b border-white/5">
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Nenhum processo encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                cases.map((c) => (
                                    <TableRow key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="font-mono text-xs text-muted-foreground">{c.caseNumber || "Sem número"}</TableCell>
                                        <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.client.fullName}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.court || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(c.status)}>
                                                {getStatusLabel(c.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={c.protocolStatus === 'Protocolado' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-orange-500/10 text-orange-500 border-orange-500/30'}>
                                                {c.protocolStatus || 'Não Protocolado'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary text-muted-foreground" asChild>
                                                <a href={`/cases/${c.id}`}>Ver Detalhes</a>
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
