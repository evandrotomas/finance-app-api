import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakerUser } from '../../../tests'
import { PostgresGetUserBalanceRepository } from './get-user-balance'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EARNING',
                    amount: 5000,
                },
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EARNING',
                    amount: 5000,
                },
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EXPENSE',
                    amount: 1000,
                },
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EXPENSE',
                    amount: 1000,
                },
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'INVESTMENT',
                    amount: 3000,
                },
                {
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'INVESTMENT',
                    amount: 3000,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })
})
