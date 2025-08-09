import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests/index.js'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositorySut {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository = new DeleteTransactionRepositorySut()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return { sut, deleteTransactionRepository }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(transaction.id)

        // asserte
        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionUserRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        // act
        await sut.execute(transaction.id)

        // assert
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        )
    })

    it('should thorw id DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(transaction.id)

        // assert
        await expect(promisse).rejects.toThrow()
    })
})
