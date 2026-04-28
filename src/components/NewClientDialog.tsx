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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function NewClientDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        type: "Individual",
        email: "",
        phone: "",
        taxId: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sanitize data: convert empty strings to null to avoid unique constraint violations
            const payload = {
                ...formData,
                email: formData.email || null,
                phone: formData.phone || null,
                taxId: formData.taxId || null,
                password: formData.password || null,
            };

            const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setOpen(false);
                setFormData({ fullName: "", type: "Individual", email: "", phone: "", taxId: "", password: "" });
                router.refresh();
                window.location.reload();
            } else {
                const text = await res.text();
                let errorMessage = "Erro desconhecido";
                try {
                    const data = JSON.parse(text);
                    errorMessage = data.error || JSON.stringify(data);
                } catch {
                    errorMessage = text || res.statusText;
                }
                alert(`Erro ao criar cliente: ${errorMessage}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Erro na comunicação: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
                    <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glassmorphism border-primary/30 p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-xl">Novo Cliente</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Preencha os dados abaixo para cadastrar um novo cliente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-muted-foreground">
                                Nome
                            </Label>
                            <Input
                                id="name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right text-muted-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right text-muted-foreground">
                                Telefone
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taxId" className="text-right text-muted-foreground">
                                CPF/CNPJ
                            </Label>
                            <Input
                                id="taxId"
                                value={formData.taxId}
                                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right text-muted-foreground">
                                Senha
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="col-span-3 bg-background/50 border-white/10 text-foreground focus:border-primary/50 focus:ring-primary/20"
                                placeholder="Crie uma senha de acesso"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">
                            {loading ? "Salvando..." : "Salvar Cliente"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
