import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user'
import { transaction, user } from '../../tests/index.js'

describe('CreateTransactionUseCase', () => {
    const transactionParams = {
        ...transaction,
        id: undefined,
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'id'
        }
    }

    class CreateTransactionRepositoryStub {
        async execute() {
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
        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
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
        const idGeneratorAdapaterSpy = import.meta.jest.spyOn(
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
        const createTransactionRepositorySpy = import.meta.jest.spyOn(
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
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValue(null)

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
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(transactionParams)

        // asset
        await expect(promisse).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throw', async () => {
        // arrange
        const { sut, idGeneratorAdapater } = makeSut()
        import.meta.jest
            .spyOn(idGeneratorAdapater, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        // act
        const promisse = sut.execute(transactionParams)

        // assert
        await expect(promisse).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throw', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(createTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(transactionParams)

        // assert
        await expect(promisse).rejects.toThrow()
    })
})
