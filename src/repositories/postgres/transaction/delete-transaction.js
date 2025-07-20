import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const deleteTransaction = await PostgresHelper.query(
            `
        DELETE from transaction
        WHERE id = $1
        RETURNING *
        `,
            [transactionId],
        )

        return deleteTransaction[0]
    }
}
