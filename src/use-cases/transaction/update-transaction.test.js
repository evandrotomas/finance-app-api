const { faker } = require('@faker-js/faker')
const { UpdateTransactionUseCase } = require('./update-transaction')

describe('UpdateTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(7),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE',
    }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return { sut, updateTransactionRepository }
    }

    it('should update transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        // assert
        expect(result).toEqual(transaction)
    })
})
