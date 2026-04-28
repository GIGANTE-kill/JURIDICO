"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

type Client = {
    id: number;
    fullName: string;
}

export function NewCaseDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        clientId: "",
        court: "",
        caseNumber: "",
        description: "",
        status: "Pendente",
        protocolStatus: "Não Protocolado",
        expectedDeliveryDate: ""
    });

    useEffect(() => {
        if (open) {
            fetch("/api/clients").then(res => res.json()).then(setClients);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/cases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setOpen(false);
                setFormData({ title: "", clientId: "", court: "", caseNumber: "", description: "", status: "Pendente", protocolStatus: "Não Protocolado", expectedDeliveryDate: "" });
                router.refresh();
                window.location.reload();
            } else {
                alert("Erro ao criar caso");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao criar caso");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Novo Caso
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Novo Caso Jurídico</DialogTitle>
                        <DialogDescription>
                            Cadastre um novo processo ou caso consultivo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Título do Caso
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="col-span-3"
                                required
                                placeholder="Ex: Ação Trabalhista vs Empresa X"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="client" className="text-right">
                                Cliente
                            </Label>
                            <div className="col-span-3">
                                <Select onValueChange={(val) => setFormData({ ...formData, clientId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o Cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                {client.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="caseNumber" className="text-right">
                                Nº Processo
                            </Label>
                            <Input
                                id="caseNumber"
                                value={formData.caseNumber}
                                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                                className="col-span-3"
                                placeholder="0000000-00.2024.5.00.0000"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="court" className="text-right">
                                Tribunal/Vara
                            </Label>
                            <Input
                                id="court"
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                className="col-span-3"
                                placeholder="2ª Vara Cível de SP"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right">
                                Descrição
                            </Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <div className="col-span-3">
                                <Select onValueChange={(val) => setFormData({ ...formData, status: val })} defaultValue={formData.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                        <SelectItem value="Concluído">Concluído</SelectItem>
                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="protocolStatus" className="text-right">Protocolo</Label>
                            <div className="col-span-3">
                                <Select onValueChange={(val) => setFormData({ ...formData, protocolStatus: val })} defaultValue={formData.protocolStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Protocolo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Não Protocolado">Não Protocolado</SelectItem>
                                        <SelectItem value="Protocolado">Protocolado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expectedDeliveryDate" className="text-right">
                                Previsão de Parto
                            </Label>
                            <Input
                                id="expectedDeliveryDate"
                                type="date"
                                value={formData.expectedDeliveryDate}
                                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !formData.clientId}>
                            {loading ? "Salvando..." : "Criar Caso"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
