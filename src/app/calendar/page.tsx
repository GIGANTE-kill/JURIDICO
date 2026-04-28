"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { NewAppointmentDialog } from "@/components/NewAppointmentDialog";

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
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda</h1>
                <NewAppointmentDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Calendar Widget */}
                <div className="md:col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" /> Calendário
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow-sm"
                                locale={undefined}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Events List */}
                <div className="md:col-span-8 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-slate-500" />
                        Compromissos Próximos
                    </h2>

                    {loading ? (
                        <div className="text-slate-500">Carregando agenda...</div>
                    ) : events.length === 0 ? (
                        <div className="text-slate-500">Nenhum compromisso agendado.</div>
                    ) : (
                        events.map((evt) => (
                            <Card key={evt.id} className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-blue-500">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-slate-900">{evt.title}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-2">
                                            <CalendarIcon className="h-3 w-3" />
                                            {new Date(evt.date).toLocaleDateString("pt-BR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={evt.status === 'Urgent' ? 'destructive' : 'secondary'}>
                                            {evt.type}
                                        </Badge>
                                        {evt.status === 'Urgent' && (
                                            <span className="text-xs text-red-600 flex items-center gap-1 font-medium">
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
        </div>
    );
}
