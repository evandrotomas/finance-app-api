import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/index.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } })

            if (!user) {
                throw new UserNotFoundError(userId)
            }

            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // P2025 = "An operation failed because it depends on one or more records that were required but not found."
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }
            throw error
        }
    }
}
