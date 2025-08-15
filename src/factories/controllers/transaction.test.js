import {
    CreateTransactionController,
    UpdatetransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeUpdateTransactionController,
} from './transaction'

describe('TransactionControllerFactoies', () => {
    it('should return a valid CreateTransactionController instance', async () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', async () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdatetransactionController,
        )
    })
})
