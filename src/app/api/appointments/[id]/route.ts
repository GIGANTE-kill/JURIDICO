import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function PATCH(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const appointmentId = parseInt(id);
        if (isNaN(appointmentId)) {
            return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
        }

        const json = await request.json();
        const appointment = await db.updateAppointment(appointmentId, json);
        return NextResponse.json(appointment);
    } catch (error: any) {
        console.error("Error updating appointment:", error);
        return NextResponse.json(
            { error: error.message || "Error updating appointment" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const appointmentId = parseInt(id);
        if (isNaN(appointmentId)) {
            return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
        }

        await db.deleteAppointment(appointmentId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting appointment:", error);
        return NextResponse.json(
            { error: error.message || "Error deleting appointment" },
            { status: 500 }
        );
    }
}
