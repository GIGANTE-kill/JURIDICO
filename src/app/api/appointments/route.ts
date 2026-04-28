import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function GET() {
    try {
        const appointments = await db.getAppointments();
        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching appointments" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();

        // Basic validation
        if (!json.title || !json.date || !json.type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const appointment = await db.createAppointment(json);
        return NextResponse.json(appointment, { status: 201 });
    } catch (error: any) {
        console.error("Error creating appointment:", error);
        return NextResponse.json(
            { error: error.message || "Error creating appointment" },
            { status: 500 }
        );
    }
}
