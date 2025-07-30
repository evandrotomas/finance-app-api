import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        getUserByEmailRepository,
        postgresUpdateUserRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.postgresUpdateUserRepository = postgresUpdateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(userId, updateUserParams) {
        // 1. se o e-mail estiver sendo atualizado, verificar se ele já está em uso
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        // 2. Se a senha estiver sendo atualizada, criptografar a nova senha
        if (updateUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        // 3. Chamar o repositório para atualizar o usuário no banco de dados
        const updateUser = await this.postgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updateUser
    }
}
