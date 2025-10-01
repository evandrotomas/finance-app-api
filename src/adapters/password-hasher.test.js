import { faker } from '@faker-js/faker'
import { PasswordHasherAdapter } from './password-hasher'

describe('PasswordHasherAdapter', () => {
    it('should return a hashed password', async () => {
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password({ length: 7 })

        const result = await sut.execute(password)

        expect(result).toBeTruthy()
        expect(result).not.toBe(password)
    })
})
