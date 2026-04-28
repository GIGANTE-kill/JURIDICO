import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Prisma Client Version Check:')
    // @ts-ignore
    console.log('Client Provider:', prisma._clientVersion || 'Undefined')

    try {
        // Try a simple count to verify connection and schema match
        const count = await prisma.client.count();
        console.log('Connection successful. Client count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect()
    }
}

main()
