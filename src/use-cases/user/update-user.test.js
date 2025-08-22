import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user } from '../../tests'

describe('UpdateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }

    it('should update user successfully (without email and password)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        // assert
        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = import.meta.jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )

        const email = faker.internet.email()

        // act
        const result = await sut.execute(faker.string.uuid(), {
            email,
        })

        // assert
        expect(getUserByEmailRepositorySpy).toHaveBeenLastCalledWith(email)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const password = faker.internet.password()

        // act
        const result = await sut.execute(faker.string.uuid(), {
            password,
        })
        // assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use ', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValue(user)

        // act
        const promisse = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        // assert
        expect(promisse).rejects.toThrow(new EmailAlreadyInUseError(user.email))
    })

    it('should call UpdateUserRepository wirh correct params', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut()
        const updateUserRepositorySpy = import.meta.jest.spyOn(
            updateUserRepository,
            'execute',
        )
        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }

        // act
        await sut.execute(user.id, updateUserParams)

        // assert
        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'hashed_password',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(faker.string.uuid(), { email: user.email })

        // assert
        await expect(promisse).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(faker.string.uuid(), {
            password: user.password,
        })

        // assert
        await expect(promisse).rejects.toThrow()
    })

    it('should throw if UpdateUserRepository throws', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut()
        import.meta.jest
            .spyOn(updateUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promisse = sut.execute(faker.string.uuid(), {
            user,
        })

        // assert
        await expect(promisse).rejects.toThrow()
    })
})
