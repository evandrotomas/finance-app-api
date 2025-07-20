import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'

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

            if (!deleteTransaction) {
                return transactionNotFoundResponse()
            }

            return ok(deleteTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
