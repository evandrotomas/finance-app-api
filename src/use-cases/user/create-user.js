import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }

    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // Gerar ID do usuário
        const userId = await this.idGeneratorAdapter.execute()

        // criptografar a senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        // Montar o usuário para inserção
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // Inserir o usuário no banco
        const createdUser = await this.createUserRepository.execute(user)

        // Gerar tokens
        const tokens = await this.tokensGeneratorAdapter.execute(userId)

        return {
            ...createdUser,
            tokens,
        }
    }
}
