import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapater,
    ) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapater = idGeneratorAdapater
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
        const transactionId = this.idGeneratorAdapater.execute()

        // criar a transação
        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
