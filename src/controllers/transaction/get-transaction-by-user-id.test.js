import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transaction-by-user-id'
import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../tests'

describe('GetTransactionByUserIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: {
                userId: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when userId param is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: {
                userId: 'invalid_id',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when user is not found', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when getUserById throws generic error', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute({
            query: {
                userId,
            },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
