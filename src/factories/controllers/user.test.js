import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeDeleteUserController,
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

    it('should return a valid UpdateUserController instance', async () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })

    it('should return a valid DeleteUserController instance', async () => {
        expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
    })
})
