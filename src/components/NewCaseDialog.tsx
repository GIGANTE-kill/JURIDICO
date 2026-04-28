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
                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
                    <Plus className="mr-2 h-4 w-4" /> Novo Caso
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] glassmorphism border-primary/30 p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-xl">Novo Caso Jurídico</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Cadastre um novo processo ou caso consultivo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right text-muted-foreground">
                                Título do Caso
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                required
                                placeholder="Ex: Ação Trabalhista vs Empresa X"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="client" className="text-right text-muted-foreground">
                                Cliente
                            </Label>
                            <div className="col-span-3">
                                <Select onValueChange={(val) => setFormData({ ...formData, clientId: val })}>
                                    <SelectTrigger className="bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20">
                                        <SelectValue placeholder="Selecione o Cliente" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-white/10">
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={client.id.toString()} className="text-foreground focus:bg-primary focus:text-white">
                                                {client.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="caseNumber" className="text-right text-muted-foreground">
                                Nº Processo
                            </Label>
                            <Input
                                id="caseNumber"
                                value={formData.caseNumber}
                                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                placeholder="0000000-00.2024.5.00.0000"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="court" className="text-right text-muted-foreground">
                                Tribunal/Vara
                            </Label>
                            <Input
                                id="court"
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                placeholder="2ª Vara Cível de SP"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right text-muted-foreground">
                                Descrição
                            </Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right text-muted-foreground">Status</Label>
                            <div className="col-span-3">
                                <Select onValueChange={(val) => setFormData({ ...formData, status: val })} defaultValue={formData.status}>
                                    <SelectTrigger className="bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-white/10">
                                        <SelectItem value="Pendente" className="text-foreground focus:bg-primary focus:text-white">Pendente</SelectItem>
                                        <SelectItem value="Em Andamento" className="text-foreground focus:bg-primary focus:text-white">Em Andamento</SelectItem>
                                        <SelectItem value="Concluído" className="text-foreground focus:bg-primary focus:text-white">Concluído</SelectItem>
                                        <SelectItem value="Cancelado" className="text-foreground focus:bg-primary focus:text-white">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="protocolStatus" className="text-right text-muted-foreground">Protocolo</Label>
                            <div className="col-span-3">
                                <Select onValueChange={(val) => setFormData({ ...formData, protocolStatus: val })} defaultValue={formData.protocolStatus}>
                                    <SelectTrigger className="bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20">
                                        <SelectValue placeholder="Protocolo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-white/10">
                                        <SelectItem value="Não Protocolado" className="text-foreground focus:bg-primary focus:text-white">Não Protocolado</SelectItem>
                                        <SelectItem value="Protocolado" className="text-foreground focus:bg-primary focus:text-white">Protocolado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expectedDeliveryDate" className="text-right text-muted-foreground">
                                Previsão de Parto
                            </Label>
                            <Input
                                id="expectedDeliveryDate"
                                type="date"
                                value={formData.expectedDeliveryDate}
                                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !formData.clientId} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">
                            {loading ? "Salvando..." : "Criar Caso"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
