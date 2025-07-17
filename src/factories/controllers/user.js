import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'

import {
    CreateUserUseCase,
    DeleteUSerUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from '../../use-cases/index.js'

import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const createUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)
    return createUserController
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const updateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUSerUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    return deleteUserController
}
