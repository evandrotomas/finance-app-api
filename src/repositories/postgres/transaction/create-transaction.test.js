import { PostgresCreateTransactionRepository } from './create-transaction'
import { transaction, user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

describe('PostgresCreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        await prisma.user.create({ data: user })

        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({ ...transaction, user_id: user.id })

        const resultDate = dayjs(result.date).utc().startOf('day')
        const expectedDate = dayjs(transaction.date).utc().startOf('day')

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(resultDate.date()).toBe(expectedDate.date())
        expect(resultDate.month()).toBe(expectedDate.month())
        expect(resultDate.year()).toBe(expectedDate.year())
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()
        const primaSpy = import.meta.jest.spyOn(prisma.transaction, 'create')

        await sut.execute({ ...transaction, user_id: user.id })

        expect(primaSpy).toHaveBeenCalledWith({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })
})
