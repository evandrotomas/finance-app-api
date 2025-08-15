import { CreateUserController, GetUserByIdController } from '../../controllers'
import { makeCreateUserController, makeGetUserByIdController } from './user'

describe('UserControllerFactories', () => {
    it('should return a valid CreateUserController instance', async () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid GetUserByIdController instance', async () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })
})
