export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId) {
        const deleteTransaction =
            await this.deleteTransactionRepository.excute(transactionId)

        return deleteTransaction
    }
}
