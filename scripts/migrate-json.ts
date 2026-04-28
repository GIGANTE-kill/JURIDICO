import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function migrate() {
    if (!fs.existsSync(DB_PATH)) {
        console.log('No db.json found, skipping migration.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

    // Build old-id -> new-id mapping for clients
    const clientIdMap = new Map<number, number>();

    console.log('Migrating clients...');
    for (const c of data.clients) {
        const client = await prisma.client.create({
            data: {
                fullName: c.fullName,
                type: c.type || 'Individual',
                taxId: c.taxId || null,
                email: c.email || null,
                phone: c.phone || null,
                address: c.address || null,
                password: c.password || null,
                createdAt: new Date(c.createdAt),
            }
        });
        clientIdMap.set(c.id, client.id);
        console.log(`  Client "${c.fullName}": ${c.id} -> ${client.id}`);
    }

    // Build old-id -> new-id mapping for cases
    const caseIdMap = new Map<number, number>();

    console.log('Migrating cases...');
    for (const cs of data.cases) {
        const newClientId = clientIdMap.get(cs.clientId);
        if (!newClientId) {
            console.warn(`  Skipping case "${cs.title}" - client ID ${cs.clientId} not found`);
            continue;
        }
        const newCase = await prisma.case.create({
            data: {
                clientId: newClientId,
                caseNumber: cs.caseNumber || null,
                title: cs.title,
                status: cs.status || 'Pendente',
                protocolStatus: cs.protocolStatus || 'Não Protocolado',
                expectedDeliveryDate: cs.expectedDeliveryDate ? new Date(cs.expectedDeliveryDate) : null,
                court: cs.court || null,
                description: cs.description || null,
                openedAt: new Date(cs.openedAt),
                updatedAt: new Date(cs.updatedAt),
            }
        });
        caseIdMap.set(cs.id, newCase.id);
        console.log(`  Case "${cs.title}": ${cs.id} -> ${newCase.id}`);
    }

    console.log('Migrating documents...');
    for (const d of data.documents) {
        const newCaseId = caseIdMap.get(d.caseId);
        if (!newCaseId) {
            console.warn(`  Skipping document "${d.name}" - case ID ${d.caseId} not found`);
            continue;
        }
        await prisma.document.create({
            data: {
                caseId: newCaseId,
                name: d.name,
                fileType: d.fileType || null,
                fileUrl: d.fileUrl,
                version: d.version || 1,
                uploadedAt: new Date(d.uploadedAt),
            }
        });
        console.log(`  Document "${d.name}" migrated`);
    }

    console.log('Migrating appointments...');
    for (const a of data.appointments) {
        await prisma.appointment.create({
            data: {
                title: a.title,
                date: new Date(a.date),
                type: a.type,
                status: a.status,
                description: a.description || null,
            }
        });
        console.log(`  Appointment "${a.title}" migrated`);
    }

    console.log('Migrating comments...');
    for (const cm of data.comments) {
        const newCaseId = caseIdMap.get(cm.caseId);
        if (!newCaseId) {
            console.warn(`  Skipping comment - case ID ${cm.caseId} not found`);
            continue;
        }
        await prisma.comment.create({
            data: {
                caseId: newCaseId,
                content: cm.content,
                createdAt: new Date(cm.createdAt),
            }
        });
        console.log(`  Comment migrated`);
    }

    console.log('\nMigration complete!');
}

migrate()
    .catch(e => { console.error('Migration failed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
