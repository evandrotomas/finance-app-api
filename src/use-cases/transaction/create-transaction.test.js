import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user'

describe('CreateTransactionUseCase', () => {
    const transactionParams = {
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(7),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE',
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'id'
        }
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapater = new IdGeneratorAdapterStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapater,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapater,
        }
    }

    it('should create transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(transactionParams)

        // assert
        expect(result).toEqual({ ...transactionParams, id: 'id' })
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // act
        await sut.execute(transactionParams)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            transactionParams.user_id,
        )
    })

    it('should call IdGeneratorAdapter', async () => {
        // arrange
        const { sut, idGeneratorAdapater } = makeSut()
        const idGeneratorAdapaterSpy = jest.spyOn(
            idGeneratorAdapater,
            'execute',
        )
        // act
        await sut.execute(transactionParams)

        // assert
        expect(idGeneratorAdapaterSpy).toHaveBeenCalledWith()
    })

    it('should call CreateTransactionRepository', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionRepositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        // act
        await sut.execute(transactionParams)

        // assert
        expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
            ...transactionParams,
            id: 'id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

        // act
        const promisse = sut.execute(transactionParams)

        // assert
        await expect(promisse).rejects.toThrow(
            new UserNotFoundError(transactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promisse = sut.execute(transactionParams)

        // asset
        await expect(promisse).rejects.toThrow()
    })
})
