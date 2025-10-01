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

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository()

        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakerUser.email)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: fakerUser.email,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByEmailRepository()

        import.meta.jest
            .spyOn(prisma.user, 'findUnique')
            .mockRejectedValueOnce(new Error())

        const promisse = sut.execute(fakerUser.email)

        await expect(promisse).rejects.toThrow()
    })
})
