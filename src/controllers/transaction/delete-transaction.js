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

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deleteTransaction =
                await this.deleteTransactionUserCase.execute(transactionId)

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
