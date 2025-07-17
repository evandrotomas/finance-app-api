import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    serverError,
} from '../helpers'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `Missing or invalid field: ${field}`,
                    })
                }
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)
            if (!userIdIsValid) {
                return invalidIdResponse({
                    message: 'Invalid user_id format.',
                })
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'Amount must be greater than zero.',
                })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: false,
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'Invalid amount format.',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'The type must be: EARNING, EXPENSE or INVESTMENT.',
                })
            }

            const transaction = await this.createTransactionUseCase.execute(
                ...params,
                type,
            )

            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError({
                message: 'An error occurred while creating the transaction.',
            })
        }
    }
}
