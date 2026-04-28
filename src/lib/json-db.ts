import { prisma } from './prisma';

// Types matching Prisma models
export interface Client {
    id: number;
    fullName: string;
    type: string;
    taxId: string | null;
    password?: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    createdAt: string;
}

export interface Case {
    id: number;
    clientId: number;
    caseNumber: string | null;
    title: string;
    status: string;
    protocolStatus: string;
    expectedDeliveryDate?: string | null;
    court: string | null;
    description: string | null;
    openedAt: string;
    updatedAt: string;
}

export interface Document {
    id: number;
    caseId: number;
    name: string;
    fileType: string | null;
    fileUrl: string;
    version: number;
    uploadedAt: string;
}

export interface Appointment {
    id: number;
    title: string;
    date: string;
    type: string;
    status: string;
    description: string | null;
}

export interface Comment {
    id: number;
    caseId: number;
    content: string;
    createdAt: string;
}

export interface RoutineLog {
    id: number;
    type: string;
    status: string;
    message: string;
    createdAt: string;
}

class JsonDB {
    // --- Clients ---
    async getClients() {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return clients.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString()
        }));
    }

    async createClient(clientData: any) {
        const client = await prisma.client.create({
            data: {
                fullName: clientData.fullName,
                type: clientData.type || "Individual",
                taxId: clientData.taxId || null,
                email: clientData.email || null,
                phone: clientData.phone || null,
                address: clientData.address || null,
                password: clientData.password || null,
            }
        });
        return { ...client, createdAt: client.createdAt.toISOString() };
    }

    // --- Cases ---
    async getCases() {
        const cases = await prisma.case.findMany({
            include: { client: true },
            orderBy: { updatedAt: 'desc' }
        });
        return cases.map(c => ({
            ...c,
            openedAt: c.openedAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
            expectedDeliveryDate: c.expectedDeliveryDate?.toISOString() || null,
            client: { fullName: c.client.fullName }
        }));
    }

    async createCase(caseData: any) {
        const newCase = await prisma.case.create({
            data: {
                title: caseData.title,
                clientId: parseInt(caseData.clientId),
                caseNumber: caseData.caseNumber || null,
                court: caseData.court || null,
                description: caseData.description || null,
                status: caseData.status || "Pendente",
                protocolStatus: caseData.protocolStatus || "Não Protocolado",
                expectedDeliveryDate: caseData.expectedDeliveryDate ? new Date(caseData.expectedDeliveryDate) : null,
                gaveBirth: caseData.gaveBirth || false,
                birthDate: caseData.birthDate ? new Date(caseData.birthDate) : null,
            }
        });
        return {
            ...newCase,
            openedAt: newCase.openedAt.toISOString(),
            updatedAt: newCase.updatedAt.toISOString(),
            expectedDeliveryDate: newCase.expectedDeliveryDate?.toISOString() || null,
            birthDate: newCase.birthDate?.toISOString() || null,
        };
    }

    async updateCase(id: number, data: any) {
        // Build update payload dynamically
        const updateData: any = {};

        if (data.status !== undefined) updateData.status = data.status;
        if (data.protocolStatus !== undefined) updateData.protocolStatus = data.protocolStatus;
        if (data.expectedDeliveryDate !== undefined) {
            updateData.expectedDeliveryDate = data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null;
        }
        if (data.gaveBirth !== undefined) updateData.gaveBirth = Boolean(data.gaveBirth);
        if (data.birthDate !== undefined) {
            updateData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
        }
        if (data.title !== undefined) updateData.title = data.title;
        if (data.caseNumber !== undefined) updateData.caseNumber = data.caseNumber || null;
        if (data.court !== undefined) updateData.court = data.court || null;
        if (data.description !== undefined) updateData.description = data.description || null;

        const c = await prisma.case.update({
            where: { id },
            data: updateData,
            include: {
                client: true,
                documents: true,
                comments: { orderBy: { createdAt: 'desc' } }
            }
        });
        return {
            ...c,
            openedAt: c.openedAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
            expectedDeliveryDate: c.expectedDeliveryDate?.toISOString() || null,
            birthDate: c.birthDate?.toISOString() || null,
            documents: c.documents.map(d => ({ ...d, uploadedAt: d.uploadedAt.toISOString() })),
            comments: c.comments.map(cm => ({ ...cm, createdAt: cm.createdAt.toISOString() }))
        };
    }

    async getCaseById(id: number) {
        const c = await prisma.case.findUnique({
            where: { id },
            include: {
                client: true,
                documents: true,
                comments: { orderBy: { createdAt: 'desc' } }
            }
        });
        if (!c) return null;
        return {
            ...c,
            openedAt: c.openedAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
            expectedDeliveryDate: c.expectedDeliveryDate?.toISOString() || null,
            birthDate: c.birthDate?.toISOString() || null,
            documents: c.documents.map(d => ({ ...d, uploadedAt: d.uploadedAt.toISOString() })),
            comments: c.comments.map(cm => ({ ...cm, createdAt: cm.createdAt.toISOString() }))
        };
    }

    // --- Documents ---
    async createDocument(docData: any) {
        const doc = await prisma.document.create({
            data: {
                caseId: parseInt(docData.caseId),
                name: docData.name,
                fileType: docData.fileType,
                fileUrl: docData.fileUrl,
            }
        });
        return { ...doc, uploadedAt: doc.uploadedAt.toISOString() };
    }

    // --- Appointments ---
    async getAppointments() {
        const appts = await prisma.appointment.findMany({
            orderBy: { date: 'asc' }
        });
        return appts.map(a => ({
            ...a,
            date: a.date.toISOString(),
            createdAt: a.createdAt.toISOString()
        }));
    }

    async createAppointment(apptData: any) {
        const appt = await prisma.appointment.create({
            data: {
                title: apptData.title,
                date: new Date(apptData.date),
                type: apptData.type,
                status: apptData.status,
                description: apptData.description || null,
            }
        });
        return { ...appt, date: appt.date.toISOString(), createdAt: appt.createdAt.toISOString() };
    }

    // --- Comments ---
    async getCommentsByCaseId(caseId: number) {
        const comments = await prisma.comment.findMany({
            where: { caseId },
            orderBy: { createdAt: 'desc' }
        });
        return comments.map(c => ({ ...c, createdAt: c.createdAt.toISOString() }));
    }

    async createComment(commentData: any) {
        const comment = await prisma.comment.create({
            data: {
                caseId: parseInt(commentData.caseId),
                content: commentData.content,
            }
        });
        return { ...comment, createdAt: comment.createdAt.toISOString() };
    }

    // --- Routines ---
    async getRoutineLogs() {
        const logs = await prisma.routineLog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return logs.map(l => ({ ...l, createdAt: l.createdAt.toISOString() }));
    }

    async createRoutineLog(logData: any) {
        const log = await prisma.routineLog.create({
            data: {
                type: logData.type,
                status: logData.status,
                message: logData.message,
            }
        });
        return { ...log, createdAt: log.createdAt.toISOString() };
    }
}

export const db = new JsonDB();
