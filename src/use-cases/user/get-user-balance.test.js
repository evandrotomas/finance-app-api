import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user'
import { userBalance, user } from '../../tests'

describe('GetUserBalanceUserCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    it('should get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)
        const userId = faker.string.uuid()

        // act
        const promisse = sut.execute(userId)

        // assert
        await expect(promisse).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const spy = jest.spyOn(getUserByIdRepository, 'execute')

        // act
        await sut.execute(userId)

        // assert
        expect(spy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const userId = faker.string.uuid()
        const spy = jest.spyOn(getUserBalanceRepository, 'execute')

        // act
        await sut.execute(userId)

        // assert
        expect(spy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserById throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promisse = sut.execute(faker.string.uuid())

        // assert
        await expect(promisse).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promisse = sut.execute(faker.string.uuid())

        // assert
        await expect(promisse).rejects.toThrow()
    })
})
