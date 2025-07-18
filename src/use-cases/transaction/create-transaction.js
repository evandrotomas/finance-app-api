import { v4 as uuidv4 } from 'uuid'
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(createTransactionParams) {
        // validar se o usuário existe
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        // se não existir, lançar erro
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        // se existir, criar a ID da transação
        const transactionId = uuidv4()

        // criar a transação
        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
