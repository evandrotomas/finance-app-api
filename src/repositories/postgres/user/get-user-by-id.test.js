import { prisma } from '../../../../prisma/prisma'
import { user as fakerUser } from '../../../tests'
import { PostgresGetUserByIdRepository } from './get-user-by-id'

describe('PostgresGetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakerUser.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakerUser.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByIdRepository()

        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        const promisse = sut.execute(fakerUser.id)

        await expect(promisse).rejects.toThrow()
    })
})
