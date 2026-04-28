import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixEmptyCaseNumbers() {
    const result = await prisma.case.updateMany({
        where: { caseNumber: '' },
        data: { caseNumber: null }
    });
    console.log('Fixed empty caseNumbers:', result.count);
    await prisma.$disconnect();
}

fixEmptyCaseNumbers().catch(e => { console.error(e); process.exit(1); });
