export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId) {
        const deleteTransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return deleteTransaction
    }
}
