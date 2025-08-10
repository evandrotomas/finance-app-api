import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        // arrange
        const sut = new PostgresCreateUserRepository()

        // act
        const result = await sut.execute(user)

        // assert
        expect(result).not.toBeNull()
    })
})
