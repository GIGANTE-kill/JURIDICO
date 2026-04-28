"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { NewAppointmentDialog } from "@/components/NewAppointmentDialog";
import { EditAppointmentDialog } from "@/components/EditAppointmentDialog";

type Appointment = {
    id: number;
    title: string;
    date: string;
    type: string;
    status: string;
};

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        fetch("/api/appointments")
            .then((res) => {
                if (res.ok) return res.json();
                return [];
            })
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Filter events for selected date (optional visuals)
    // For now we list all upcoming

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Agenda</h1>
                <NewAppointmentDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Calendar Widget */}
                <div className="md:col-span-4">
                    <Card className="h-full floating-surface">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-base flex items-center gap-2 text-foreground">
                                <CalendarIcon className="h-4 w-4 text-primary" /> Calendário
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center p-4">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border border-white/10 bg-background/50 shadow-inner"
                                locale={undefined}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Events List */}
                <div className="md:col-span-8 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                        Compromissos Próximos
                    </h2>

                    {loading ? (
                        <div className="text-muted-foreground">Carregando agenda...</div>
                    ) : events.length === 0 ? (
                        <div className="text-muted-foreground">Nenhum compromisso agendado.</div>
                    ) : (
                        events.map((evt) => (
                            <Card 
                                key={evt.id} 
                                className="hover:bg-white/[0.02] transition-all cursor-pointer border border-white/5 shadow-lg group jade-accent"
                                onClick={() => {
                                    setSelectedAppointment(evt);
                                    setIsEditDialogOpen(true);
                                }}
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{evt.title}</div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <CalendarIcon className="h-3 w-3" />
                                            {new Date(evt.date).toLocaleDateString("pt-BR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={evt.status === 'Urgent' ? 'destructive' : 'secondary'} className={evt.status === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-primary/10 text-primary border-primary/30'}>
                                            {evt.type}
                                        </Badge>
                                        {evt.status === 'Urgent' && (
                                            <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
                                                <AlertCircle className="h-3 w-3" /> Urgente
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {selectedAppointment && (
                <EditAppointmentDialog
                    appointment={selectedAppointment}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}
        </div>
    );
}
