import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction'
import { transaction } from '../../tests'
import { TransactionNotFoundError } from '../../errors/index.js'

describe('DeleteTransactionController', () => {
    class DeleteTransactionControllerStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionControllerStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    }

    it('should returns 200 when a transaction is deleted successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should returns 400 when transactionId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: {
                transactionId: '123',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should returns 404 when transaction is not found', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should returns 500 when DeleteTransacrionUseCase throws', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        const transactionId = faker.string.uuid()
        const userId = faker.string.uuid()

        // act
        await sut.execute({
            params: {
                transactionId,
                user_id: userId,
            },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId)
    })
})
