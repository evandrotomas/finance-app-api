import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests/index.js'
import { faker } from '@faker-js/faker'

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()

    class DeleteTransactionRepositorySut {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository = new DeleteTransactionRepositorySut()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(transaction.id, user_id)

        // asserte
        expect(result).toEqual({ ...transaction, user_id })
    })

    it('should call DeleteTransactionUserRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        // act
        await sut.execute(transaction.id, user_id)

        // assert
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        )
    })

    it('should thorw id DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(transaction.id, user_id)

        // assert
        await expect(promisse).rejects.toThrow()
    })
})
