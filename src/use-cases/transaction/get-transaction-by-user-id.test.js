import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdUseCase } from './get-transaction-by-user-id'
import { UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'

describe('GetTransactionByUserIdUseCase', () => {
    const userId = faker.string.sut

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return { sut, getTransactionsByUserIdRepository, getUserByIdRepository }
    }

    it('should get transaction by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(userId)

        // assert
        expect(result).toEqual([])
    })

    it('should throw UserNotFoundErro if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        // act
        const promisse = sut.execute(userId)

        // assert
        await expect(promisse).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // act
        await sut.execute(userId)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const getTransactionsByUserIdRepositorySpy = import.meta.jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )

        // act
        await sut.execute(userId)

        // assert
        expect(getTransactionsByUserIdRepositorySpy).toHaveBeenCalledWith(
            userId,
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(userId)

        // assert
        await expect(promisse).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        // arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(userId)

        // assert
        await expect(promisse).rejects.toThrow()
    })
})
