"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function EditAppointmentDialog({
    appointment,
    open,
    onOpenChange,
    onDeleted,
}: {
    appointment: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const dateObj = new Date(appointment.date);
    // Pad to 2 digits for inputs
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const min = String(dateObj.getMinutes()).padStart(2, "0");

    const [formData, setFormData] = useState({
        title: appointment.title,
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${min}`,
        type: appointment.type,
        status: appointment.status,
        description: appointment.description || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const payload = {
                title: formData.title,
                date: dateTime.toISOString(),
                type: formData.type,
                status: formData.status,
                description: formData.description,
            };

            const res = await fetch(`/api/appointments/${appointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onOpenChange(false);
                window.location.reload();
            } else {
                alert("Erro ao editar compromisso");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao editar compromisso");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir esta reunião?")) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/appointments/${appointment.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                onOpenChange(false);
                if (onDeleted) onDeleted();
                window.location.reload();
            } else {
                alert("Erro ao excluir compromisso");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir compromisso");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] glassmorphism border-primary/30 p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-xl">Editar Compromisso</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Altere os detalhes do compromisso ou exclua-o.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right text-muted-foreground">Título</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right text-muted-foreground">Data</Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="flex-1 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                />
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                    className="w-32 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right text-muted-foreground">Tipo</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-white/10">
                                    <SelectItem value="Audiência" className="text-foreground focus:bg-primary focus:text-white">Audiência</SelectItem>
                                    <SelectItem value="Prazo" className="text-foreground focus:bg-primary focus:text-white">Prazo</SelectItem>
                                    <SelectItem value="Reunião" className="text-foreground focus:bg-primary focus:text-white">Reunião</SelectItem>
                                    <SelectItem value="Outro" className="text-foreground focus:bg-primary focus:text-white">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right text-muted-foreground">Urgência</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20">
                                    <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-white/10">
                                    <SelectItem value="Normal" className="text-foreground focus:bg-primary focus:text-white">Normal</SelectItem>
                                    <SelectItem value="Urgent" className="text-foreground focus:bg-primary focus:text-white">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="desc" className="text-right pt-2 text-muted-foreground">Detalhes</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between w-full sm:justify-between gap-2">
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30">
                            Excluir
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
