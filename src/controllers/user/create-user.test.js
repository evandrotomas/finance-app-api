import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
    }

    it('should returns 201 when creating an user succesfuly', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should returns 400 if first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, first_name: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should returns 400 if last_name is not provided', async () => {
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, last_name: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should returns 400 if email is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, email: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should returns 400 if pasword is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, password: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should returns 400 if pasword is less than 6 characters', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should returns 500 if CreateUserUseCase throws', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if CreateUserUseCase throws EmailIsAlreadyInUseError', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
