import { PostgresHelper } from '../../../db/postgres/helper.js'

export const PostgresGetTransactionByUserId = {
    async excute(userId) {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        )

        return transactions
    },
}
