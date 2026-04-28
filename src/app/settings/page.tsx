"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações</h1>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList>
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="notifications">Notificações</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Escritório</CardTitle>
                            <CardDescription>
                                Configure os dados que aparecerão em documentos e rodapés.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="firmName">Nome do Escritório</Label>
                                <Input id="firmName" defaultValue="Advocacia Modelo S/S" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="address">Endereço Oficial</Label>
                                <Input id="address" defaultValue="Av. Paulista, 1000 - São Paulo/SP" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>
                                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil do Advogado</CardTitle>
                            <CardDescription>Gerencie suas credenciais de acesso.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" defaultValue="Dr. Matheus" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="oab">Número OAB</Label>
                                <Input id="oab" defaultValue="123.456/SP" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>
                                <Save className="mr-2 h-4 w-4" /> Salvar Perfil
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-slate-500">Configurações de notificação em breve.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
