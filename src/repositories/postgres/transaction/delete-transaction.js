import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            })
        } catch (error) {
            // P2025 = "An operation failed because it depends on one or more records that were required but not found."
            if (error.code === 'P2025') {
                throw new TransactionNotFoundError(transactionId)
            }
            throw error
        }
    }
}
