// import { serverError } from '../helpers'

export class GetTransactionByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    // async execute(httpRequest) {
    //     try {

    //     } catch (error) {
    //         console.error(error)
    //         return serverError({
    //             message: 'An error occurred while get the transaction',
    //         })
    //     }
    // }
}
