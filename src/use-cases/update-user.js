import bcrypt from 'bcrypt'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/create-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        // 1. se o e-mail estiver sendo atualizado, verificar se ele já está em uso
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        // 2. Se a senha estiver sendo atualizada, criptografar a nova senha
        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        // 3. Chamar o repositório para atualizar o usuário no banco de dados
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updateUser = await new postgresUpdateUserRepository().execute(
            userId,
            user,
        )

        return updateUser
    }
}
