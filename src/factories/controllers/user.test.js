import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './user'

describe('UserControllerFactories', () => {
    it('should return a valid CreateUserController instance', async () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid GetUserByIdController instance', async () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid makeUpdateUserController instance', async () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })
})
