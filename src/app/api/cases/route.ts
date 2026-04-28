import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function GET() {
    try {
        const cases = await db.getCases();
        return NextResponse.json(cases);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching cases" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();

        // Ensure clientId is an integer
        if (json.clientId) json.clientId = parseInt(json.clientId);

        console.log("[API /api/cases POST] Received data:", JSON.stringify(json));

        const newCase = await db.createCase(json);

        console.log("[API /api/cases POST] Created case:", JSON.stringify(newCase));

        return NextResponse.json(newCase, { status: 201 });
    } catch (error: any) {
        console.error("[API /api/cases POST] Error creating case:", error);
        return NextResponse.json(
            { error: error?.message || "Error creating case" },
            { status: 500 }
        );
    }
}
