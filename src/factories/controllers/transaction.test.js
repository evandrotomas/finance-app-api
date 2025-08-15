import { CreateTransactionController } from '../../controllers'
import { makeCreateTransactionController } from './transaction'

describe('TransactionControllerFactoies', () => {
    it('should return a valid CreateTransactionController instance', async () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
