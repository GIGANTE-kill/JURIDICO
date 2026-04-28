"use client";

import { useEffect, useState, use, useCallback } from "react";
import {
    ArrowLeft,
    FileText,
    Upload,
    User,
    Building,
    Save,
    Baby,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type Document = {
    id: number;
    name: string;
    fileUrl: string;
    uploadedAt: string;
};

type Comment = {
    id: number;
    content: string;
    createdAt: string;
};

type CaseDetail = {
    id: number;
    title: string;
    caseNumber: string;
    status: string;
    protocolStatus: string;
    expectedDeliveryDate?: string | null;
    gaveBirth: boolean;
    birthDate?: string | null;
    court: string;
    description: string;
    openedAt: string;
    client: {
        fullName: string;
        email: string;
        phone: string;
    };
    documents: Document[];
    comments: Comment[];
};

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [caseData, setCaseData] = useState<CaseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const [newComment, setNewComment] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    const fetchCase = useCallback(() => {
        fetch(`/api/cases/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed");
                return res.json();
            })
            .then((data) => {
                setCaseData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetchCase();
    }, [fetchCase]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caseId", id);
        formData.append("name", file.name);

        try {
            const res = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                fetchCase();
            } else {
                alert("Erro no upload");
            }
        } catch (err) {
            console.error(err);
            alert("Erro no upload");
        } finally {
            setUploading(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caseId: id, content: newComment }),
            });

            if (res.ok) {
                setNewComment("");
                fetchCase();
            } else {
                alert("Erro ao enviar comentário");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar comentário");
        } finally {
            setSubmittingComment(false);
        }
    };

    // --- Save case updates ---
    const updateField = async (field: string, value: any) => {
        if (!caseData) return;
        setSaving(true);
        setSaveMessage("");
        try {
            const res = await fetch(`/api/cases/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: value }),
            });
            if (res.ok) {
                const updated = await res.json();
                setCaseData(updated);
                setSaveMessage("Salvo!");
                setTimeout(() => setSaveMessage(""), 2000);
            } else {
                alert("Erro ao salvar");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pendente': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Em Andamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
            case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    if (loading) return <div className="p-8">Carregando caso...</div>;
    if (!caseData) return <div className="p-8">Caso não encontrado.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/cases" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Voltar para Processos
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{caseData.title}</h1>
                        <div className="flex items-center gap-3 mt-2 text-slate-500">
                            <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {caseData.caseNumber || "Sem N. Processo"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-sm">
                                <Building className="h-3 w-3" /> {caseData.court || "Tribunal N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {saveMessage && (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" /> {saveMessage}
                            </span>
                        )}
                        <Badge className={`text-sm px-3 py-1 ${getStatusColor(caseData.status)}`}>{caseData.status}</Badge>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="maternity">
                        <Baby className="h-4 w-4 mr-1" /> Maternidade
                    </TabsTrigger>
                    <TabsTrigger value="docs">Documentos ({caseData.documents.length})</TabsTrigger>
                    <TabsTrigger value="comments">Comentários ({caseData.comments?.length || 0})</TabsTrigger>
                </TabsList>

                {/* --- DETALHES TAB --- */}
                <TabsContent value="details" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Cliente</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="font-medium text-lg">{caseData.client.fullName}</div>
                                <div className="text-slate-500">{caseData.client.email || "Sem email"}</div>
                                <div className="text-slate-500">{caseData.client.phone || "Sem telefone"}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Gerenciar Caso</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {/* Status */}
                                <div>
                                    <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Status do Caso</Label>
                                    <Select
                                        value={caseData.status}
                                        onValueChange={(val) => updateField("status", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pendente">Pendente</SelectItem>
                                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                            <SelectItem value="Concluído">Concluído</SelectItem>
                                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Protocol */}
                                <div>
                                    <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Protocolo</Label>
                                    <Select
                                        value={caseData.protocolStatus}
                                        onValueChange={(val) => updateField("protocolStatus", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Não Protocolado">Não Protocolado</SelectItem>
                                            <SelectItem value="Protocolado">Protocolado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Descrição</Label>
                                    <div className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border text-sm">
                                        {caseData.description || "Nenhuma descrição informada."}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- MATERNIDADE TAB --- */}
                <TabsContent value="maternity" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Baby className="h-4 w-4" /> Informações de Maternidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Previsão de Parto */}
                                <div className="space-y-2">
                                    <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                        Data Prevista do Parto
                                    </Label>
                                    <Input
                                        type="date"
                                        value={caseData.expectedDeliveryDate ? caseData.expectedDeliveryDate.split("T")[0] : ""}
                                        onChange={(e) => updateField("expectedDeliveryDate", e.target.value || null)}
                                    />
                                    {caseData.expectedDeliveryDate && (
                                        <p className="text-sm text-slate-500">
                                            Previsão: {new Date(caseData.expectedDeliveryDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                                        </p>
                                    )}
                                </div>

                                {/* Já Pariu? */}
                                <div className="space-y-2">
                                    <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                        Já Pariu?
                                    </Label>
                                    <Select
                                        value={caseData.gaveBirth ? "sim" : "nao"}
                                        onValueChange={(val) => updateField("gaveBirth", val === "sim")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nao">Não</SelectItem>
                                            <SelectItem value="sim">Sim</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Data do Parto (only if gaveBirth) */}
                                {caseData.gaveBirth && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                            Data do Parto
                                        </Label>
                                        <Input
                                            type="date"
                                            value={caseData.birthDate ? caseData.birthDate.split("T")[0] : ""}
                                            onChange={(e) => updateField("birthDate", e.target.value || null)}
                                        />
                                        {caseData.birthDate && (
                                            <p className="text-sm text-slate-500">
                                                Parto em: {new Date(caseData.birthDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Summary Card */}
                            <div className="mt-4 p-4 rounded-lg border bg-gradient-to-r from-pink-50 to-purple-50">
                                <h4 className="font-semibold text-slate-800 mb-2">Resumo Maternidade</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500 block">Previsão</span>
                                        <span className="font-medium text-slate-900">
                                            {caseData.expectedDeliveryDate
                                                ? new Date(caseData.expectedDeliveryDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
                                                : "Não definida"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Pariu</span>
                                        <span className={`font-medium ${caseData.gaveBirth ? 'text-green-700' : 'text-orange-600'}`}>
                                            {caseData.gaveBirth ? "Sim ✓" : "Não"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Data Parto</span>
                                        <span className="font-medium text-slate-900">
                                            {caseData.birthDate
                                                ? new Date(caseData.birthDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
                                                : "—"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Protocolo</span>
                                        <Badge variant="outline" className={caseData.protocolStatus === 'Protocolado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                                            {caseData.protocolStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- DOCUMENTOS TAB --- */}
                <TabsContent value="docs" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Arquivos do Processo</CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="file-upload" className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                                    {uploading ? "Enviando..." : <><Upload className="h-4 w-4" /> Adicionar Documento</>}
                                </Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {caseData.documents.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    Nenhum documento anexado a este caso.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {caseData.documents.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-50 flex items-center justify-center rounded text-blue-600">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{doc.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        Enviado em {new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setViewingDoc(doc.fileUrl)}>
                                                    Visualizar
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">Baixar</a>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- COMENTÁRIOS TAB --- */}
                <TabsContent value="comments" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Histórico de Comentários</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleCommentSubmit} className="flex gap-4">
                                <Input
                                    placeholder="Adicione um comentário ou atualização..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={submittingComment}>
                                    {submittingComment ? "Enviando..." : "Enviar"}
                                </Button>
                            </form>

                            <div className="space-y-4">
                                {caseData.comments?.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm">Nenhum comentário ainda.</div>
                                ) : (
                                    caseData.comments?.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg border">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                                <User className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-sm text-slate-900">Advogado</span>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(comment.createdAt).toLocaleString("pt-BR")}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={!!viewingDoc} onOpenChange={(o) => !o && setViewingDoc(null)}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-4">
                    <DialogHeader className="mb-2">
                        <DialogTitle>Visualização de Documento</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full bg-slate-100 rounded overflow-hidden">
                        {viewingDoc && (
                            <iframe src={viewingDoc} className="w-full h-full border-0" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
