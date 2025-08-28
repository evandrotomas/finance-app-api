import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'

import { TransactionNotFoundError } from '../../errors/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUserCase) {
        this.deleteTransactionUserCase = deleteTransactionUserCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const userId = httpRequest.params.user_id

            const transactionIdIsValid = checkIfIdIsValid(transactionId)
            const userIdIsValid = checkIfIdIsValid(userId)

            if (!transactionIdIsValid || !userIdIsValid) {
                return invalidIdResponse()
            }

            const deleteTransaction =
                await this.deleteTransactionUserCase.execute(
                    transactionId,
                    userId,
                )

            return ok(deleteTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.error(error)

            return serverError()
        }
    }
}
