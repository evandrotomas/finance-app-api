import { checkIfIdIsValid, invalidIdResponse, ok } from '../helpers'
import { serverError } from '../helpers.js'

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
            console.error(error)
            return serverError()
        }
    }
}
