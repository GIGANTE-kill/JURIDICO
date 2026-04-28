import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function POST(request: Request) {
    try {
        const json = await request.json();

        if (!json.caseId || !json.content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const comment = await db.createComment({
            caseId: parseInt(json.caseId),
            content: json.content
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error: any) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: error.message || "Error creating comment" },
            { status: 500 }
        );
    }
}
