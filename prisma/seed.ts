import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('Password123', 10)

    const users = [
        { email: 'user1@example.com', username: 'user1', roles: [Role.USER] },
        { email: 'user2@example.com', username: 'user2', roles: [Role.USER] },
        { email: 'user3@example.com', username: 'user3', roles: [Role.USER] },
        { email: 'user4@example.com', username: 'user4', roles: [Role.USER] },
        { email: 'admin@example.com', username: 'admin', roles: [Role.ADMIN] },
    ]

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                username: user.username,
                password,
                roles: user.roles,
            },
        })
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })