import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/index.js'

import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    constructor(postgresCreateUserRepository) {
        this.postgresCreateUserRepository = postgresCreateUserRepository
    }

    async excute(createUserParams) {
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // Gerar ID do usuário
        const userId = uuidv4()

        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
        // inserir o usuário o banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositório

        const createdUser =
            await this.postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
