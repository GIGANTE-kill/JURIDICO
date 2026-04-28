import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function GET() {
    try {
        const clients = await db.getClients();
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching clients" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const client = await db.createClient(json);
        return NextResponse.json(client, { status: 201 });
    } catch (error: any) {
        console.error("Error creating client:", error);
        return NextResponse.json(
            { error: error.message || "Error creating client" },
            { status: 500 }
        );
    }
}
