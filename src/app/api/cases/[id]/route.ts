import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    try {
        const kase = await db.getCaseById(parseInt(id));

        if (!kase) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        return NextResponse.json(kase);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching case" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    try {
        const json = await request.json();
        console.log("[API PATCH /api/cases/" + id + "] Data:", JSON.stringify(json));

        const updated = await db.updateCase(parseInt(id), json);

        if (!updated) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("[API PATCH] Error:", error);
        return NextResponse.json(
            { error: error?.message || "Error updating case" },
            { status: 500 }
        );
    }
}

