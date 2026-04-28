import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;
        const caseId = data.get("caseId") as string;
        const name = data.get("name") as string;

        if (!file || !caseId) {
            return NextResponse.json({ error: "Missing file or caseId" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

        // Ensure upload dir exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Save file
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        // Save to DB
        const fileUrl = `/uploads/${filename}`;
        const doc = await db.createDocument({
            caseId: parseInt(caseId),
            name: name || file.name,
            fileType: file.type,
            fileUrl: fileUrl,
        });

        return NextResponse.json(doc);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}
