import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { sut, createTransactionUseCase }
    }
    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.string.alphanumeric(7),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE',
        },
    }

    it('should return 201 when creating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 missing user_id', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            httpRequest: {
                ...httpRequest.body,
                user_id: '',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 missing name', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            httpRequest: {
                ...httpRequest.body,
                name: '',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            httpRequest: {
                ...httpRequest.body,
                date: '',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 missing amount', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            httpRequest: {
                ...httpRequest.body,
                amount: '',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 missing type', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            httpRequest: {
                ...httpRequest.body,
                type: '',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
})
