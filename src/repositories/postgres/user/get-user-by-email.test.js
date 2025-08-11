import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'
import { user as fakerUser } from '../../../tests'

describe('PostgresGetUserByEmail', () => {
    it('should get user by email on db', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toStrictEqual(user)
    })
})
