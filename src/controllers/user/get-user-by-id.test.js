import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if a user is foundS', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if a user is not found', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdController throws a error', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdController witnh corrects params', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
