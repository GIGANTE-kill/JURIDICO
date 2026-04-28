import { NextResponse } from "next/server";
import { db } from "@/lib/json-db";

export async function POST() {
    try {
        // 1. Simulate finding clients without phone numbers (Data Quality Check)
        const clients = await db.getClients();
        const incompleteClients = clients.filter((c: any) => !c.phone).length;

        // 2. Simulate finding 'stalled' cases (Open for > 30 days - simulated count)
        const cases = await db.getCases();
        const stalledCases = cases.filter((c: any) => c.status === "Open").length;

        const message = `Verificação concluída. ${incompleteClients} clientes sem telefone. ${stalledCases} processos abertos pendentes de atualização.`;

        // 3. Log the routine
        const log = await db.createRoutineLog({
            type: "Verificação Diária",
            status: "Success",
            message: message
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error running routine" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const logs = (await db.getRoutineLogs()).slice(0, 5);
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching logs" }, { status: 500 });
    }
}
